import { describe, expect, it } from "vitest";

import { PortalStoreService } from "../prisma/prisma.module";
import { AuditService } from "./audit.module";

describe("AuditService", () => {
  it("appends an event with the expected action", () => {
    const store = new PortalStoreService();
    const audit = new AuditService(store);

    const event = audit.emit({
      actor: { id: "actor-1", role: "expert" },
      action: "expert.profile.updated",
      entityType: "expert_profile",
      entityId: "entity-1",
    });

    expect(event.action).toBe("expert.profile.updated");
    expect(store.listAuditEvents()[0]!.id).toBe(event.id);
  });
});
