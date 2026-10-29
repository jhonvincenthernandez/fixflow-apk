import {
  createAppMeta,
  createFixflowUser,
  createNotification as createNotificationRow,
  createRequestImage,
  createServiceRequest,
  getAppMeta,
  getFixflowUser,
  getFixflowUserForLogin,
  getNotification,
  getServiceRequest,
  listAllServiceRequests,
  listFixflowUsersByRole,
  listNotifications as listNotificationRows,
  listRequestImages,
  listScheduledServiceRequests,
  listServiceRequestsByCustomer,
  markNotificationRead as markNotificationReadRow,
  updateAppMeta,
  updateServiceRequest,
} from '@dataconnect/generated'
import {
  AuthError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  StorageError,
  ValidationError,
} from '@/domain/errors'
import { AvailabilityInputSchema, AvailabilitySchema, defaultAvailability, tidyDaysOff } from '@/domain/availability'
import type { Availability } from '@/domain/availability'
import { formatRef, newId } from '@/domain/ids'
import { logger } from '@/domain/logger'
import { toBooking } from '@/domain/schedule'
import type { Booking } from '@/domain/schedule'
import {
  LoginInputSchema,
  MAX_IMAGES,
  NewRequestInputSchema,
  AppointmentSchema,
  RegisterInputSchema,
  parseOrThrow,
} from '@/domain/types'
import type { AppNotification, PublicUser, ServiceRequest, User } from '@/domain/types'
import { applyAction, notificationsFor } from '@/domain/workflow'
import type { ActionInput, Actor, NotificationDraft } from '@/domain/workflow'
import { dataConnect, decodeJson, decodeNullableJson, freshRead, isUniqueViolation, toStorageError, toTimestamp } from './client'
import { dataConfig } from './config'
import { AVAILABILITY_KEY, REQUEST_COUNTER_KEY } from './meta'
import { encodeWorkflow, fromDomainUser, toNotification, toPublicUser, toServiceRequest, toStoredUser } from './mappers'
import { hashPassword, verifyPassword } from './password'

/* ------------------------------------------------------------
   Shared helpers
   ------------------------------------------------------------ */
export interface StoredImage {
  readonly id: string
  readonly requestId: string
  readonly name: string
  readonly blob: Blob
}

export interface ImageUpload {
  readonly name: string
  readonly blob: Blob
}

function newestFirst(requests: readonly ServiceRequest[]): ServiceRequest[] {
  return [...requests].sort((a, b) => b.updatedAt - a.updatedAt)
}

/** Reads the user row and confirms the actor still exists with the same role. */
async function requireActor(actor: Actor): Promise<PublicUser> {
  let user: PublicUser
  try {
    const { data } = await getFixflowUser(dataConnect, { id: actor.id }, freshRead)
    if (data.fixflowUser === undefined) throw new AuthError()
    user = toPublicUser(data.fixflowUser)
  } catch (error) {
    throw toStorageError(error, 'load your account')
  }
  if (user.role !== actor.role) throw new AuthError()
  return user
}

async function ownerIdsIn(): Promise<string[]> {
  try {
    const { data } = await listFixflowUsersByRole(dataConnect, { role: 'owner' }, freshRead)
    return data.fixflowUsers.map((user) => user.id)
  } catch (error) {
    throw toStorageError(error, 'load the shop owner accounts')
  }
}

export async function readMetaValue(key: string): Promise<string | null> {
  try {
    const { data } = await getAppMeta(dataConnect, { key }, freshRead)
    return data.appMetas[0]?.value ?? null
  } catch (error) {
    throw toStorageError(error, 'read the shared settings')
  }
}

