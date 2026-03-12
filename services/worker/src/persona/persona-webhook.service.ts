import { Injectable } from "@nestjs/common";

import type { WorkerConfigService } from "../config/worker-config.service";
import {
  type PersonaEvent,
  PersonaEventProcessor,
} from "../jobs/persona-event.processor";
import { verifyPersonaSignature } from "./persona-signature";

@Injectable()
export class PersonaWebhookService {
  private readonly processor = new PersonaEventProcessor();

  constructor(private readonly config: WorkerConfigService) {}

  handleWebhook(
    rawBody: string,
    signatureHeader: string | undefined,
    event: PersonaEvent,
  ) {
    const verified = verifyPersonaSignature({
      secret: this.config.env.PERSONA_WEBHOOK_SECRET,
      payload: rawBody,
      signatureHeader,
    });

    if (!verified) {
      return { accepted: false, reason: "invalid_signature" as const };
    }

    return this.processor.process(event);
  }
}
