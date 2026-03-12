import { Module } from "@nestjs/common";

import { WorkerConfigService } from "./config/worker-config.service";
import { PersonaWebhookService } from "./persona/persona-webhook.service";

@Module({
  providers: [WorkerConfigService, PersonaWebhookService],
})
export class WorkerModule {}
