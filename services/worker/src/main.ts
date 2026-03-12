import "reflect-metadata";

import { NestFactory } from "@nestjs/core";

import { WorkerConfigService } from "./config/worker-config.service";
import { WorkerModule } from "./worker.module";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    logger: ["error", "warn", "log"],
  });
  const config = app.get(WorkerConfigService);
  console.log(
    `Expert worker ready for queue ${config.env.SQS_PERSONA_QUEUE_URL}`,
  );
}

void bootstrap();