export async function writeMetaValue(key: string, value: string, now: number = Date.now()): Promise<void> {
  try {
    const { data } = await getAppMeta(dataConnect, { key }, freshRead)
    const existing = data.appMetas[0]
    if (existing !== undefined) {
      await updateAppMeta(dataConnect, { id: existing.id, value, updatedAt: toTimestamp(now) })
      return
    }
    try {
      await createAppMeta(dataConnect, { key, value, updatedAt: toTimestamp(now) })
    } catch (error) {
      if (!isUniqueViolation(error)) throw error
      const { data: retried } = await getAppMeta(dataConnect, { key }, freshRead)
      const row = retried.appMetas[0]
      if (row === undefined) throw error
      await updateAppMeta(dataConnect, { id: row.id, value, updatedAt: toTimestamp(now) })
    }
  } catch (error) {
    throw toStorageError(error, 'save the shared settings')
  }
}

async function sendNotifications(drafts: readonly NotificationDraft[], requestId: string, now: number): Promise<void> {
  await Promise.all(
    drafts.map((draft) =>
      createNotificationRow(dataConnect, {
        id: newId(),
        userId: draft.userId,
        requestId,
        title: draft.title,
        body: draft.body,
        createdAt: toTimestamp(now),
      }),
    ),
  )
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new StorageError('The selected photo could not be encoded'))
    }
    reader.onerror = () => reject(new StorageError('The selected photo could not be read', { cause: reader.error }))
    reader.readAsDataURL(blob)
  })
}

function dataUrlToBlob(dataUrl: string, mimeType: string): Blob {
  const comma = dataUrl.indexOf(',')
  if (comma === -1) throw new StorageError('Stored photo data is not valid')
  const header = dataUrl.slice(0, comma)
  const payload = dataUrl.slice(comma + 1)
  try {
    const binary = header.includes(';base64') ? atob(payload) : decodeURIComponent(payload)
    const bytes = new Uint8Array(binary.length)
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
    return new Blob([bytes], { type: mimeType })
  } catch (error) {
    throw new StorageError('Stored photo data could not be decoded', { cause: error })
  }
}

/* ------------------------------------------------------------
   Accounts
   ------------------------------------------------------------ */
export async function registerCustomer(input: unknown, now: number = Date.now()): Promise<PublicUser> {
  const parsed = parseOrThrow(RegisterInputSchema, input)
  const record = await hashPassword(parsed.password)
  const user: User = {
    id: newId(),
    role: 'customer',
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone,
    ...record,
    createdAt: now,
  }

  try {
    await createFixflowUser(dataConnect, {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
      passwordHash: user.passwordHash,
      salt: user.salt,
      iterations: user.iterations,
      createdAt: toTimestamp(user.createdAt),
    })
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ConflictError('An account with that email already exists. Sign in instead.')
    }
    throw toStorageError(error, 'create your account')
  }
  return fromDomainUser(user)
}

export async function authenticate(input: unknown): Promise<PublicUser> {
  const parsed = parseOrThrow(LoginInputSchema, input)
  const invalid = new AuthError('Email or password is incorrect.')

  let row
  try {
    const { data } = await getFixflowUserForLogin(dataConnect, { email: parsed.email }, freshRead)
    row = data.fixflowUsers[0]
  } catch (error) {
    throw toStorageError(error, 'sign in')
  }
  if (row === undefined) throw invalid

  const user = toStoredUser(row)
  if (!(await verifyPassword(parsed.password, user))) throw invalid
  return fromDomainUser(user)
}

export async function getUser(id: string): Promise<PublicUser> {
  try {
    const { data } = await getFixflowUser(dataConnect, { id }, freshRead)
    if (data.fixflowUser === undefined) throw new AuthError()
    return toPublicUser(data.fixflowUser)
  } catch (error) {
    throw toStorageError(error, 'load your account')
  }
}

/** Owner-only: customer names and phone numbers for the request list and detail views. */
export async function listCustomers(actor: Actor): Promise<PublicUser[]> {
  await requireActor(actor)
  if (actor.role !== 'owner') throw new ForbiddenError('Only the shop can view customers.')
  try {
    const { data } = await listFixflowUsersByRole(dataConnect, { role: 'customer' }, freshRead)
    return data.fixflowUsers.map(toPublicUser)
  } catch (error) {
    throw toStorageError(error, 'load customers')
  }
}

