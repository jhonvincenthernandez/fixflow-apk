# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createFixflowUser, createServiceRequest, updateServiceRequest, createRequestImage, createNotification, markNotificationRead, createAppMeta, updateAppMeta, createAppFeedback, checkConnection } from '@dataconnect/generated';


// Operation CreateFixflowUser:  For variables, look at type CreateFixflowUserVars in ../index.d.ts
const { data } = await CreateFixflowUser(dataConnect, createFixflowUserVars);

// Operation CreateServiceRequest:  For variables, look at type CreateServiceRequestVars in ../index.d.ts
const { data } = await CreateServiceRequest(dataConnect, createServiceRequestVars);

// Operation UpdateServiceRequest:  For variables, look at type UpdateServiceRequestVars in ../index.d.ts
const { data } = await UpdateServiceRequest(dataConnect, updateServiceRequestVars);

// Operation CreateRequestImage:  For variables, look at type CreateRequestImageVars in ../index.d.ts
const { data } = await CreateRequestImage(dataConnect, createRequestImageVars);

// Operation CreateNotification:  For variables, look at type CreateNotificationVars in ../index.d.ts
const { data } = await CreateNotification(dataConnect, createNotificationVars);

// Operation MarkNotificationRead:  For variables, look at type MarkNotificationReadVars in ../index.d.ts
const { data } = await MarkNotificationRead(dataConnect, markNotificationReadVars);

// Operation CreateAppMeta:  For variables, look at type CreateAppMetaVars in ../index.d.ts
const { data } = await CreateAppMeta(dataConnect, createAppMetaVars);

// Operation UpdateAppMeta:  For variables, look at type UpdateAppMetaVars in ../index.d.ts
const { data } = await UpdateAppMeta(dataConnect, updateAppMetaVars);

// Operation CreateAppFeedback:  For variables, look at type CreateAppFeedbackVars in ../index.d.ts
const { data } = await CreateAppFeedback(dataConnect, createAppFeedbackVars);

// Operation CheckConnection: 
const { data } = await CheckConnection(dataConnect);


```