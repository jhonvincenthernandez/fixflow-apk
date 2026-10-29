import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AppMeta_Key {
  id: UUIDString;
  __typename?: 'AppMeta_Key';
}

export interface CheckConnectionData {
  appMetas: ({
    key: string;
  })[];
}

export interface CreateAppMetaData {
  appMeta_insert: AppMeta_Key;
}

export interface CreateAppMetaVariables {
  key: string;
  value: string;
  updatedAt: TimestampString;
}

export interface CreateFixflowUserData {
  fixflowUser_insert: FixflowUser_Key;
}

export interface CreateFixflowUserVariables {
  id: UUIDString;
  role: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  salt: string;
  iterations: number;
  createdAt: TimestampString;
}

export interface CreateNotificationData {
  notification_insert: Notification_Key;
}

export interface CreateNotificationVariables {
  id: UUIDString;
  userId: UUIDString;
  requestId: UUIDString;
  title: string;
  body: string;
  createdAt: TimestampString;
}

export interface CreateRequestImageData {
  requestImage_insert: RequestImage_Key;
}

export interface CreateRequestImageVariables {
  id: UUIDString;
  requestId: UUIDString;
  name: string;
  mimeType: string;
  dataUrl: string;
  createdAt: TimestampString;
}

export interface CreateServiceRequestData {
  serviceRequest_insert: ServiceRequest_Key;
}

export interface CreateServiceRequestVariables {
  id: UUIDString;
  ref: string;
  customerId: UUIDString;
  serviceId: string;
  itemName: string;
  description: string;
  mode: string;
  address: string;
  status: string;
  quotationJson?: string | null;
  appointmentJson?: string | null;
  feedbackJson?: string | null;
  closureJson?: string | null;
  historyJson: string;
  imageIdsJson: string;
  createdAt: TimestampString;
  updatedAt: TimestampString;
}

export interface DeleteAppMetaData {
  appMeta_delete?: AppMeta_Key | null;
}

export interface DeleteAppMetaVariables {
  id: UUIDString;
}

export interface DeleteFixflowUserData {
  fixflowUser_delete?: FixflowUser_Key | null;
}

export interface DeleteFixflowUserVariables {
  id: UUIDString;
}

export interface DeleteNotificationData {
  notification_delete?: Notification_Key | null;
}

export interface DeleteNotificationVariables {
  id: UUIDString;
}

export interface DeleteRequestImageData {
  requestImage_delete?: RequestImage_Key | null;
}

export interface DeleteRequestImageVariables {
  id: UUIDString;
}

export interface DeleteServiceRequestData {
  serviceRequest_delete?: ServiceRequest_Key | null;
}

export interface DeleteServiceRequestVariables {
  id: UUIDString;
}

export interface FixflowUser_Key {
  id: UUIDString;
  __typename?: 'FixflowUser_Key';
}

export interface GetAppMetaData {
  appMetas: ({
    id: UUIDString;
    key: string;
    value: string;
  } & AppMeta_Key)[];
}

export interface GetAppMetaVariables {
  key: string;
}

export interface GetFixflowUserData {
  fixflowUser?: {
    id: UUIDString;
    role: string;
    name: string;
    email: string;
    phone: string;
    createdAt: TimestampString;
  } & FixflowUser_Key;
}

export interface GetFixflowUserForLoginData {
  fixflowUsers: ({
    id: UUIDString;
    role: string;
    name: string;
    email: string;
    phone: string;
    passwordHash: string;
    salt: string;
    iterations: number;
    createdAt: TimestampString;
  } & FixflowUser_Key)[];
}

export interface GetFixflowUserForLoginVariables {
  email: string;
}

export interface GetFixflowUserVariables {
  id: UUIDString;
}

export interface GetNotificationData {
  notification?: {
    id: UUIDString;
    userId: UUIDString;
    requestId: UUIDString;
    title: string;
    body: string;
    createdAt: TimestampString;
    readAt?: TimestampString | null;
  } & Notification_Key;
}

export interface GetNotificationVariables {
  id: UUIDString;
}

