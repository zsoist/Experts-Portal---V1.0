import { z } from "zod";

export const roleValues = [
  "expert",
  "ops_admin",
  "compliance_admin",
  "finance_admin",
] as const;

export const webEnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url()
    .default("http://localhost:4000/api/v1"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Expert Portal"),
});

export const apiEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z
    .string()
    .min(1)
    .default("postgresql://postgres:postgres@localhost:5432/experts_portal"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  WORKOS_CLIENT_ID: z.string().default("workos_client_id"),
  WORKOS_API_KEY: z.string().default("workos_api_key"),
  WORKOS_ISSUER: z.string().default("https://api.workos.com"),
  WORKOS_JWKS_URL: z
    .string()
    .url()
    .default("https://api.workos.com/sso/jwks/placeholder"),
  PERSONA_WEBHOOK_SECRET: z.string().default("persona_dev_secret"),
  EXTERNAL_PAYMENT_BASE_URL: z
    .string()
    .url()
    .default("https://payments.example.com"),
  AWS_REGION: z.string().default("us-east-1"),
  SQS_PERSONA_QUEUE_URL: z
    .string()
    .default("https://sqs.us-east-1.amazonaws.com/123456789012/persona-events"),
});

export const workerEnvSchema = apiEnvSchema.pick({
  AWS_REGION: true,
  DATABASE_URL: true,
  PERSONA_WEBHOOK_SECRET: true,
  REDIS_URL: true,
  SQS_PERSONA_QUEUE_URL: true,
});

export type WebEnv = z.infer<typeof webEnvSchema>;
export type ApiEnv = z.infer<typeof apiEnvSchema>;
export type WorkerEnv = z.infer<typeof workerEnvSchema>;

export function readWebEnv(source: NodeJS.ProcessEnv): WebEnv {
  return webEnvSchema.parse(source);
}

export function readApiEnv(source: NodeJS.ProcessEnv): ApiEnv {
  return apiEnvSchema.parse(source);
}

export function readWorkerEnv(source: NodeJS.ProcessEnv): WorkerEnv {
  return workerEnvSchema.parse(source);
}

export const appMetadata = {
  name: "Expert Portal MVP",
  auditNamespace: "expert-portal",
  defaultTimezone: "UTC",
} as const;
