import { 
  usersTable, userKeysTable, adsTable
} from "./database";

import { clerkClientPublishableKey, clerkClientSecretKey, secrets, stripePublishableKey } from "./secrets";
import { adsbucket, adsBucketRouter } from "./bucket";

export const api = new sst.aws.ApiGatewayV2('BackendApi')


const tables = [usersTable, userKeysTable, adsTable]

export const apiResources = [
  ...tables,
  ...secrets,
  adsbucket,
  adsBucketRouter
]





api.route("POST /stripe-webhook", {
  link: [...apiResources],
  handler: "./packages/functions/src/billing.api.webhookHandler",
 
})

api.route("POST /api-keys", {
  link: [...apiResources],
  handler: "./packages/functions/src/billing.api.createApiKeyHandler",
 
})

api.route("GET /credits", {
  link: [...apiResources],
  handler: "./packages/functions/src/billing.api.getUserCreditsHandler",
})

api.route("POST /register", { 
  link: [...apiResources],
  handler: "./packages/functions/src/auth.api.registerWebhookHandler",
  permissions: [
    {
        actions: ["dynamodb:*", "dynamodb:PutItem"],
        resources: [usersTable.arn]
    }
],
})



export const frontend = new sst.aws.Nextjs("MyWeb", {
  link: [api, secrets],
  path: "packages/frontend",
  environment: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: clerkClientPublishableKey.value,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: stripePublishableKey.value,
    CLERK_SECRET_KEY: clerkClientSecretKey.value,
    NEXT_PUBLIC_BACKEND_API_URL: api.url,
  },
});

api.route("POST /checkout", {
  link: [...apiResources, frontend],
  handler: "./packages/functions/src/billing.api.checkoutHandler",

})

api.route("GET /ads", {
  link: [...apiResources],
  handler: "./packages/functions/src/agent-runtime.api.getAllUserAdsHandler",
})

// Add a route for getting a specific ad by ID
api.route("GET /ads/{id}", {
  link: [...apiResources],
  handler: "./packages/functions/src/agent-runtime.api.getAdByIdHandler",
})

api.route("POST /ads", {
  link: [...apiResources],
  handler: "./packages/functions/src/agent-runtime.api.requestAdHandler",
})