export interface GetServiceRequestData {
  serviceRequest?: {
    id: UUIDString;
    ref: string;
    customerId: UUIDString;
    serviceId: string;
    itemName: string;
    description: string;
    mode: string;
    address: string;
    status: string;
    quotationJson?: string | null;
    appointmentJson?: string | null;
    feedbackJson?: string | null;
    closureJson?: string | null;
    historyJson: string;
    imageIdsJson: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & ServiceRequest_Key;
}

export interface GetServiceRequestVariables {
  id: UUIDString;
}

export interface ListAllAppMetasData {
  appMetas: ({
    id: UUIDString;
  } & AppMeta_Key)[];
}

export interface ListAllFixflowUsersData {
  fixflowUsers: ({
    id: UUIDString;
    role: string;
    name: string;
    email: string;
    phone: string;
    createdAt: TimestampString;
  } & FixflowUser_Key)[];
}

export interface ListAllNotificationsData {
  notifications: ({
    id: UUIDString;
  } & Notification_Key)[];
}

export interface ListAllRequestImagesData {
  requestImages: ({
    id: UUIDString;
  } & RequestImage_Key)[];
}

export interface ListAllServiceRequestsData {
  serviceRequests: ({
    id: UUIDString;
    ref: string;
    customerId: UUIDString;
    serviceId: string;
    itemName: string;
    description: string;
    mode: string;
    address: string;
    status: string;
    quotationJson?: string | null;
    appointmentJson?: string | null;
    feedbackJson?: string | null;
    closureJson?: string | null;
    historyJson: string;
    imageIdsJson: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & ServiceRequest_Key)[];
}

export interface ListFixflowUsersByRoleData {
  fixflowUsers: ({
    id: UUIDString;
    role: string;
    name: string;
    email: string;
    phone: string;
    createdAt: TimestampString;
  } & FixflowUser_Key)[];
}

export interface ListFixflowUsersByRoleVariables {
  role: string;
}

export interface ListNotificationsData {
  notifications: ({
    id: UUIDString;
    userId: UUIDString;
    requestId: UUIDString;
    title: string;
    body: string;
    createdAt: TimestampString;
    readAt?: TimestampString | null;
  } & Notification_Key)[];
}

export interface ListNotificationsVariables {
  userId: UUIDString;
}

export interface ListRequestImagesData {
  requestImages: ({
    id: UUIDString;
    requestId: UUIDString;
    name: string;
    mimeType: string;
    dataUrl: string;
  } & RequestImage_Key)[];
}

export interface ListRequestImagesVariables {
  requestId: UUIDString;
}

export interface ListScheduledServiceRequestsData {
  serviceRequests: ({
    id: UUIDString;
    appointmentJson?: string | null;
    status: string;
  } & ServiceRequest_Key)[];
}

export interface ListServiceRequestsByCustomerData {
  serviceRequests: ({
    id: UUIDString;
    ref: string;
    customerId: UUIDString;
    serviceId: string;
    itemName: string;
    description: string;
    mode: string;
    address: string;
    status: string;
    quotationJson?: string | null;
    appointmentJson?: string | null;
    feedbackJson?: string | null;
    closureJson?: string | null;
    historyJson: string;
    imageIdsJson: string;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & ServiceRequest_Key)[];
}

export interface ListServiceRequestsByCustomerVariables {
  customerId: UUIDString;
}

export interface MarkNotificationReadData {
  notification_update?: Notification_Key | null;
}

export interface MarkNotificationReadVariables {
  id: UUIDString;
  readAt: TimestampString;
}

export interface Notification_Key {
  id: UUIDString;
  __typename?: 'Notification_Key';
}

export interface RequestImage_Key {
  id: UUIDString;
  __typename?: 'RequestImage_Key';
}

export interface ServiceRequest_Key {
  id: UUIDString;
  __typename?: 'ServiceRequest_Key';
}

export interface UpdateAppMetaData {
  appMeta_update?: AppMeta_Key | null;
}

export interface UpdateAppMetaVariables {
  id: UUIDString;
  value: string;
  updatedAt: TimestampString;
}

export interface UpdateServiceRequestData {
  serviceRequest_update?: ServiceRequest_Key | null;
}

export interface UpdateServiceRequestVariables {
  id: UUIDString;
  status: string;
  quotationJson?: string | null;
  appointmentJson?: string | null;
  feedbackJson?: string | null;
  closureJson?: string | null;
  historyJson: string;
  updatedAt: TimestampString;
}

interface CreateFixflowUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFixflowUserVariables): MutationRef<CreateFixflowUserData, CreateFixflowUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateFixflowUserVariables): MutationRef<CreateFixflowUserData, CreateFixflowUserVariables>;
  operationName: string;
}
export const createFixflowUserRef: CreateFixflowUserRef;

