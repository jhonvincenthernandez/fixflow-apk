import { z } from 'zod'
import {
  AppointmentSchema,
  ClosureSchema,
  FeedbackSchema,
  HistoryEntrySchema,
  NotificationSchema,
  PublicUserSchema,
  QuotationSchema,
  ServiceRequestSchema,
  UserSchema,
} from '@/domain/types'
import type { AppNotification, PublicUser, ServiceRequest, User } from '@/domain/types'
import {
  decodeJson,
  decodeNullableJson,
  encodeJson,
  fromTimestamp,
  parseStored,
  requireTimestamp,
  toTimestamp,
} from './client'

/* ------------------------------------------------------------
   Rows returned by the Data Connect connector.
   ------------------------------------------------------------ */
export interface FixflowUserRow {
  readonly id: string
  readonly role: string
  readonly name: string
  readonly email: string
  readonly phone: string
  readonly createdAt: string
}

export interface LoginUserRow extends FixflowUserRow {
  readonly passwordHash: string
  readonly salt: string
  readonly iterations: number
}

export interface ServiceRequestRow {
  readonly id: string
  readonly ref: string
  readonly customerId: string
  readonly serviceId: string
  readonly itemName: string
  readonly description: string
  readonly mode: string
  readonly address: string
  readonly status: string
  readonly quotationJson?: string | null
  readonly appointmentJson?: string | null
  readonly feedbackJson?: string | null
  readonly closureJson?: string | null
  readonly historyJson: string
  readonly imageIdsJson: string
  readonly createdAt: string
  readonly updatedAt: string
}

export interface NotificationRow {
  readonly id: string
  readonly userId: string
  readonly requestId: string
  readonly title: string
  readonly body: string
  readonly createdAt: string
  readonly readAt?: string | null
}

/* ------------------------------------------------------------
   Database row to domain object.
   ------------------------------------------------------------ */
export function toPublicUser(row: FixflowUserRow): PublicUser {
  return parseStored(
    PublicUserSchema,
    {
      id: row.id,
      role: row.role,
      name: row.name,
      email: row.email,
      phone: row.phone,
      createdAt: requireTimestamp(row.createdAt),
    },
    'user',
  )
}

export function toStoredUser(row: LoginUserRow): User {
  return parseStored(
    UserSchema,
    {
      id: row.id,
      role: row.role,
      name: row.name,
      email: row.email,
      phone: row.phone,
      passwordHash: row.passwordHash,
      salt: row.salt,
      iterations: row.iterations,
      createdAt: requireTimestamp(row.createdAt),
    },
    'user',
  )
}

export function toServiceRequest(row: ServiceRequestRow): ServiceRequest {
  return parseStored(
    ServiceRequestSchema,
    {
      id: row.id,
      ref: row.ref,
      customerId: row.customerId,
      serviceId: row.serviceId,
      itemName: row.itemName,
      description: row.description,
      mode: row.mode,
      address: row.address,
      imageIds: decodeJson(z.array(z.string()), row.imageIdsJson, []),
      status: row.status,
      quotation: decodeNullableJson(QuotationSchema, row.quotationJson),
      appointment: decodeNullableJson(AppointmentSchema, row.appointmentJson),
      feedback: decodeNullableJson(FeedbackSchema, row.feedbackJson),
      closure: decodeNullableJson(ClosureSchema, row.closureJson),
      history: decodeJson(z.array(HistoryEntrySchema), row.historyJson, []),
      createdAt: requireTimestamp(row.createdAt),
      updatedAt: requireTimestamp(row.updatedAt),
    },
    'request',
  )
}

export function toNotification(row: NotificationRow): AppNotification {
  return parseStored(
    NotificationSchema,
    {
      id: row.id,
      userId: row.userId,
      requestId: row.requestId,
      title: row.title,
      body: row.body,
      createdAt: requireTimestamp(row.createdAt),
      readAt: fromTimestamp(row.readAt),
    },
    'notification',
  )
}

/* ------------------------------------------------------------
   Domain object to database columns.
   ------------------------------------------------------------ */
export function fromDomainUser(user: User): PublicUser {
  return parseStored(PublicUserSchema, user, 'user')
}

export function encodeWorkflow(request: ServiceRequest) {
  return {
    status: request.status,
    quotationJson: encodeJson(request.quotation),
    appointmentJson: encodeJson(request.appointment),
    feedbackJson: encodeJson(request.feedback),
    closureJson: encodeJson(request.closure),
    historyJson: JSON.stringify(request.history),
    updatedAt: toTimestamp(request.updatedAt),
  }
}