/* ------------------------------------------------------------
   Requests
   ------------------------------------------------------------ */
export async function listRequests(actor: Actor): Promise<ServiceRequest[]> {
  await requireActor(actor)
  try {
    const { data } =
      actor.role === 'owner'
        ? await listAllServiceRequests(dataConnect, freshRead)
        : await listServiceRequestsByCustomer(dataConnect, { customerId: actor.id }, freshRead)
    return newestFirst(data.serviceRequests.map(toServiceRequest))
  } catch (error) {
    throw toStorageError(error, 'load requests')
  }
}

export async function getRequest(actor: Actor, id: string): Promise<ServiceRequest> {
  await requireActor(actor)
  try {
    const { data } = await getServiceRequest(dataConnect, { id }, freshRead)
    const notFound = new NotFoundError('We could not find that request.')
    if (data.serviceRequest === undefined) throw notFound
    const request = toServiceRequest(data.serviceRequest)
    // A customer asking for someone else's request gets the same answer as a missing one.
    if (actor.role === 'customer' && request.customerId !== actor.id) throw notFound
    return request
  } catch (error) {
    throw toStorageError(error, 'load the request')
  }
}

export async function createRequest(
  actor: Actor,
  input: unknown,
  uploads: readonly ImageUpload[],
  now: number = Date.now(),
): Promise<ServiceRequest> {
  if (actor.role !== 'customer') throw new ForbiddenError('Only customers can submit requests.')
  const parsed = parseOrThrow(NewRequestInputSchema, input)

  if (uploads.length > MAX_IMAGES) {
    throw new ValidationError({ images: [`Attach up to ${MAX_IMAGES} photos.`] })
  }
  for (const upload of uploads) {
    if (!upload.blob.type.startsWith('image/')) {
      throw new ValidationError({ images: ['Only image files can be attached.'] })
    }
    if (upload.blob.size > dataConfig.maxImageBytes) {
      throw new ValidationError({ images: ['One of the photos is too large. Choose a smaller one.'] })
    }
  }

  const customer = await requireActor(actor)

  const counterRaw = await readMetaValue(REQUEST_COUNTER_KEY)
  const previous = counterRaw === null ? 0 : Number.parseInt(counterRaw, 10)
  const sequence = Number.isFinite(previous) ? previous + 1 : 1
  await writeMetaValue(REQUEST_COUNTER_KEY, String(sequence), now)

  const id = newId()
  const imageIds = uploads.map(() => newId())
  const request: ServiceRequest = {
    id,
    ref: formatRef(sequence),
    customerId: customer.id,
    serviceId: parsed.serviceId,
    itemName: parsed.itemName,
    description: parsed.description,
    mode: parsed.mode,
    address: parsed.mode === 'home_visit' ? parsed.address : '',
    imageIds,
    status: 'requested',
    quotation: null,
    appointment: null,
    feedback: null,
    closure: null,
    history: [{ status: 'requested', at: now, by: 'customer', note: '' }],
    createdAt: now,
    updatedAt: now,
  }

  try {
    await createServiceRequest(dataConnect, {
      id: request.id,
      ref: request.ref,
      customerId: request.customerId,
      serviceId: request.serviceId,
      itemName: request.itemName,
      description: request.description,
      mode: request.mode,
      address: request.address,
      status: request.status,
      quotationJson: null,
      appointmentJson: null,
      feedbackJson: null,
      closureJson: null,
      historyJson: JSON.stringify(request.history),
      imageIdsJson: JSON.stringify(request.imageIds),
      createdAt: toTimestamp(request.createdAt),
      updatedAt: toTimestamp(request.updatedAt),
    })
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ConflictError('Another request was saved at the same moment. Submit again.')
    }
    throw toStorageError(error, 'save the request')
  }

  if (uploads.length > 0) {
    try {
      const dataUrls = await Promise.all(uploads.map((upload) => blobToDataUrl(upload.blob)))
      await Promise.all(
        uploads.map((upload, index) =>
          createRequestImage(dataConnect, {
            id: imageIds[index] ?? newId(),
            requestId: id,
            name: upload.name,
            mimeType: upload.blob.type || 'image/jpeg',
            dataUrl: dataUrls[index] ?? '',
            createdAt: toTimestamp(now),
          }),
        ),
      )
    } catch (error) {
      logger.error('Saving request photos failed', error, { requestId: id })
      throw toStorageError(error, 'save the request photos')
    }
  }

  try {
    const ownerIds = await ownerIdsIn()
    await sendNotifications(
      ownerIds.map((userId) => ({
        userId,
        title: 'New service request',
        body: `${request.ref}: ${customer.name} submitted a request for ${request.itemName}.`,
      })),
      id,
      now,
    )
  } catch (error) {
    // The request is already saved. A missed alert must not turn a success into a failure.
    logger.warn('Saving owner notifications failed', { requestId: id, error: String(error) })
  }

  return request
}