export function createFixflowUser(vars: CreateFixflowUserVariables): MutationPromise<CreateFixflowUserData, CreateFixflowUserVariables>;
export function createFixflowUser(dc: DataConnect, vars: CreateFixflowUserVariables): MutationPromise<CreateFixflowUserData, CreateFixflowUserVariables>;

interface CreateServiceRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceRequestVariables): MutationRef<CreateServiceRequestData, CreateServiceRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateServiceRequestVariables): MutationRef<CreateServiceRequestData, CreateServiceRequestVariables>;
  operationName: string;
}
export const createServiceRequestRef: CreateServiceRequestRef;

export function createServiceRequest(vars: CreateServiceRequestVariables): MutationPromise<CreateServiceRequestData, CreateServiceRequestVariables>;
export function createServiceRequest(dc: DataConnect, vars: CreateServiceRequestVariables): MutationPromise<CreateServiceRequestData, CreateServiceRequestVariables>;

interface UpdateServiceRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServiceRequestVariables): MutationRef<UpdateServiceRequestData, UpdateServiceRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateServiceRequestVariables): MutationRef<UpdateServiceRequestData, UpdateServiceRequestVariables>;
  operationName: string;
}
export const updateServiceRequestRef: UpdateServiceRequestRef;

export function updateServiceRequest(vars: UpdateServiceRequestVariables): MutationPromise<UpdateServiceRequestData, UpdateServiceRequestVariables>;
export function updateServiceRequest(dc: DataConnect, vars: UpdateServiceRequestVariables): MutationPromise<UpdateServiceRequestData, UpdateServiceRequestVariables>;

interface CreateRequestImageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRequestImageVariables): MutationRef<CreateRequestImageData, CreateRequestImageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateRequestImageVariables): MutationRef<CreateRequestImageData, CreateRequestImageVariables>;
  operationName: string;
}
export const createRequestImageRef: CreateRequestImageRef;

export function createRequestImage(vars: CreateRequestImageVariables): MutationPromise<CreateRequestImageData, CreateRequestImageVariables>;
export function createRequestImage(dc: DataConnect, vars: CreateRequestImageVariables): MutationPromise<CreateRequestImageData, CreateRequestImageVariables>;

interface CreateNotificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
  operationName: string;
}
export const createNotificationRef: CreateNotificationRef;

export function createNotification(vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;
export function createNotification(dc: DataConnect, vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;

interface MarkNotificationReadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
  operationName: string;
}
export const markNotificationReadRef: MarkNotificationReadRef;

export function markNotificationRead(vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;
export function markNotificationRead(dc: DataConnect, vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;

interface CreateAppMetaRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAppMetaVariables): MutationRef<CreateAppMetaData, CreateAppMetaVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAppMetaVariables): MutationRef<CreateAppMetaData, CreateAppMetaVariables>;
  operationName: string;
}
export const createAppMetaRef: CreateAppMetaRef;

export function createAppMeta(vars: CreateAppMetaVariables): MutationPromise<CreateAppMetaData, CreateAppMetaVariables>;
export function createAppMeta(dc: DataConnect, vars: CreateAppMetaVariables): MutationPromise<CreateAppMetaData, CreateAppMetaVariables>;

interface UpdateAppMetaRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAppMetaVariables): MutationRef<UpdateAppMetaData, UpdateAppMetaVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAppMetaVariables): MutationRef<UpdateAppMetaData, UpdateAppMetaVariables>;
  operationName: string;
}
export const updateAppMetaRef: UpdateAppMetaRef;

