import type { AuditEvent } from "@experts/contracts";
import { Injectable, Module } from "@nestjs/common";

import type { PortalUser } from "../auth/auth.module";
import type { PortalStoreService } from "../prisma/prisma.module";

@Injectable()
export class AuditService {
  constructor(private readonly store: PortalStoreService) {}

  emit(input: {
    actor: Pick<PortalUser, "id" | "role">;
    action: string;
    entityType: string;
    entityId: string;
    payload?: Record<string, unknown>;
  }) {
    const event: AuditEvent = {
      id: crypto.randomUUID(),
      actorType: input.actor.role,
      actorId: input.actor.id,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      payload: input.payload ?? {},
      createdAt: new Date().toISOString(),
    };

    return this.store.addAuditEvent(event);
  }

  list() {
    return this.store.listAuditEvents();
  }
}

@Module({
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