/** Time ranges of every active appointment, optionally excluding one request. No personal data. */
async function readAvailability(): Promise<Availability> {
  const stored = await readMetaValue(AVAILABILITY_KEY)
  if (stored === null) return defaultAvailability()
  return decodeJson(AvailabilitySchema, stored, defaultAvailability())
}

/**
 * Applies one workflow action. The slot check uses the availability stored right now,
 * so two people cannot book a slot the owner has just closed.
 */
export async function performAction(
  actor: Actor,
  requestId: string,
  input: ActionInput,
  now: number = Date.now(),
): Promise<ServiceRequest> {
  await requireActor(actor)

  let current: ServiceRequest
  try {
    const { data } = await getServiceRequest(dataConnect, { id: requestId }, freshRead)
    if (data.serviceRequest === undefined) throw new NotFoundError('We could not find that request.')
    current = toServiceRequest(data.serviceRequest)
  } catch (error) {
    throw toStorageError(error, 'load the request')
  }
  if (actor.role === 'customer' && current.customerId !== actor.id) {
    throw new NotFoundError('We could not find that request.')
  }

  let bookings: Booking[] = []
  let availability = defaultAvailability()
  if (input.action === 'schedule') {
    availability = await readAvailability()
    try {
      const { data } = await listScheduledServiceRequests(dataConnect, freshRead)
      bookings = data.serviceRequests.flatMap((row) => {
        if (row.id === requestId || row.appointmentJson == null) return []
        const appointment = decodeNullableJson(AppointmentSchema, row.appointmentJson)
        return appointment === null ? [] : [toBooking(appointment)]
      })
    } catch (error) {
      throw toStorageError(error, 'load appointment times')
    }
  }

  const next = applyAction(current, input, actor, { now, bookings, availability })

  try {
    await updateServiceRequest(dataConnect, {
      id: next.id,
      ...encodeWorkflow(next),
    })
  } catch (error) {
    throw toStorageError(error, 'save the request')
  }

  try {
    const ownerIds = actor.role === 'owner' ? [] : await ownerIdsIn()
    await sendNotifications(notificationsFor(next, input, actor, ownerIds), next.id, now)
  } catch (error) {
    // The status change is already saved. Do not report a failed action because an alert failed.
    logger.warn('Saving workflow notifications failed', { requestId: next.id, error: String(error) })
  }

  return next
}

/* ------------------------------------------------------------
   Availability (managed by the owner, read by everyone)
   ------------------------------------------------------------ */
export interface ScheduleContext {
  readonly availability: Availability
  readonly bookings: readonly Booking[]
}

export async function getAvailability(actor: Actor): Promise<Availability> {
  await requireActor(actor)
  return readAvailability()
}