export function updateAppMeta(vars: UpdateAppMetaVariables): MutationPromise<UpdateAppMetaData, UpdateAppMetaVariables>;
export function updateAppMeta(dc: DataConnect, vars: UpdateAppMetaVariables): MutationPromise<UpdateAppMetaData, UpdateAppMetaVariables>;

interface DeleteFixflowUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFixflowUserVariables): MutationRef<DeleteFixflowUserData, DeleteFixflowUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteFixflowUserVariables): MutationRef<DeleteFixflowUserData, DeleteFixflowUserVariables>;
  operationName: string;
}
export const deleteFixflowUserRef: DeleteFixflowUserRef;

export function deleteFixflowUser(vars: DeleteFixflowUserVariables): MutationPromise<DeleteFixflowUserData, DeleteFixflowUserVariables>;
export function deleteFixflowUser(dc: DataConnect, vars: DeleteFixflowUserVariables): MutationPromise<DeleteFixflowUserData, DeleteFixflowUserVariables>;

interface DeleteServiceRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceRequestVariables): MutationRef<DeleteServiceRequestData, DeleteServiceRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteServiceRequestVariables): MutationRef<DeleteServiceRequestData, DeleteServiceRequestVariables>;
  operationName: string;
}
export const deleteServiceRequestRef: DeleteServiceRequestRef;

export function deleteServiceRequest(vars: DeleteServiceRequestVariables): MutationPromise<DeleteServiceRequestData, DeleteServiceRequestVariables>;
export function deleteServiceRequest(dc: DataConnect, vars: DeleteServiceRequestVariables): MutationPromise<DeleteServiceRequestData, DeleteServiceRequestVariables>;

interface DeleteRequestImageRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteRequestImageVariables): MutationRef<DeleteRequestImageData, DeleteRequestImageVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteRequestImageVariables): MutationRef<DeleteRequestImageData, DeleteRequestImageVariables>;
  operationName: string;
}
export const deleteRequestImageRef: DeleteRequestImageRef;

export function deleteRequestImage(vars: DeleteRequestImageVariables): MutationPromise<DeleteRequestImageData, DeleteRequestImageVariables>;
export function deleteRequestImage(dc: DataConnect, vars: DeleteRequestImageVariables): MutationPromise<DeleteRequestImageData, DeleteRequestImageVariables>;

interface DeleteNotificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteNotificationVariables): MutationRef<DeleteNotificationData, DeleteNotificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteNotificationVariables): MutationRef<DeleteNotificationData, DeleteNotificationVariables>;
  operationName: string;
}
export const deleteNotificationRef: DeleteNotificationRef;

export function deleteNotification(vars: DeleteNotificationVariables): MutationPromise<DeleteNotificationData, DeleteNotificationVariables>;
export function deleteNotification(dc: DataConnect, vars: DeleteNotificationVariables): MutationPromise<DeleteNotificationData, DeleteNotificationVariables>;

interface DeleteAppMetaRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAppMetaVariables): MutationRef<DeleteAppMetaData, DeleteAppMetaVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAppMetaVariables): MutationRef<DeleteAppMetaData, DeleteAppMetaVariables>;
  operationName: string;
}
export const deleteAppMetaRef: DeleteAppMetaRef;

export function deleteAppMeta(vars: DeleteAppMetaVariables): MutationPromise<DeleteAppMetaData, DeleteAppMetaVariables>;
export function deleteAppMeta(dc: DataConnect, vars: DeleteAppMetaVariables): MutationPromise<DeleteAppMetaData, DeleteAppMetaVariables>;

interface CheckConnectionRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<CheckConnectionData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<CheckConnectionData, undefined>;
  operationName: string;
}
export const checkConnectionRef: CheckConnectionRef;

export function checkConnection(options?: ExecuteQueryOptions): QueryPromise<CheckConnectionData, undefined>;
export function checkConnection(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<CheckConnectionData, undefined>;

interface GetFixflowUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetFixflowUserVariables): QueryRef<GetFixflowUserData, GetFixflowUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetFixflowUserVariables): QueryRef<GetFixflowUserData, GetFixflowUserVariables>;
  operationName: string;
}
export const getFixflowUserRef: GetFixflowUserRef;

