# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*CheckConnection*](#checkconnection)
  - [*GetFixflowUser*](#getfixflowuser)
  - [*GetFixflowUserForLogin*](#getfixflowuserforlogin)
  - [*ListFixflowUsersByRole*](#listfixflowusersbyrole)
  - [*ListAllFixflowUsers*](#listallfixflowusers)
  - [*GetServiceRequest*](#getservicerequest)
  - [*ListAllServiceRequests*](#listallservicerequests)
  - [*ListServiceRequestsByCustomer*](#listservicerequestsbycustomer)
  - [*ListScheduledServiceRequests*](#listscheduledservicerequests)
  - [*ListRequestImages*](#listrequestimages)
  - [*ListAllRequestImages*](#listallrequestimages)
  - [*GetNotification*](#getnotification)
  - [*ListNotifications*](#listnotifications)
  - [*ListAllNotifications*](#listallnotifications)
  - [*GetAppMeta*](#getappmeta)
  - [*ListAllAppMetas*](#listallappmetas)
- [**Mutations**](#mutations)
  - [*CreateFixflowUser*](#createfixflowuser)
  - [*CreateServiceRequest*](#createservicerequest)
  - [*UpdateServiceRequest*](#updateservicerequest)
  - [*CreateRequestImage*](#createrequestimage)
  - [*CreateNotification*](#createnotification)
  - [*MarkNotificationRead*](#marknotificationread)
  - [*CreateAppMeta*](#createappmeta)
  - [*UpdateAppMeta*](#updateappmeta)
  - [*DeleteFixflowUser*](#deletefixflowuser)
  - [*DeleteServiceRequest*](#deleteservicerequest)
  - [*DeleteRequestImage*](#deleterequestimage)
  - [*DeleteNotification*](#deletenotification)
  - [*DeleteAppMeta*](#deleteappmeta)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## CheckConnection
You can execute the `CheckConnection` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
checkConnection(options?: ExecuteQueryOptions): QueryPromise<CheckConnectionData, undefined>;

interface CheckConnectionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<CheckConnectionData, undefined>;
}
export const checkConnectionRef: CheckConnectionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
checkConnection(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<CheckConnectionData, undefined>;

interface CheckConnectionRef {
  ...
  (dc: DataConnect): QueryRef<CheckConnectionData, undefined>;
}
export const checkConnectionRef: CheckConnectionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the checkConnectionRef:
```typescript
const name = checkConnectionRef.operationName;
console.log(name);
```

### Variables
The `CheckConnection` query has no variables.
### Return Type
Recall that executing the `CheckConnection` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CheckConnectionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CheckConnectionData {
  appMetas: ({
    key: string;
  })[];
}
```
### Using `CheckConnection`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, checkConnection } from '@dataconnect/generated';


// Call the `checkConnection()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await checkConnection();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await checkConnection(dataConnect);

console.log(data.appMetas);

// Or, you can use the `Promise` API.
checkConnection().then((response) => {
  const data = response.data;
  console.log(data.appMetas);
});
```

### Using `CheckConnection`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, checkConnectionRef } from '@dataconnect/generated';


// Call the `checkConnectionRef()` function to get a reference to the query.
const ref = checkConnectionRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = checkConnectionRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.appMetas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.appMetas);
});
```

## GetFixflowUser
You can execute the `GetFixflowUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getFixflowUser(vars: GetFixflowUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetFixflowUserData, GetFixflowUserVariables>;

interface GetFixflowUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetFixflowUserVariables): QueryRef<GetFixflowUserData, GetFixflowUserVariables>;
}
export const getFixflowUserRef: GetFixflowUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getFixflowUser(dc: DataConnect, vars: GetFixflowUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetFixflowUserData, GetFixflowUserVariables>;

interface GetFixflowUserRef {
  ...
  (dc: DataConnect, vars: GetFixflowUserVariables): QueryRef<GetFixflowUserData, GetFixflowUserVariables>;
}
export const getFixflowUserRef: GetFixflowUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getFixflowUserRef:
```typescript
const name = getFixflowUserRef.operationName;
console.log(name);
```

### Variables
The `GetFixflowUser` query requires an argument of type `GetFixflowUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetFixflowUserVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetFixflowUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetFixflowUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetFixflowUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getFixflowUser, GetFixflowUserVariables } from '@dataconnect/generated';

// The `GetFixflowUser` query requires an argument of type `GetFixflowUserVariables`:
const getFixflowUserVars: GetFixflowUserVariables = {
  id: ..., 
};

// Call the `getFixflowUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getFixflowUser(getFixflowUserVars);
// Variables can be defined inline as well.
const { data } = await getFixflowUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getFixflowUser(dataConnect, getFixflowUserVars);

console.log(data.fixflowUser);

// Or, you can use the `Promise` API.
getFixflowUser(getFixflowUserVars).then((response) => {
  const data = response.data;
  console.log(data.fixflowUser);
});
```

### Using `GetFixflowUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getFixflowUserRef, GetFixflowUserVariables } from '@dataconnect/generated';

// The `GetFixflowUser` query requires an argument of type `GetFixflowUserVariables`:
const getFixflowUserVars: GetFixflowUserVariables = {
  id: ..., 
};

// Call the `getFixflowUserRef()` function to get a reference to the query.
const ref = getFixflowUserRef(getFixflowUserVars);
// Variables can be defined inline as well.
const ref = getFixflowUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getFixflowUserRef(dataConnect, getFixflowUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.fixflowUser);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.fixflowUser);
});
```

## GetFixflowUserForLogin
You can execute the `GetFixflowUserForLogin` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getFixflowUserForLogin(vars: GetFixflowUserForLoginVariables, options?: ExecuteQueryOptions): QueryPromise<GetFixflowUserForLoginData, GetFixflowUserForLoginVariables>;

interface GetFixflowUserForLoginRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetFixflowUserForLoginVariables): QueryRef<GetFixflowUserForLoginData, GetFixflowUserForLoginVariables>;
}
export const getFixflowUserForLoginRef: GetFixflowUserForLoginRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getFixflowUserForLogin(dc: DataConnect, vars: GetFixflowUserForLoginVariables, options?: ExecuteQueryOptions): QueryPromise<GetFixflowUserForLoginData, GetFixflowUserForLoginVariables>;

interface GetFixflowUserForLoginRef {
  ...
  (dc: DataConnect, vars: GetFixflowUserForLoginVariables): QueryRef<GetFixflowUserForLoginData, GetFixflowUserForLoginVariables>;
}
export const getFixflowUserForLoginRef: GetFixflowUserForLoginRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getFixflowUserForLoginRef:
```typescript
const name = getFixflowUserForLoginRef.operationName;
console.log(name);
```

### Variables
The `GetFixflowUserForLogin` query requires an argument of type `GetFixflowUserForLoginVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetFixflowUserForLoginVariables {
  email: string;
}
```
### Return Type
Recall that executing the `GetFixflowUserForLogin` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetFixflowUserForLoginData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetFixflowUserForLogin`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getFixflowUserForLogin, GetFixflowUserForLoginVariables } from '@dataconnect/generated';

// The `GetFixflowUserForLogin` query requires an argument of type `GetFixflowUserForLoginVariables`:
const getFixflowUserForLoginVars: GetFixflowUserForLoginVariables = {
  email: ..., 
};

// Call the `getFixflowUserForLogin()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getFixflowUserForLogin(getFixflowUserForLoginVars);
// Variables can be defined inline as well.
const { data } = await getFixflowUserForLogin({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getFixflowUserForLogin(dataConnect, getFixflowUserForLoginVars);

console.log(data.fixflowUsers);

// Or, you can use the `Promise` API.
getFixflowUserForLogin(getFixflowUserForLoginVars).then((response) => {
  const data = response.data;
  console.log(data.fixflowUsers);
});
```

### Using `GetFixflowUserForLogin`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getFixflowUserForLoginRef, GetFixflowUserForLoginVariables } from '@dataconnect/generated';

// The `GetFixflowUserForLogin` query requires an argument of type `GetFixflowUserForLoginVariables`:
const getFixflowUserForLoginVars: GetFixflowUserForLoginVariables = {
  email: ..., 
};

// Call the `getFixflowUserForLoginRef()` function to get a reference to the query.
const ref = getFixflowUserForLoginRef(getFixflowUserForLoginVars);
// Variables can be defined inline as well.
const ref = getFixflowUserForLoginRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getFixflowUserForLoginRef(dataConnect, getFixflowUserForLoginVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.fixflowUsers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.fixflowUsers);
});
```

## ListFixflowUsersByRole
You can execute the `ListFixflowUsersByRole` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listFixflowUsersByRole(vars: ListFixflowUsersByRoleVariables, options?: ExecuteQueryOptions): QueryPromise<ListFixflowUsersByRoleData, ListFixflowUsersByRoleVariables>;

interface ListFixflowUsersByRoleRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListFixflowUsersByRoleVariables): QueryRef<ListFixflowUsersByRoleData, ListFixflowUsersByRoleVariables>;
}
export const listFixflowUsersByRoleRef: ListFixflowUsersByRoleRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listFixflowUsersByRole(dc: DataConnect, vars: ListFixflowUsersByRoleVariables, options?: ExecuteQueryOptions): QueryPromise<ListFixflowUsersByRoleData, ListFixflowUsersByRoleVariables>;

interface ListFixflowUsersByRoleRef {
  ...
  (dc: DataConnect, vars: ListFixflowUsersByRoleVariables): QueryRef<ListFixflowUsersByRoleData, ListFixflowUsersByRoleVariables>;
}
export const listFixflowUsersByRoleRef: ListFixflowUsersByRoleRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listFixflowUsersByRoleRef:
```typescript
const name = listFixflowUsersByRoleRef.operationName;
console.log(name);
```

### Variables
The `ListFixflowUsersByRole` query requires an argument of type `ListFixflowUsersByRoleVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListFixflowUsersByRoleVariables {
  role: string;
}
```
### Return Type
Recall that executing the `ListFixflowUsersByRole` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListFixflowUsersByRoleData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListFixflowUsersByRole`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listFixflowUsersByRole, ListFixflowUsersByRoleVariables } from '@dataconnect/generated';

// The `ListFixflowUsersByRole` query requires an argument of type `ListFixflowUsersByRoleVariables`:
const listFixflowUsersByRoleVars: ListFixflowUsersByRoleVariables = {
  role: ..., 
};

// Call the `listFixflowUsersByRole()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listFixflowUsersByRole(listFixflowUsersByRoleVars);
// Variables can be defined inline as well.
const { data } = await listFixflowUsersByRole({ role: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listFixflowUsersByRole(dataConnect, listFixflowUsersByRoleVars);

console.log(data.fixflowUsers);

// Or, you can use the `Promise` API.
listFixflowUsersByRole(listFixflowUsersByRoleVars).then((response) => {
  const data = response.data;
  console.log(data.fixflowUsers);
});
```

### Using `ListFixflowUsersByRole`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listFixflowUsersByRoleRef, ListFixflowUsersByRoleVariables } from '@dataconnect/generated';

// The `ListFixflowUsersByRole` query requires an argument of type `ListFixflowUsersByRoleVariables`:
const listFixflowUsersByRoleVars: ListFixflowUsersByRoleVariables = {
  role: ..., 
};

// Call the `listFixflowUsersByRoleRef()` function to get a reference to the query.
const ref = listFixflowUsersByRoleRef(listFixflowUsersByRoleVars);
// Variables can be defined inline as well.
const ref = listFixflowUsersByRoleRef({ role: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listFixflowUsersByRoleRef(dataConnect, listFixflowUsersByRoleVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.fixflowUsers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.fixflowUsers);
});
```

## ListAllFixflowUsers
You can execute the `ListAllFixflowUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllFixflowUsers(options?: ExecuteQueryOptions): QueryPromise<ListAllFixflowUsersData, undefined>;

interface ListAllFixflowUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllFixflowUsersData, undefined>;
}
export const listAllFixflowUsersRef: ListAllFixflowUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllFixflowUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllFixflowUsersData, undefined>;

interface ListAllFixflowUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListAllFixflowUsersData, undefined>;
}
export const listAllFixflowUsersRef: ListAllFixflowUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllFixflowUsersRef:
```typescript
const name = listAllFixflowUsersRef.operationName;
console.log(name);
```

### Variables
The `ListAllFixflowUsers` query has no variables.
### Return Type
Recall that executing the `ListAllFixflowUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllFixflowUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListAllFixflowUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllFixflowUsers } from '@dataconnect/generated';


// Call the `listAllFixflowUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllFixflowUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllFixflowUsers(dataConnect);

console.log(data.fixflowUsers);

// Or, you can use the `Promise` API.
listAllFixflowUsers().then((response) => {
  const data = response.data;
  console.log(data.fixflowUsers);
});
```

### Using `ListAllFixflowUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllFixflowUsersRef } from '@dataconnect/generated';


// Call the `listAllFixflowUsersRef()` function to get a reference to the query.
const ref = listAllFixflowUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllFixflowUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.fixflowUsers);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.fixflowUsers);
});
```

## GetServiceRequest
You can execute the `GetServiceRequest` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getServiceRequest(vars: GetServiceRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetServiceRequestData, GetServiceRequestVariables>;

interface GetServiceRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceRequestVariables): QueryRef<GetServiceRequestData, GetServiceRequestVariables>;
}
export const getServiceRequestRef: GetServiceRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getServiceRequest(dc: DataConnect, vars: GetServiceRequestVariables, options?: ExecuteQueryOptions): QueryPromise<GetServiceRequestData, GetServiceRequestVariables>;

interface GetServiceRequestRef {
  ...
  (dc: DataConnect, vars: GetServiceRequestVariables): QueryRef<GetServiceRequestData, GetServiceRequestVariables>;
}
export const getServiceRequestRef: GetServiceRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getServiceRequestRef:
```typescript
const name = getServiceRequestRef.operationName;
console.log(name);
```

### Variables
The `GetServiceRequest` query requires an argument of type `GetServiceRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetServiceRequestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetServiceRequest` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetServiceRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetServiceRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getServiceRequest, GetServiceRequestVariables } from '@dataconnect/generated';

// The `GetServiceRequest` query requires an argument of type `GetServiceRequestVariables`:
const getServiceRequestVars: GetServiceRequestVariables = {
  id: ..., 
};

// Call the `getServiceRequest()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getServiceRequest(getServiceRequestVars);
// Variables can be defined inline as well.
const { data } = await getServiceRequest({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getServiceRequest(dataConnect, getServiceRequestVars);

console.log(data.serviceRequest);

// Or, you can use the `Promise` API.
getServiceRequest(getServiceRequestVars).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest);
});
```

### Using `GetServiceRequest`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getServiceRequestRef, GetServiceRequestVariables } from '@dataconnect/generated';

// The `GetServiceRequest` query requires an argument of type `GetServiceRequestVariables`:
const getServiceRequestVars: GetServiceRequestVariables = {
  id: ..., 
};

// Call the `getServiceRequestRef()` function to get a reference to the query.
const ref = getServiceRequestRef(getServiceRequestVars);
// Variables can be defined inline as well.
const ref = getServiceRequestRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getServiceRequestRef(dataConnect, getServiceRequestVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceRequest);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest);
});
```

## ListAllServiceRequests
You can execute the `ListAllServiceRequests` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllServiceRequests(options?: ExecuteQueryOptions): QueryPromise<ListAllServiceRequestsData, undefined>;

interface ListAllServiceRequestsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllServiceRequestsData, undefined>;
}
export const listAllServiceRequestsRef: ListAllServiceRequestsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllServiceRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllServiceRequestsData, undefined>;

interface ListAllServiceRequestsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllServiceRequestsData, undefined>;
}
export const listAllServiceRequestsRef: ListAllServiceRequestsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllServiceRequestsRef:
```typescript
const name = listAllServiceRequestsRef.operationName;
console.log(name);
```

### Variables
The `ListAllServiceRequests` query has no variables.
### Return Type
Recall that executing the `ListAllServiceRequests` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllServiceRequestsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListAllServiceRequests`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllServiceRequests } from '@dataconnect/generated';


// Call the `listAllServiceRequests()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllServiceRequests();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllServiceRequests(dataConnect);

console.log(data.serviceRequests);

// Or, you can use the `Promise` API.
listAllServiceRequests().then((response) => {
  const data = response.data;
  console.log(data.serviceRequests);
});
```

### Using `ListAllServiceRequests`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllServiceRequestsRef } from '@dataconnect/generated';


// Call the `listAllServiceRequestsRef()` function to get a reference to the query.
const ref = listAllServiceRequestsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllServiceRequestsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceRequests);
});
```

## ListServiceRequestsByCustomer
You can execute the `ListServiceRequestsByCustomer` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listServiceRequestsByCustomer(vars: ListServiceRequestsByCustomerVariables, options?: ExecuteQueryOptions): QueryPromise<ListServiceRequestsByCustomerData, ListServiceRequestsByCustomerVariables>;

interface ListServiceRequestsByCustomerRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListServiceRequestsByCustomerVariables): QueryRef<ListServiceRequestsByCustomerData, ListServiceRequestsByCustomerVariables>;
}
export const listServiceRequestsByCustomerRef: ListServiceRequestsByCustomerRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listServiceRequestsByCustomer(dc: DataConnect, vars: ListServiceRequestsByCustomerVariables, options?: ExecuteQueryOptions): QueryPromise<ListServiceRequestsByCustomerData, ListServiceRequestsByCustomerVariables>;

interface ListServiceRequestsByCustomerRef {
  ...
  (dc: DataConnect, vars: ListServiceRequestsByCustomerVariables): QueryRef<ListServiceRequestsByCustomerData, ListServiceRequestsByCustomerVariables>;
}
export const listServiceRequestsByCustomerRef: ListServiceRequestsByCustomerRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listServiceRequestsByCustomerRef:
```typescript
const name = listServiceRequestsByCustomerRef.operationName;
console.log(name);
```

### Variables
The `ListServiceRequestsByCustomer` query requires an argument of type `ListServiceRequestsByCustomerVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListServiceRequestsByCustomerVariables {
  customerId: UUIDString;
}
```
### Return Type
Recall that executing the `ListServiceRequestsByCustomer` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListServiceRequestsByCustomerData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListServiceRequestsByCustomer`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listServiceRequestsByCustomer, ListServiceRequestsByCustomerVariables } from '@dataconnect/generated';

// The `ListServiceRequestsByCustomer` query requires an argument of type `ListServiceRequestsByCustomerVariables`:
const listServiceRequestsByCustomerVars: ListServiceRequestsByCustomerVariables = {
  customerId: ..., 
};

// Call the `listServiceRequestsByCustomer()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listServiceRequestsByCustomer(listServiceRequestsByCustomerVars);
// Variables can be defined inline as well.
const { data } = await listServiceRequestsByCustomer({ customerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listServiceRequestsByCustomer(dataConnect, listServiceRequestsByCustomerVars);

console.log(data.serviceRequests);

// Or, you can use the `Promise` API.
listServiceRequestsByCustomer(listServiceRequestsByCustomerVars).then((response) => {
  const data = response.data;
  console.log(data.serviceRequests);
});
```

### Using `ListServiceRequestsByCustomer`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listServiceRequestsByCustomerRef, ListServiceRequestsByCustomerVariables } from '@dataconnect/generated';

// The `ListServiceRequestsByCustomer` query requires an argument of type `ListServiceRequestsByCustomerVariables`:
const listServiceRequestsByCustomerVars: ListServiceRequestsByCustomerVariables = {
  customerId: ..., 
};

// Call the `listServiceRequestsByCustomerRef()` function to get a reference to the query.
const ref = listServiceRequestsByCustomerRef(listServiceRequestsByCustomerVars);
// Variables can be defined inline as well.
const ref = listServiceRequestsByCustomerRef({ customerId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listServiceRequestsByCustomerRef(dataConnect, listServiceRequestsByCustomerVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceRequests);
});
```

## ListScheduledServiceRequests
You can execute the `ListScheduledServiceRequests` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listScheduledServiceRequests(options?: ExecuteQueryOptions): QueryPromise<ListScheduledServiceRequestsData, undefined>;

interface ListScheduledServiceRequestsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListScheduledServiceRequestsData, undefined>;
}
export const listScheduledServiceRequestsRef: ListScheduledServiceRequestsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listScheduledServiceRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListScheduledServiceRequestsData, undefined>;

interface ListScheduledServiceRequestsRef {
  ...
  (dc: DataConnect): QueryRef<ListScheduledServiceRequestsData, undefined>;
}
export const listScheduledServiceRequestsRef: ListScheduledServiceRequestsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listScheduledServiceRequestsRef:
```typescript
const name = listScheduledServiceRequestsRef.operationName;
console.log(name);
```

### Variables
The `ListScheduledServiceRequests` query has no variables.
### Return Type
Recall that executing the `ListScheduledServiceRequests` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListScheduledServiceRequestsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListScheduledServiceRequestsData {
  serviceRequests: ({
    id: UUIDString;
    appointmentJson?: string | null;
    status: string;
  } & ServiceRequest_Key)[];
}
```
### Using `ListScheduledServiceRequests`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listScheduledServiceRequests } from '@dataconnect/generated';


// Call the `listScheduledServiceRequests()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listScheduledServiceRequests();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listScheduledServiceRequests(dataConnect);

console.log(data.serviceRequests);

// Or, you can use the `Promise` API.
listScheduledServiceRequests().then((response) => {
  const data = response.data;
  console.log(data.serviceRequests);
});
```

### Using `ListScheduledServiceRequests`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listScheduledServiceRequestsRef } from '@dataconnect/generated';


// Call the `listScheduledServiceRequestsRef()` function to get a reference to the query.
const ref = listScheduledServiceRequestsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listScheduledServiceRequestsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.serviceRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceRequests);
});
```

## ListRequestImages
You can execute the `ListRequestImages` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listRequestImages(vars: ListRequestImagesVariables, options?: ExecuteQueryOptions): QueryPromise<ListRequestImagesData, ListRequestImagesVariables>;

interface ListRequestImagesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListRequestImagesVariables): QueryRef<ListRequestImagesData, ListRequestImagesVariables>;
}
export const listRequestImagesRef: ListRequestImagesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listRequestImages(dc: DataConnect, vars: ListRequestImagesVariables, options?: ExecuteQueryOptions): QueryPromise<ListRequestImagesData, ListRequestImagesVariables>;

interface ListRequestImagesRef {
  ...
  (dc: DataConnect, vars: ListRequestImagesVariables): QueryRef<ListRequestImagesData, ListRequestImagesVariables>;
}
export const listRequestImagesRef: ListRequestImagesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listRequestImagesRef:
```typescript
const name = listRequestImagesRef.operationName;
console.log(name);
```

### Variables
The `ListRequestImages` query requires an argument of type `ListRequestImagesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListRequestImagesVariables {
  requestId: UUIDString;
}
```
### Return Type
Recall that executing the `ListRequestImages` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListRequestImagesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListRequestImagesData {
  requestImages: ({
    id: UUIDString;
    requestId: UUIDString;
    name: string;
    mimeType: string;
    dataUrl: string;
  } & RequestImage_Key)[];
}
```
### Using `ListRequestImages`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listRequestImages, ListRequestImagesVariables } from '@dataconnect/generated';

// The `ListRequestImages` query requires an argument of type `ListRequestImagesVariables`:
const listRequestImagesVars: ListRequestImagesVariables = {
  requestId: ..., 
};

// Call the `listRequestImages()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listRequestImages(listRequestImagesVars);
// Variables can be defined inline as well.
const { data } = await listRequestImages({ requestId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listRequestImages(dataConnect, listRequestImagesVars);

console.log(data.requestImages);

// Or, you can use the `Promise` API.
listRequestImages(listRequestImagesVars).then((response) => {
  const data = response.data;
  console.log(data.requestImages);
});
```

### Using `ListRequestImages`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listRequestImagesRef, ListRequestImagesVariables } from '@dataconnect/generated';

// The `ListRequestImages` query requires an argument of type `ListRequestImagesVariables`:
const listRequestImagesVars: ListRequestImagesVariables = {
  requestId: ..., 
};

// Call the `listRequestImagesRef()` function to get a reference to the query.
const ref = listRequestImagesRef(listRequestImagesVars);
// Variables can be defined inline as well.
const ref = listRequestImagesRef({ requestId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listRequestImagesRef(dataConnect, listRequestImagesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.requestImages);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.requestImages);
});
```

## ListAllRequestImages
You can execute the `ListAllRequestImages` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllRequestImages(options?: ExecuteQueryOptions): QueryPromise<ListAllRequestImagesData, undefined>;

interface ListAllRequestImagesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllRequestImagesData, undefined>;
}
export const listAllRequestImagesRef: ListAllRequestImagesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllRequestImages(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllRequestImagesData, undefined>;

interface ListAllRequestImagesRef {
  ...
  (dc: DataConnect): QueryRef<ListAllRequestImagesData, undefined>;
}
export const listAllRequestImagesRef: ListAllRequestImagesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllRequestImagesRef:
```typescript
const name = listAllRequestImagesRef.operationName;
console.log(name);
```

### Variables
The `ListAllRequestImages` query has no variables.
### Return Type
Recall that executing the `ListAllRequestImages` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllRequestImagesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllRequestImagesData {
  requestImages: ({
    id: UUIDString;
  } & RequestImage_Key)[];
}
```
### Using `ListAllRequestImages`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllRequestImages } from '@dataconnect/generated';


// Call the `listAllRequestImages()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllRequestImages();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllRequestImages(dataConnect);

console.log(data.requestImages);

// Or, you can use the `Promise` API.
listAllRequestImages().then((response) => {
  const data = response.data;
  console.log(data.requestImages);
});
```

### Using `ListAllRequestImages`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllRequestImagesRef } from '@dataconnect/generated';


// Call the `listAllRequestImagesRef()` function to get a reference to the query.
const ref = listAllRequestImagesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllRequestImagesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.requestImages);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.requestImages);
});
```

## GetNotification
You can execute the `GetNotification` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getNotification(vars: GetNotificationVariables, options?: ExecuteQueryOptions): QueryPromise<GetNotificationData, GetNotificationVariables>;

interface GetNotificationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetNotificationVariables): QueryRef<GetNotificationData, GetNotificationVariables>;
}
export const getNotificationRef: GetNotificationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getNotification(dc: DataConnect, vars: GetNotificationVariables, options?: ExecuteQueryOptions): QueryPromise<GetNotificationData, GetNotificationVariables>;

interface GetNotificationRef {
  ...
  (dc: DataConnect, vars: GetNotificationVariables): QueryRef<GetNotificationData, GetNotificationVariables>;
}
export const getNotificationRef: GetNotificationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getNotificationRef:
```typescript
const name = getNotificationRef.operationName;
console.log(name);
```

### Variables
The `GetNotification` query requires an argument of type `GetNotificationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetNotificationVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetNotification` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetNotificationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetNotification`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getNotification, GetNotificationVariables } from '@dataconnect/generated';

// The `GetNotification` query requires an argument of type `GetNotificationVariables`:
const getNotificationVars: GetNotificationVariables = {
  id: ..., 
};

// Call the `getNotification()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getNotification(getNotificationVars);
// Variables can be defined inline as well.
const { data } = await getNotification({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getNotification(dataConnect, getNotificationVars);

console.log(data.notification);

// Or, you can use the `Promise` API.
getNotification(getNotificationVars).then((response) => {
  const data = response.data;
  console.log(data.notification);
});
```

### Using `GetNotification`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getNotificationRef, GetNotificationVariables } from '@dataconnect/generated';

// The `GetNotification` query requires an argument of type `GetNotificationVariables`:
const getNotificationVars: GetNotificationVariables = {
  id: ..., 
};

// Call the `getNotificationRef()` function to get a reference to the query.
const ref = getNotificationRef(getNotificationVars);
// Variables can be defined inline as well.
const ref = getNotificationRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getNotificationRef(dataConnect, getNotificationVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.notification);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.notification);
});
```

## ListNotifications
You can execute the `ListNotifications` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listNotifications(vars: ListNotificationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListNotificationsData, ListNotificationsVariables>;

interface ListNotificationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListNotificationsVariables): QueryRef<ListNotificationsData, ListNotificationsVariables>;
}
export const listNotificationsRef: ListNotificationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listNotifications(dc: DataConnect, vars: ListNotificationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListNotificationsData, ListNotificationsVariables>;

interface ListNotificationsRef {
  ...
  (dc: DataConnect, vars: ListNotificationsVariables): QueryRef<ListNotificationsData, ListNotificationsVariables>;
}
export const listNotificationsRef: ListNotificationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listNotificationsRef:
```typescript
const name = listNotificationsRef.operationName;
console.log(name);
```

### Variables
The `ListNotifications` query requires an argument of type `ListNotificationsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListNotificationsVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `ListNotifications` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListNotificationsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListNotifications`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listNotifications, ListNotificationsVariables } from '@dataconnect/generated';

// The `ListNotifications` query requires an argument of type `ListNotificationsVariables`:
const listNotificationsVars: ListNotificationsVariables = {
  userId: ..., 
};

// Call the `listNotifications()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listNotifications(listNotificationsVars);
// Variables can be defined inline as well.
const { data } = await listNotifications({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listNotifications(dataConnect, listNotificationsVars);

console.log(data.notifications);

// Or, you can use the `Promise` API.
listNotifications(listNotificationsVars).then((response) => {
  const data = response.data;
  console.log(data.notifications);
});
```

### Using `ListNotifications`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listNotificationsRef, ListNotificationsVariables } from '@dataconnect/generated';

// The `ListNotifications` query requires an argument of type `ListNotificationsVariables`:
const listNotificationsVars: ListNotificationsVariables = {
  userId: ..., 
};

// Call the `listNotificationsRef()` function to get a reference to the query.
const ref = listNotificationsRef(listNotificationsVars);
// Variables can be defined inline as well.
const ref = listNotificationsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listNotificationsRef(dataConnect, listNotificationsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.notifications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.notifications);
});
```

## ListAllNotifications
You can execute the `ListAllNotifications` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllNotifications(options?: ExecuteQueryOptions): QueryPromise<ListAllNotificationsData, undefined>;

interface ListAllNotificationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllNotificationsData, undefined>;
}
export const listAllNotificationsRef: ListAllNotificationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllNotifications(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllNotificationsData, undefined>;

interface ListAllNotificationsRef {
  ...
  (dc: DataConnect): QueryRef<ListAllNotificationsData, undefined>;
}
export const listAllNotificationsRef: ListAllNotificationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllNotificationsRef:
```typescript
const name = listAllNotificationsRef.operationName;
console.log(name);
```

### Variables
The `ListAllNotifications` query has no variables.
### Return Type
Recall that executing the `ListAllNotifications` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllNotificationsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllNotificationsData {
  notifications: ({
    id: UUIDString;
  } & Notification_Key)[];
}
```
### Using `ListAllNotifications`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllNotifications } from '@dataconnect/generated';


// Call the `listAllNotifications()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllNotifications();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllNotifications(dataConnect);

console.log(data.notifications);

// Or, you can use the `Promise` API.
listAllNotifications().then((response) => {
  const data = response.data;
  console.log(data.notifications);
});
```

### Using `ListAllNotifications`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllNotificationsRef } from '@dataconnect/generated';


// Call the `listAllNotificationsRef()` function to get a reference to the query.
const ref = listAllNotificationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllNotificationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.notifications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.notifications);
});
```

## GetAppMeta
You can execute the `GetAppMeta` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getAppMeta(vars: GetAppMetaVariables, options?: ExecuteQueryOptions): QueryPromise<GetAppMetaData, GetAppMetaVariables>;

interface GetAppMetaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetAppMetaVariables): QueryRef<GetAppMetaData, GetAppMetaVariables>;
}
export const getAppMetaRef: GetAppMetaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAppMeta(dc: DataConnect, vars: GetAppMetaVariables, options?: ExecuteQueryOptions): QueryPromise<GetAppMetaData, GetAppMetaVariables>;

interface GetAppMetaRef {
  ...
  (dc: DataConnect, vars: GetAppMetaVariables): QueryRef<GetAppMetaData, GetAppMetaVariables>;
}
export const getAppMetaRef: GetAppMetaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAppMetaRef:
```typescript
const name = getAppMetaRef.operationName;
console.log(name);
```

### Variables
The `GetAppMeta` query requires an argument of type `GetAppMetaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetAppMetaVariables {
  key: string;
}
```
### Return Type
Recall that executing the `GetAppMeta` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAppMetaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAppMetaData {
  appMetas: ({
    id: UUIDString;
    key: string;
    value: string;
  } & AppMeta_Key)[];
}
```
### Using `GetAppMeta`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAppMeta, GetAppMetaVariables } from '@dataconnect/generated';

// The `GetAppMeta` query requires an argument of type `GetAppMetaVariables`:
const getAppMetaVars: GetAppMetaVariables = {
  key: ..., 
};

// Call the `getAppMeta()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAppMeta(getAppMetaVars);
// Variables can be defined inline as well.
const { data } = await getAppMeta({ key: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAppMeta(dataConnect, getAppMetaVars);

console.log(data.appMetas);

// Or, you can use the `Promise` API.
getAppMeta(getAppMetaVars).then((response) => {
  const data = response.data;
  console.log(data.appMetas);
});
```

### Using `GetAppMeta`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAppMetaRef, GetAppMetaVariables } from '@dataconnect/generated';

// The `GetAppMeta` query requires an argument of type `GetAppMetaVariables`:
const getAppMetaVars: GetAppMetaVariables = {
  key: ..., 
};

// Call the `getAppMetaRef()` function to get a reference to the query.
const ref = getAppMetaRef(getAppMetaVars);
// Variables can be defined inline as well.
const ref = getAppMetaRef({ key: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAppMetaRef(dataConnect, getAppMetaVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.appMetas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.appMetas);
});
```

## ListAllAppMetas
You can execute the `ListAllAppMetas` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAllAppMetas(options?: ExecuteQueryOptions): QueryPromise<ListAllAppMetasData, undefined>;

interface ListAllAppMetasRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAllAppMetasData, undefined>;
}
export const listAllAppMetasRef: ListAllAppMetasRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAllAppMetas(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListAllAppMetasData, undefined>;

interface ListAllAppMetasRef {
  ...
  (dc: DataConnect): QueryRef<ListAllAppMetasData, undefined>;
}
export const listAllAppMetasRef: ListAllAppMetasRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAllAppMetasRef:
```typescript
const name = listAllAppMetasRef.operationName;
console.log(name);
```

### Variables
The `ListAllAppMetas` query has no variables.
### Return Type
Recall that executing the `ListAllAppMetas` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAllAppMetasData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAllAppMetasData {
  appMetas: ({
    id: UUIDString;
  } & AppMeta_Key)[];
}
```
### Using `ListAllAppMetas`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAllAppMetas } from '@dataconnect/generated';


// Call the `listAllAppMetas()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAllAppMetas();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAllAppMetas(dataConnect);

console.log(data.appMetas);

// Or, you can use the `Promise` API.
listAllAppMetas().then((response) => {
  const data = response.data;
  console.log(data.appMetas);
});
```

### Using `ListAllAppMetas`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAllAppMetasRef } from '@dataconnect/generated';


// Call the `listAllAppMetasRef()` function to get a reference to the query.
const ref = listAllAppMetasRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAllAppMetasRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.appMetas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.appMetas);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateFixflowUser
You can execute the `CreateFixflowUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createFixflowUser(vars: CreateFixflowUserVariables): MutationPromise<CreateFixflowUserData, CreateFixflowUserVariables>;

interface CreateFixflowUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFixflowUserVariables): MutationRef<CreateFixflowUserData, CreateFixflowUserVariables>;
}
export const createFixflowUserRef: CreateFixflowUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createFixflowUser(dc: DataConnect, vars: CreateFixflowUserVariables): MutationPromise<CreateFixflowUserData, CreateFixflowUserVariables>;

interface CreateFixflowUserRef {
  ...
  (dc: DataConnect, vars: CreateFixflowUserVariables): MutationRef<CreateFixflowUserData, CreateFixflowUserVariables>;
}
export const createFixflowUserRef: CreateFixflowUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createFixflowUserRef:
```typescript
const name = createFixflowUserRef.operationName;
console.log(name);
```

### Variables
The `CreateFixflowUser` mutation requires an argument of type `CreateFixflowUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateFixflowUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateFixflowUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateFixflowUserData {
  fixflowUser_insert: FixflowUser_Key;
}
```
### Using `CreateFixflowUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createFixflowUser, CreateFixflowUserVariables } from '@dataconnect/generated';

// The `CreateFixflowUser` mutation requires an argument of type `CreateFixflowUserVariables`:
const createFixflowUserVars: CreateFixflowUserVariables = {
  id: ..., 
  role: ..., 
  name: ..., 
  email: ..., 
  phone: ..., 
  passwordHash: ..., 
  salt: ..., 
  iterations: ..., 
  createdAt: ..., 
};

// Call the `createFixflowUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createFixflowUser(createFixflowUserVars);
// Variables can be defined inline as well.
const { data } = await createFixflowUser({ id: ..., role: ..., name: ..., email: ..., phone: ..., passwordHash: ..., salt: ..., iterations: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createFixflowUser(dataConnect, createFixflowUserVars);

console.log(data.fixflowUser_insert);

// Or, you can use the `Promise` API.
createFixflowUser(createFixflowUserVars).then((response) => {
  const data = response.data;
  console.log(data.fixflowUser_insert);
});
```

### Using `CreateFixflowUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createFixflowUserRef, CreateFixflowUserVariables } from '@dataconnect/generated';

// The `CreateFixflowUser` mutation requires an argument of type `CreateFixflowUserVariables`:
const createFixflowUserVars: CreateFixflowUserVariables = {
  id: ..., 
  role: ..., 
  name: ..., 
  email: ..., 
  phone: ..., 
  passwordHash: ..., 
  salt: ..., 
  iterations: ..., 
  createdAt: ..., 
};

// Call the `createFixflowUserRef()` function to get a reference to the mutation.
const ref = createFixflowUserRef(createFixflowUserVars);
// Variables can be defined inline as well.
const ref = createFixflowUserRef({ id: ..., role: ..., name: ..., email: ..., phone: ..., passwordHash: ..., salt: ..., iterations: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createFixflowUserRef(dataConnect, createFixflowUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.fixflowUser_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.fixflowUser_insert);
});
```

## CreateServiceRequest
You can execute the `CreateServiceRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createServiceRequest(vars: CreateServiceRequestVariables): MutationPromise<CreateServiceRequestData, CreateServiceRequestVariables>;

interface CreateServiceRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceRequestVariables): MutationRef<CreateServiceRequestData, CreateServiceRequestVariables>;
}
export const createServiceRequestRef: CreateServiceRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createServiceRequest(dc: DataConnect, vars: CreateServiceRequestVariables): MutationPromise<CreateServiceRequestData, CreateServiceRequestVariables>;

interface CreateServiceRequestRef {
  ...
  (dc: DataConnect, vars: CreateServiceRequestVariables): MutationRef<CreateServiceRequestData, CreateServiceRequestVariables>;
}
export const createServiceRequestRef: CreateServiceRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createServiceRequestRef:
```typescript
const name = createServiceRequestRef.operationName;
console.log(name);
```

### Variables
The `CreateServiceRequest` mutation requires an argument of type `CreateServiceRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateServiceRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateServiceRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateServiceRequestData {
  serviceRequest_insert: ServiceRequest_Key;
}
```
### Using `CreateServiceRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createServiceRequest, CreateServiceRequestVariables } from '@dataconnect/generated';

// The `CreateServiceRequest` mutation requires an argument of type `CreateServiceRequestVariables`:
const createServiceRequestVars: CreateServiceRequestVariables = {
  id: ..., 
  ref: ..., 
  customerId: ..., 
  serviceId: ..., 
  itemName: ..., 
  description: ..., 
  mode: ..., 
  address: ..., 
  status: ..., 
  quotationJson: ..., // optional
  appointmentJson: ..., // optional
  feedbackJson: ..., // optional
  closureJson: ..., // optional
  historyJson: ..., 
  imageIdsJson: ..., 
  createdAt: ..., 
  updatedAt: ..., 
};

// Call the `createServiceRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createServiceRequest(createServiceRequestVars);
// Variables can be defined inline as well.
const { data } = await createServiceRequest({ id: ..., ref: ..., customerId: ..., serviceId: ..., itemName: ..., description: ..., mode: ..., address: ..., status: ..., quotationJson: ..., appointmentJson: ..., feedbackJson: ..., closureJson: ..., historyJson: ..., imageIdsJson: ..., createdAt: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createServiceRequest(dataConnect, createServiceRequestVars);

console.log(data.serviceRequest_insert);

// Or, you can use the `Promise` API.
createServiceRequest(createServiceRequestVars).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest_insert);
});
```

### Using `CreateServiceRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createServiceRequestRef, CreateServiceRequestVariables } from '@dataconnect/generated';

// The `CreateServiceRequest` mutation requires an argument of type `CreateServiceRequestVariables`:
const createServiceRequestVars: CreateServiceRequestVariables = {
  id: ..., 
  ref: ..., 
  customerId: ..., 
  serviceId: ..., 
  itemName: ..., 
  description: ..., 
  mode: ..., 
  address: ..., 
  status: ..., 
  quotationJson: ..., // optional
  appointmentJson: ..., // optional
  feedbackJson: ..., // optional
  closureJson: ..., // optional
  historyJson: ..., 
  imageIdsJson: ..., 
  createdAt: ..., 
  updatedAt: ..., 
};

// Call the `createServiceRequestRef()` function to get a reference to the mutation.
const ref = createServiceRequestRef(createServiceRequestVars);
// Variables can be defined inline as well.
const ref = createServiceRequestRef({ id: ..., ref: ..., customerId: ..., serviceId: ..., itemName: ..., description: ..., mode: ..., address: ..., status: ..., quotationJson: ..., appointmentJson: ..., feedbackJson: ..., closureJson: ..., historyJson: ..., imageIdsJson: ..., createdAt: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createServiceRequestRef(dataConnect, createServiceRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceRequest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest_insert);
});
```

## UpdateServiceRequest
You can execute the `UpdateServiceRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateServiceRequest(vars: UpdateServiceRequestVariables): MutationPromise<UpdateServiceRequestData, UpdateServiceRequestVariables>;

interface UpdateServiceRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServiceRequestVariables): MutationRef<UpdateServiceRequestData, UpdateServiceRequestVariables>;
}
export const updateServiceRequestRef: UpdateServiceRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateServiceRequest(dc: DataConnect, vars: UpdateServiceRequestVariables): MutationPromise<UpdateServiceRequestData, UpdateServiceRequestVariables>;

interface UpdateServiceRequestRef {
  ...
  (dc: DataConnect, vars: UpdateServiceRequestVariables): MutationRef<UpdateServiceRequestData, UpdateServiceRequestVariables>;
}
export const updateServiceRequestRef: UpdateServiceRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateServiceRequestRef:
```typescript
const name = updateServiceRequestRef.operationName;
console.log(name);
```

### Variables
The `UpdateServiceRequest` mutation requires an argument of type `UpdateServiceRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpdateServiceRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateServiceRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateServiceRequestData {
  serviceRequest_update?: ServiceRequest_Key | null;
}
```
### Using `UpdateServiceRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateServiceRequest, UpdateServiceRequestVariables } from '@dataconnect/generated';

// The `UpdateServiceRequest` mutation requires an argument of type `UpdateServiceRequestVariables`:
const updateServiceRequestVars: UpdateServiceRequestVariables = {
  id: ..., 
  status: ..., 
  quotationJson: ..., // optional
  appointmentJson: ..., // optional
  feedbackJson: ..., // optional
  closureJson: ..., // optional
  historyJson: ..., 
  updatedAt: ..., 
};

// Call the `updateServiceRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateServiceRequest(updateServiceRequestVars);
// Variables can be defined inline as well.
const { data } = await updateServiceRequest({ id: ..., status: ..., quotationJson: ..., appointmentJson: ..., feedbackJson: ..., closureJson: ..., historyJson: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateServiceRequest(dataConnect, updateServiceRequestVars);

console.log(data.serviceRequest_update);

// Or, you can use the `Promise` API.
updateServiceRequest(updateServiceRequestVars).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest_update);
});
```

### Using `UpdateServiceRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateServiceRequestRef, UpdateServiceRequestVariables } from '@dataconnect/generated';

// The `UpdateServiceRequest` mutation requires an argument of type `UpdateServiceRequestVariables`:
const updateServiceRequestVars: UpdateServiceRequestVariables = {
  id: ..., 
  status: ..., 
  quotationJson: ..., // optional
  appointmentJson: ..., // optional
  feedbackJson: ..., // optional
  closureJson: ..., // optional
  historyJson: ..., 
  updatedAt: ..., 
};

// Call the `updateServiceRequestRef()` function to get a reference to the mutation.
const ref = updateServiceRequestRef(updateServiceRequestVars);
// Variables can be defined inline as well.
const ref = updateServiceRequestRef({ id: ..., status: ..., quotationJson: ..., appointmentJson: ..., feedbackJson: ..., closureJson: ..., historyJson: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateServiceRequestRef(dataConnect, updateServiceRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceRequest_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest_update);
});
```

## CreateRequestImage
You can execute the `CreateRequestImage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createRequestImage(vars: CreateRequestImageVariables): MutationPromise<CreateRequestImageData, CreateRequestImageVariables>;

interface CreateRequestImageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRequestImageVariables): MutationRef<CreateRequestImageData, CreateRequestImageVariables>;
}
export const createRequestImageRef: CreateRequestImageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createRequestImage(dc: DataConnect, vars: CreateRequestImageVariables): MutationPromise<CreateRequestImageData, CreateRequestImageVariables>;

interface CreateRequestImageRef {
  ...
  (dc: DataConnect, vars: CreateRequestImageVariables): MutationRef<CreateRequestImageData, CreateRequestImageVariables>;
}
export const createRequestImageRef: CreateRequestImageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createRequestImageRef:
```typescript
const name = createRequestImageRef.operationName;
console.log(name);
```

### Variables
The `CreateRequestImage` mutation requires an argument of type `CreateRequestImageVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateRequestImageVariables {
  id: UUIDString;
  requestId: UUIDString;
  name: string;
  mimeType: string;
  dataUrl: string;
  createdAt: TimestampString;
}
```
### Return Type
Recall that executing the `CreateRequestImage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateRequestImageData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateRequestImageData {
  requestImage_insert: RequestImage_Key;
}
```
### Using `CreateRequestImage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createRequestImage, CreateRequestImageVariables } from '@dataconnect/generated';

// The `CreateRequestImage` mutation requires an argument of type `CreateRequestImageVariables`:
const createRequestImageVars: CreateRequestImageVariables = {
  id: ..., 
  requestId: ..., 
  name: ..., 
  mimeType: ..., 
  dataUrl: ..., 
  createdAt: ..., 
};

// Call the `createRequestImage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createRequestImage(createRequestImageVars);
// Variables can be defined inline as well.
const { data } = await createRequestImage({ id: ..., requestId: ..., name: ..., mimeType: ..., dataUrl: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createRequestImage(dataConnect, createRequestImageVars);

console.log(data.requestImage_insert);

// Or, you can use the `Promise` API.
createRequestImage(createRequestImageVars).then((response) => {
  const data = response.data;
  console.log(data.requestImage_insert);
});
```

### Using `CreateRequestImage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createRequestImageRef, CreateRequestImageVariables } from '@dataconnect/generated';

// The `CreateRequestImage` mutation requires an argument of type `CreateRequestImageVariables`:
const createRequestImageVars: CreateRequestImageVariables = {
  id: ..., 
  requestId: ..., 
  name: ..., 
  mimeType: ..., 
  dataUrl: ..., 
  createdAt: ..., 
};

// Call the `createRequestImageRef()` function to get a reference to the mutation.
const ref = createRequestImageRef(createRequestImageVars);
// Variables can be defined inline as well.
const ref = createRequestImageRef({ id: ..., requestId: ..., name: ..., mimeType: ..., dataUrl: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createRequestImageRef(dataConnect, createRequestImageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.requestImage_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.requestImage_insert);
});
```

## CreateNotification
You can execute the `CreateNotification` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createNotification(vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;

interface CreateNotificationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
}
export const createNotificationRef: CreateNotificationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createNotification(dc: DataConnect, vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;

interface CreateNotificationRef {
  ...
  (dc: DataConnect, vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
}
export const createNotificationRef: CreateNotificationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createNotificationRef:
```typescript
const name = createNotificationRef.operationName;
console.log(name);
```

### Variables
The `CreateNotification` mutation requires an argument of type `CreateNotificationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateNotificationVariables {
  id: UUIDString;
  userId: UUIDString;
  requestId: UUIDString;
  title: string;
  body: string;
  createdAt: TimestampString;
}
```
### Return Type
Recall that executing the `CreateNotification` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateNotificationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateNotificationData {
  notification_insert: Notification_Key;
}
```
### Using `CreateNotification`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createNotification, CreateNotificationVariables } from '@dataconnect/generated';

// The `CreateNotification` mutation requires an argument of type `CreateNotificationVariables`:
const createNotificationVars: CreateNotificationVariables = {
  id: ..., 
  userId: ..., 
  requestId: ..., 
  title: ..., 
  body: ..., 
  createdAt: ..., 
};

// Call the `createNotification()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createNotification(createNotificationVars);
// Variables can be defined inline as well.
const { data } = await createNotification({ id: ..., userId: ..., requestId: ..., title: ..., body: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createNotification(dataConnect, createNotificationVars);

console.log(data.notification_insert);

// Or, you can use the `Promise` API.
createNotification(createNotificationVars).then((response) => {
  const data = response.data;
  console.log(data.notification_insert);
});
```

### Using `CreateNotification`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createNotificationRef, CreateNotificationVariables } from '@dataconnect/generated';

// The `CreateNotification` mutation requires an argument of type `CreateNotificationVariables`:
const createNotificationVars: CreateNotificationVariables = {
  id: ..., 
  userId: ..., 
  requestId: ..., 
  title: ..., 
  body: ..., 
  createdAt: ..., 
};

// Call the `createNotificationRef()` function to get a reference to the mutation.
const ref = createNotificationRef(createNotificationVars);
// Variables can be defined inline as well.
const ref = createNotificationRef({ id: ..., userId: ..., requestId: ..., title: ..., body: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createNotificationRef(dataConnect, createNotificationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.notification_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.notification_insert);
});
```

## MarkNotificationRead
You can execute the `MarkNotificationRead` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
markNotificationRead(vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;

interface MarkNotificationReadRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
}
export const markNotificationReadRef: MarkNotificationReadRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markNotificationRead(dc: DataConnect, vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;

interface MarkNotificationReadRef {
  ...
  (dc: DataConnect, vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
}
export const markNotificationReadRef: MarkNotificationReadRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markNotificationReadRef:
```typescript
const name = markNotificationReadRef.operationName;
console.log(name);
```

### Variables
The `MarkNotificationRead` mutation requires an argument of type `MarkNotificationReadVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkNotificationReadVariables {
  id: UUIDString;
  readAt: TimestampString;
}
```
### Return Type
Recall that executing the `MarkNotificationRead` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkNotificationReadData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkNotificationReadData {
  notification_update?: Notification_Key | null;
}
```
### Using `MarkNotificationRead`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markNotificationRead, MarkNotificationReadVariables } from '@dataconnect/generated';

// The `MarkNotificationRead` mutation requires an argument of type `MarkNotificationReadVariables`:
const markNotificationReadVars: MarkNotificationReadVariables = {
  id: ..., 
  readAt: ..., 
};

// Call the `markNotificationRead()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markNotificationRead(markNotificationReadVars);
// Variables can be defined inline as well.
const { data } = await markNotificationRead({ id: ..., readAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markNotificationRead(dataConnect, markNotificationReadVars);

console.log(data.notification_update);

// Or, you can use the `Promise` API.
markNotificationRead(markNotificationReadVars).then((response) => {
  const data = response.data;
  console.log(data.notification_update);
});
```

### Using `MarkNotificationRead`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markNotificationReadRef, MarkNotificationReadVariables } from '@dataconnect/generated';

// The `MarkNotificationRead` mutation requires an argument of type `MarkNotificationReadVariables`:
const markNotificationReadVars: MarkNotificationReadVariables = {
  id: ..., 
  readAt: ..., 
};

// Call the `markNotificationReadRef()` function to get a reference to the mutation.
const ref = markNotificationReadRef(markNotificationReadVars);
// Variables can be defined inline as well.
const ref = markNotificationReadRef({ id: ..., readAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markNotificationReadRef(dataConnect, markNotificationReadVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.notification_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.notification_update);
});
```

## CreateAppMeta
You can execute the `CreateAppMeta` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createAppMeta(vars: CreateAppMetaVariables): MutationPromise<CreateAppMetaData, CreateAppMetaVariables>;

interface CreateAppMetaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAppMetaVariables): MutationRef<CreateAppMetaData, CreateAppMetaVariables>;
}
export const createAppMetaRef: CreateAppMetaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAppMeta(dc: DataConnect, vars: CreateAppMetaVariables): MutationPromise<CreateAppMetaData, CreateAppMetaVariables>;

interface CreateAppMetaRef {
  ...
  (dc: DataConnect, vars: CreateAppMetaVariables): MutationRef<CreateAppMetaData, CreateAppMetaVariables>;
}
export const createAppMetaRef: CreateAppMetaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAppMetaRef:
```typescript
const name = createAppMetaRef.operationName;
console.log(name);
```

### Variables
The `CreateAppMeta` mutation requires an argument of type `CreateAppMetaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAppMetaVariables {
  key: string;
  value: string;
  updatedAt: TimestampString;
}
```
### Return Type
Recall that executing the `CreateAppMeta` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAppMetaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAppMetaData {
  appMeta_insert: AppMeta_Key;
}
```
### Using `CreateAppMeta`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAppMeta, CreateAppMetaVariables } from '@dataconnect/generated';

// The `CreateAppMeta` mutation requires an argument of type `CreateAppMetaVariables`:
const createAppMetaVars: CreateAppMetaVariables = {
  key: ..., 
  value: ..., 
  updatedAt: ..., 
};

// Call the `createAppMeta()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAppMeta(createAppMetaVars);
// Variables can be defined inline as well.
const { data } = await createAppMeta({ key: ..., value: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAppMeta(dataConnect, createAppMetaVars);

console.log(data.appMeta_insert);

// Or, you can use the `Promise` API.
createAppMeta(createAppMetaVars).then((response) => {
  const data = response.data;
  console.log(data.appMeta_insert);
});
```

### Using `CreateAppMeta`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAppMetaRef, CreateAppMetaVariables } from '@dataconnect/generated';

// The `CreateAppMeta` mutation requires an argument of type `CreateAppMetaVariables`:
const createAppMetaVars: CreateAppMetaVariables = {
  key: ..., 
  value: ..., 
  updatedAt: ..., 
};

// Call the `createAppMetaRef()` function to get a reference to the mutation.
const ref = createAppMetaRef(createAppMetaVars);
// Variables can be defined inline as well.
const ref = createAppMetaRef({ key: ..., value: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAppMetaRef(dataConnect, createAppMetaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appMeta_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appMeta_insert);
});
```

## UpdateAppMeta
You can execute the `UpdateAppMeta` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateAppMeta(vars: UpdateAppMetaVariables): MutationPromise<UpdateAppMetaData, UpdateAppMetaVariables>;

interface UpdateAppMetaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAppMetaVariables): MutationRef<UpdateAppMetaData, UpdateAppMetaVariables>;
}
export const updateAppMetaRef: UpdateAppMetaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAppMeta(dc: DataConnect, vars: UpdateAppMetaVariables): MutationPromise<UpdateAppMetaData, UpdateAppMetaVariables>;

interface UpdateAppMetaRef {
  ...
  (dc: DataConnect, vars: UpdateAppMetaVariables): MutationRef<UpdateAppMetaData, UpdateAppMetaVariables>;
}
export const updateAppMetaRef: UpdateAppMetaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAppMetaRef:
```typescript
const name = updateAppMetaRef.operationName;
console.log(name);
```

### Variables
The `UpdateAppMeta` mutation requires an argument of type `UpdateAppMetaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAppMetaVariables {
  id: UUIDString;
  value: string;
  updatedAt: TimestampString;
}
```
### Return Type
Recall that executing the `UpdateAppMeta` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAppMetaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAppMetaData {
  appMeta_update?: AppMeta_Key | null;
}
```
### Using `UpdateAppMeta`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAppMeta, UpdateAppMetaVariables } from '@dataconnect/generated';

// The `UpdateAppMeta` mutation requires an argument of type `UpdateAppMetaVariables`:
const updateAppMetaVars: UpdateAppMetaVariables = {
  id: ..., 
  value: ..., 
  updatedAt: ..., 
};

// Call the `updateAppMeta()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAppMeta(updateAppMetaVars);
// Variables can be defined inline as well.
const { data } = await updateAppMeta({ id: ..., value: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAppMeta(dataConnect, updateAppMetaVars);

console.log(data.appMeta_update);

// Or, you can use the `Promise` API.
updateAppMeta(updateAppMetaVars).then((response) => {
  const data = response.data;
  console.log(data.appMeta_update);
});
```

### Using `UpdateAppMeta`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAppMetaRef, UpdateAppMetaVariables } from '@dataconnect/generated';

// The `UpdateAppMeta` mutation requires an argument of type `UpdateAppMetaVariables`:
const updateAppMetaVars: UpdateAppMetaVariables = {
  id: ..., 
  value: ..., 
  updatedAt: ..., 
};

// Call the `updateAppMetaRef()` function to get a reference to the mutation.
const ref = updateAppMetaRef(updateAppMetaVars);
// Variables can be defined inline as well.
const ref = updateAppMetaRef({ id: ..., value: ..., updatedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAppMetaRef(dataConnect, updateAppMetaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appMeta_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appMeta_update);
});
```

## DeleteFixflowUser
You can execute the `DeleteFixflowUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteFixflowUser(vars: DeleteFixflowUserVariables): MutationPromise<DeleteFixflowUserData, DeleteFixflowUserVariables>;

interface DeleteFixflowUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFixflowUserVariables): MutationRef<DeleteFixflowUserData, DeleteFixflowUserVariables>;
}
export const deleteFixflowUserRef: DeleteFixflowUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteFixflowUser(dc: DataConnect, vars: DeleteFixflowUserVariables): MutationPromise<DeleteFixflowUserData, DeleteFixflowUserVariables>;

interface DeleteFixflowUserRef {
  ...
  (dc: DataConnect, vars: DeleteFixflowUserVariables): MutationRef<DeleteFixflowUserData, DeleteFixflowUserVariables>;
}
export const deleteFixflowUserRef: DeleteFixflowUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteFixflowUserRef:
```typescript
const name = deleteFixflowUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteFixflowUser` mutation requires an argument of type `DeleteFixflowUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteFixflowUserVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteFixflowUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteFixflowUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteFixflowUserData {
  fixflowUser_delete?: FixflowUser_Key | null;
}
```
### Using `DeleteFixflowUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteFixflowUser, DeleteFixflowUserVariables } from '@dataconnect/generated';

// The `DeleteFixflowUser` mutation requires an argument of type `DeleteFixflowUserVariables`:
const deleteFixflowUserVars: DeleteFixflowUserVariables = {
  id: ..., 
};

// Call the `deleteFixflowUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteFixflowUser(deleteFixflowUserVars);
// Variables can be defined inline as well.
const { data } = await deleteFixflowUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteFixflowUser(dataConnect, deleteFixflowUserVars);

console.log(data.fixflowUser_delete);

// Or, you can use the `Promise` API.
deleteFixflowUser(deleteFixflowUserVars).then((response) => {
  const data = response.data;
  console.log(data.fixflowUser_delete);
});
```

### Using `DeleteFixflowUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteFixflowUserRef, DeleteFixflowUserVariables } from '@dataconnect/generated';

// The `DeleteFixflowUser` mutation requires an argument of type `DeleteFixflowUserVariables`:
const deleteFixflowUserVars: DeleteFixflowUserVariables = {
  id: ..., 
};

// Call the `deleteFixflowUserRef()` function to get a reference to the mutation.
const ref = deleteFixflowUserRef(deleteFixflowUserVars);
// Variables can be defined inline as well.
const ref = deleteFixflowUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteFixflowUserRef(dataConnect, deleteFixflowUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.fixflowUser_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.fixflowUser_delete);
});
```

## DeleteServiceRequest
You can execute the `DeleteServiceRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteServiceRequest(vars: DeleteServiceRequestVariables): MutationPromise<DeleteServiceRequestData, DeleteServiceRequestVariables>;

interface DeleteServiceRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceRequestVariables): MutationRef<DeleteServiceRequestData, DeleteServiceRequestVariables>;
}
export const deleteServiceRequestRef: DeleteServiceRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteServiceRequest(dc: DataConnect, vars: DeleteServiceRequestVariables): MutationPromise<DeleteServiceRequestData, DeleteServiceRequestVariables>;

interface DeleteServiceRequestRef {
  ...
  (dc: DataConnect, vars: DeleteServiceRequestVariables): MutationRef<DeleteServiceRequestData, DeleteServiceRequestVariables>;
}
export const deleteServiceRequestRef: DeleteServiceRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteServiceRequestRef:
```typescript
const name = deleteServiceRequestRef.operationName;
console.log(name);
```

### Variables
The `DeleteServiceRequest` mutation requires an argument of type `DeleteServiceRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteServiceRequestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteServiceRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteServiceRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteServiceRequestData {
  serviceRequest_delete?: ServiceRequest_Key | null;
}
```
### Using `DeleteServiceRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteServiceRequest, DeleteServiceRequestVariables } from '@dataconnect/generated';

// The `DeleteServiceRequest` mutation requires an argument of type `DeleteServiceRequestVariables`:
const deleteServiceRequestVars: DeleteServiceRequestVariables = {
  id: ..., 
};

// Call the `deleteServiceRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteServiceRequest(deleteServiceRequestVars);
// Variables can be defined inline as well.
const { data } = await deleteServiceRequest({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteServiceRequest(dataConnect, deleteServiceRequestVars);

console.log(data.serviceRequest_delete);

// Or, you can use the `Promise` API.
deleteServiceRequest(deleteServiceRequestVars).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest_delete);
});
```

### Using `DeleteServiceRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteServiceRequestRef, DeleteServiceRequestVariables } from '@dataconnect/generated';

// The `DeleteServiceRequest` mutation requires an argument of type `DeleteServiceRequestVariables`:
const deleteServiceRequestVars: DeleteServiceRequestVariables = {
  id: ..., 
};

// Call the `deleteServiceRequestRef()` function to get a reference to the mutation.
const ref = deleteServiceRequestRef(deleteServiceRequestVars);
// Variables can be defined inline as well.
const ref = deleteServiceRequestRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteServiceRequestRef(dataConnect, deleteServiceRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.serviceRequest_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.serviceRequest_delete);
});
```

## DeleteRequestImage
You can execute the `DeleteRequestImage` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteRequestImage(vars: DeleteRequestImageVariables): MutationPromise<DeleteRequestImageData, DeleteRequestImageVariables>;

interface DeleteRequestImageRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteRequestImageVariables): MutationRef<DeleteRequestImageData, DeleteRequestImageVariables>;
}
export const deleteRequestImageRef: DeleteRequestImageRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteRequestImage(dc: DataConnect, vars: DeleteRequestImageVariables): MutationPromise<DeleteRequestImageData, DeleteRequestImageVariables>;

interface DeleteRequestImageRef {
  ...
  (dc: DataConnect, vars: DeleteRequestImageVariables): MutationRef<DeleteRequestImageData, DeleteRequestImageVariables>;
}
export const deleteRequestImageRef: DeleteRequestImageRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteRequestImageRef:
```typescript
const name = deleteRequestImageRef.operationName;
console.log(name);
```

### Variables
The `DeleteRequestImage` mutation requires an argument of type `DeleteRequestImageVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteRequestImageVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteRequestImage` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteRequestImageData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteRequestImageData {
  requestImage_delete?: RequestImage_Key | null;
}
```
### Using `DeleteRequestImage`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteRequestImage, DeleteRequestImageVariables } from '@dataconnect/generated';

// The `DeleteRequestImage` mutation requires an argument of type `DeleteRequestImageVariables`:
const deleteRequestImageVars: DeleteRequestImageVariables = {
  id: ..., 
};

// Call the `deleteRequestImage()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteRequestImage(deleteRequestImageVars);
// Variables can be defined inline as well.
const { data } = await deleteRequestImage({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteRequestImage(dataConnect, deleteRequestImageVars);

console.log(data.requestImage_delete);

// Or, you can use the `Promise` API.
deleteRequestImage(deleteRequestImageVars).then((response) => {
  const data = response.data;
  console.log(data.requestImage_delete);
});
```

### Using `DeleteRequestImage`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteRequestImageRef, DeleteRequestImageVariables } from '@dataconnect/generated';

// The `DeleteRequestImage` mutation requires an argument of type `DeleteRequestImageVariables`:
const deleteRequestImageVars: DeleteRequestImageVariables = {
  id: ..., 
};

// Call the `deleteRequestImageRef()` function to get a reference to the mutation.
const ref = deleteRequestImageRef(deleteRequestImageVars);
// Variables can be defined inline as well.
const ref = deleteRequestImageRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteRequestImageRef(dataConnect, deleteRequestImageVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.requestImage_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.requestImage_delete);
});
```

## DeleteNotification
You can execute the `DeleteNotification` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteNotification(vars: DeleteNotificationVariables): MutationPromise<DeleteNotificationData, DeleteNotificationVariables>;

interface DeleteNotificationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteNotificationVariables): MutationRef<DeleteNotificationData, DeleteNotificationVariables>;
}
export const deleteNotificationRef: DeleteNotificationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteNotification(dc: DataConnect, vars: DeleteNotificationVariables): MutationPromise<DeleteNotificationData, DeleteNotificationVariables>;

interface DeleteNotificationRef {
  ...
  (dc: DataConnect, vars: DeleteNotificationVariables): MutationRef<DeleteNotificationData, DeleteNotificationVariables>;
}
export const deleteNotificationRef: DeleteNotificationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteNotificationRef:
```typescript
const name = deleteNotificationRef.operationName;
console.log(name);
```

### Variables
The `DeleteNotification` mutation requires an argument of type `DeleteNotificationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteNotificationVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteNotification` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteNotificationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteNotificationData {
  notification_delete?: Notification_Key | null;
}
```
### Using `DeleteNotification`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteNotification, DeleteNotificationVariables } from '@dataconnect/generated';

// The `DeleteNotification` mutation requires an argument of type `DeleteNotificationVariables`:
const deleteNotificationVars: DeleteNotificationVariables = {
  id: ..., 
};

// Call the `deleteNotification()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteNotification(deleteNotificationVars);
// Variables can be defined inline as well.
const { data } = await deleteNotification({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteNotification(dataConnect, deleteNotificationVars);

console.log(data.notification_delete);

// Or, you can use the `Promise` API.
deleteNotification(deleteNotificationVars).then((response) => {
  const data = response.data;
  console.log(data.notification_delete);
});
```

### Using `DeleteNotification`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteNotificationRef, DeleteNotificationVariables } from '@dataconnect/generated';

// The `DeleteNotification` mutation requires an argument of type `DeleteNotificationVariables`:
const deleteNotificationVars: DeleteNotificationVariables = {
  id: ..., 
};

// Call the `deleteNotificationRef()` function to get a reference to the mutation.
const ref = deleteNotificationRef(deleteNotificationVars);
// Variables can be defined inline as well.
const ref = deleteNotificationRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteNotificationRef(dataConnect, deleteNotificationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.notification_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.notification_delete);
});
```

## DeleteAppMeta
You can execute the `DeleteAppMeta` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteAppMeta(vars: DeleteAppMetaVariables): MutationPromise<DeleteAppMetaData, DeleteAppMetaVariables>;

interface DeleteAppMetaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAppMetaVariables): MutationRef<DeleteAppMetaData, DeleteAppMetaVariables>;
}
export const deleteAppMetaRef: DeleteAppMetaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAppMeta(dc: DataConnect, vars: DeleteAppMetaVariables): MutationPromise<DeleteAppMetaData, DeleteAppMetaVariables>;

interface DeleteAppMetaRef {
  ...
  (dc: DataConnect, vars: DeleteAppMetaVariables): MutationRef<DeleteAppMetaData, DeleteAppMetaVariables>;
}
export const deleteAppMetaRef: DeleteAppMetaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAppMetaRef:
```typescript
const name = deleteAppMetaRef.operationName;
console.log(name);
```

### Variables
The `DeleteAppMeta` mutation requires an argument of type `DeleteAppMetaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAppMetaVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteAppMeta` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAppMetaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAppMetaData {
  appMeta_delete?: AppMeta_Key | null;
}
```
### Using `DeleteAppMeta`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAppMeta, DeleteAppMetaVariables } from '@dataconnect/generated';

// The `DeleteAppMeta` mutation requires an argument of type `DeleteAppMetaVariables`:
const deleteAppMetaVars: DeleteAppMetaVariables = {
  id: ..., 
};

// Call the `deleteAppMeta()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAppMeta(deleteAppMetaVars);
// Variables can be defined inline as well.
const { data } = await deleteAppMeta({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAppMeta(dataConnect, deleteAppMetaVars);

console.log(data.appMeta_delete);

// Or, you can use the `Promise` API.
deleteAppMeta(deleteAppMetaVars).then((response) => {
  const data = response.data;
  console.log(data.appMeta_delete);
});
```

### Using `DeleteAppMeta`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAppMetaRef, DeleteAppMetaVariables } from '@dataconnect/generated';

// The `DeleteAppMeta` mutation requires an argument of type `DeleteAppMetaVariables`:
const deleteAppMetaVars: DeleteAppMetaVariables = {
  id: ..., 
};

// Call the `deleteAppMetaRef()` function to get a reference to the mutation.
const ref = deleteAppMetaRef(deleteAppMetaVars);
// Variables can be defined inline as well.
const ref = deleteAppMetaRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAppMetaRef(dataConnect, deleteAppMetaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appMeta_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appMeta_delete);
});
```