/** Everything a slot picker needs, read together so the two halves agree. */
export async function getScheduleContext(actor: Actor, excludeRequestId?: string): Promise<ScheduleContext> {
  await requireActor(actor)
  const availability = await readAvailability()
  try {
    const { data } = await listScheduledServiceRequests(dataConnect, freshRead)
    const bookings = data.serviceRequests.flatMap((row) => {
      if (row.id === excludeRequestId || row.appointmentJson == null) return []
      const appointment = decodeNullableJson(AppointmentSchema, row.appointmentJson)
      return appointment === null ? [] : [toBooking(appointment)]
    })
    return { availability, bookings }
  } catch (error) {
    throw toStorageError(error, 'load appointment times')
  }
}

/**
 * Owner only. Saving never cancels or moves appointments that are already booked; the owner
 * screen warns about any that now fall outside the new hours instead.
 */
export async function saveAvailability(actor: Actor, input: unknown, now: number = Date.now()): Promise<Availability> {
  if (actor.role !== 'owner') throw new ForbiddenError('Only the shop owner can change the schedule.')
  const parsed = parseOrThrow(AvailabilityInputSchema, input)
  const availability: Availability = { ...parsed, daysOff: tidyDaysOff(parsed.daysOff, now), updatedAt: now }
  await writeMetaValue(AVAILABILITY_KEY, JSON.stringify(availability), now)
  return availability
}

export async function getRequestImages(actor: Actor, requestId: string): Promise<StoredImage[]> {
  await requireActor(actor)
  let request: ServiceRequest
  try {
    const { data } = await getServiceRequest(dataConnect, { id: requestId }, freshRead)
    if (data.serviceRequest === undefined) throw new NotFoundError('We could not find that request.')
    request = toServiceRequest(data.serviceRequest)
  } catch (error) {
    throw toStorageError(error, 'load the request photos')
  }
  if (actor.role === 'customer' && request.customerId !== actor.id) {
    throw new NotFoundError('We could not find that request.')
  }

  try {
    const { data } = await listRequestImages(dataConnect, { requestId }, freshRead)
    const byId = new Map(data.requestImages.map((image) => [image.id, image]))
    return request.imageIds.flatMap((id) => {
      const image = byId.get(id)
      if (image === undefined) return []
      return [
        {
          id: image.id,
          requestId: image.requestId,
          name: image.name,
          blob: dataUrlToBlob(image.dataUrl, image.mimeType),
        },
      ]
    })
  } catch (error) {
    throw toStorageError(error, 'load the request photos')
  }
}

/* ------------------------------------------------------------
   Notifications
   ------------------------------------------------------------ */
export async function listNotifications(userId: string): Promise<AppNotification[]> {
  try {
    const { data } = await listNotificationRows(dataConnect, { userId }, freshRead)
    return data.notifications.map(toNotification)
  } catch (error) {
    throw toStorageError(error, 'load alerts')
  }
}

export async function markNotificationRead(userId: string, id: string, now: number = Date.now()): Promise<void> {
  try {
    const { data } = await getNotification(dataConnect, { id }, freshRead)
    const notFound = new NotFoundError('We could not find that notification.')
    if (data.notification === undefined) throw notFound
    const notification = toNotification(data.notification)
    if (notification.userId !== userId) throw notFound
    if (notification.readAt !== null) return
    await markNotificationReadRow(dataConnect, { id, readAt: toTimestamp(now) })
  } catch (error) {
    throw toStorageError(error, 'update the notification')
  }
}

export async function markAllNotificationsRead(userId: string, now: number = Date.now()): Promise<void> {
  const notifications = await listNotifications(userId)
  const unread = notifications.filter((notification) => notification.readAt === null)
  try {
    await Promise.all(
      unread.map((notification) => markNotificationReadRow(dataConnect, { id: notification.id, readAt: toTimestamp(now) })),
    )
  } catch (error) {
    throw toStorageError(error, 'update the notifications')
  }
}