export function getFixflowUser(vars: GetFixflowUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetFixflowUserData, GetFixflowUserVariables>;
export function getFixflowUser(dc: DataConnect, vars: GetFixflowUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetFixflowUserData, GetFixflowUserVariables>;

interface GetFixflowUserForLoginRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetFixflowUserForLoginVariables): QueryRef<GetFixflowUserForLoginData, GetFixflowUserForLoginVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetFixflowUserForLoginVariables): QueryRef<GetFixflowUserForLoginData, GetFixflowUserForLoginVariables>;
  operationName: string;
}
export const getFixflowUserForLoginRef: GetFixflowUserForLoginRef;

export function getFixflowUserForLogin(vars: GetFixflowUserForLoginVariables, options?: ExecuteQueryOptions): QueryPromise<GetFixflowUserForLoginData, GetFixflowUserForLoginVariables>;
export function getFixflowUserForLogin(dc: DataConnect, vars: GetFixflowUserForLoginVariables, options?: ExecuteQueryOptions): QueryPromise<GetFixflowUserForLoginData, GetFixflowUserForLoginVariables>;

interface ListFixflowUsersByRoleRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListFixflowUsersByRoleVariables): QueryRef<ListFixflowUsersByRoleData, ListFixflowUsersByRoleVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListFixflowUsersByRoleVariables): QueryRef<ListFixflowUsersByRoleData, ListFixflowUsersByRoleVariables>;
  operationName: string;
}
export const listFixflowUsersByRoleRef: ListFixflowUsersByRoleRef;

export function listFixflowUsersByRole(vars: ListFixflowUsersByRoleVariables, options?: ExecuteQueryOptions): QueryPromise<ListFixflowUsersByRoleData, ListFixflowUsersByRoleVariables>;
export function listFixflowUsersByRole(dc: DataConnect, vars: ListFixflowUsersByRoleVariables, options?: ExecuteQueryOptions): QueryPromise<ListFixflowUsersByRoleData, ListFixflowUsersByRoleVariables>;

interface ListAllFixflowUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllFixflowUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllFixflowUsersData, undefined>;
  operationName: string;
}
export const listAllFixflowUsersRef: ListAllFixflowUsersRef;

export function listAllFixflowUsers(options?: ExecuteQueryOptions): QueryPromise<ListAllFixflowUsersData, undefined>;
export function listAllFixflowUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllFixflowUsersData, undefined>;

interface GetServiceRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceRequestVariables): QueryRef<GetServiceRequestData, GetServiceRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetServiceRequestVariables): QueryRef<GetServiceRequestData, GetServiceRequestVariables>;
  operationName: string;
}
export const getServiceRequestRef: GetServiceRequestRef;

export function getServiceRequest(vars: GetServiceRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetServiceRequestData, GetServiceRequestVariables>;
export function getServiceRequest(dc: DataConnect, vars: GetServiceRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetServiceRequestData, GetServiceRequestVariables>;

interface ListAllServiceRequestsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllServiceRequestsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllServiceRequestsData, undefined>;
  operationName: string;
}
export const listAllServiceRequestsRef: ListAllServiceRequestsRef;

export function listAllServiceRequests(options?: ExecuteQueryOptions): QueryPromise<ListAllServiceRequestsData, undefined>;
export function listAllServiceRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllServiceRequestsData, undefined>;

interface ListServiceRequestsByCustomerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListServiceRequestsByCustomerVariables): QueryRef<ListServiceRequestsByCustomerData, ListServiceRequestsByCustomerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListServiceRequestsByCustomerVariables): QueryRef<ListServiceRequestsByCustomerData, ListServiceRequestsByCustomerVariables>;
  operationName: string;
}
export const listServiceRequestsByCustomerRef: ListServiceRequestsByCustomerRef;

export function listServiceRequestsByCustomer(vars: ListServiceRequestsByCustomerVariables, options?: ExecuteQueryOptions): QueryPromise<ListServiceRequestsByCustomerData, ListServiceRequestsByCustomerVariables>;
export function listServiceRequestsByCustomer(dc: DataConnect, vars: ListServiceRequestsByCustomerVariables, options?: ExecuteQueryOptions): QueryPromise<ListServiceRequestsByCustomerData, ListServiceRequestsByCustomerVariables>;

interface ListScheduledServiceRequestsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListScheduledServiceRequestsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListScheduledServiceRequestsData, undefined>;
  operationName: string;
}
export const listScheduledServiceRequestsRef: ListScheduledServiceRequestsRef;

export function listScheduledServiceRequests(options?: ExecuteQueryOptions): QueryPromise<ListScheduledServiceRequestsData, undefined>;
export function listScheduledServiceRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListScheduledServiceRequestsData, undefined>;

interface ListRequestImagesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListRequestImagesVariables): QueryRef<ListRequestImagesData, ListRequestImagesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListRequestImagesVariables): QueryRef<ListRequestImagesData, ListRequestImagesVariables>;
  operationName: string;
}
export const listRequestImagesRef: ListRequestImagesRef;

export function listRequestImages(vars: ListRequestImagesVariables, options?: ExecuteQueryOptions): QueryPromise<ListRequestImagesData, ListRequestImagesVariables>;
export function listRequestImages(dc: DataConnect, vars: ListRequestImagesVariables, options?: ExecuteQueryOptions): QueryPromise<ListRequestImagesData, ListRequestImagesVariables>;

interface ListAllRequestImagesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllRequestImagesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllRequestImagesData, undefined>;
  operationName: string;
}
export const listAllRequestImagesRef: ListAllRequestImagesRef;

export function listAllRequestImages(options?: ExecuteQueryOptions): QueryPromise<ListAllRequestImagesData, undefined>;
export function listAllRequestImages(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllRequestImagesData, undefined>;

interface GetNotificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNotificationVariables): QueryRef<GetNotificationData, GetNotificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetNotificationVariables): QueryRef<GetNotificationData, GetNotificationVariables>;
  operationName: string;
}
export const getNotificationRef: GetNotificationRef;

export function getNotification(vars: GetNotificationVariables, options?: ExecuteQueryOptions): QueryPromise<GetNotificationData, GetNotificationVariables>;
export function getNotification(dc: DataConnect, vars: GetNotificationVariables, options?: ExecuteQueryOptions): QueryPromise<GetNotificationData, GetNotificationVariables>;

interface ListNotificationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListNotificationsVariables): QueryRef<ListNotificationsData, ListNotificationsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListNotificationsVariables): QueryRef<ListNotificationsData, ListNotificationsVariables>;
  operationName: string;
}
export const listNotificationsRef: ListNotificationsRef;

export function listNotifications(vars: ListNotificationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListNotificationsData, ListNotificationsVariables>;
export function listNotifications(dc: DataConnect, vars: ListNotificationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListNotificationsData, ListNotificationsVariables>;

interface ListAllNotificationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllNotificationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllNotificationsData, undefined>;
  operationName: string;
}
export const listAllNotificationsRef: ListAllNotificationsRef;

export function listAllNotifications(options?: ExecuteQueryOptions): QueryPromise<ListAllNotificationsData, undefined>;
export function listAllNotifications(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllNotificationsData, undefined>;

interface GetAppMetaRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAppMetaVariables): QueryRef<GetAppMetaData, GetAppMetaVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetAppMetaVariables): QueryRef<GetAppMetaData, GetAppMetaVariables>;
  operationName: string;
}
export const getAppMetaRef: GetAppMetaRef;

export function getAppMeta(vars: GetAppMetaVariables, options?: ExecuteQueryOptions): QueryPromise<GetAppMetaData, GetAppMetaVariables>;
export function getAppMeta(dc: DataConnect, vars: GetAppMetaVariables, options?: ExecuteQueryOptions): QueryPromise<GetAppMetaData, GetAppMetaVariables>;

interface ListAllAppMetasRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllAppMetasData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAllAppMetasData, undefined>;
  operationName: string;
}
export const listAllAppMetasRef: ListAllAppMetasRef;

export function listAllAppMetas(options?: ExecuteQueryOptions): QueryPromise<ListAllAppMetasData, undefined>;
export function listAllAppMetas(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllAppMetasData, undefined>;

