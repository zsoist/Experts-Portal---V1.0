import { Controller, Get, Module, Param, Post } from "@nestjs/common";
import { createEvent } from "ics";

import type { AuditService } from "../audit/audit.module";
import { AuditModule } from "../audit/audit.module";
import { CurrentUser, type PortalUser } from "../auth/auth.module";
import type { ComplianceService } from "../compliance/compliance.module";
import { ComplianceModule } from "../compliance/compliance.module";
import { type PortalStoreService, PrismaModule } from "../prisma/prisma.module";

export function buildBookingIcs(input: {
  title: string;
  startAt: string;
  endAt: string;
  description: string;
}) {
  const start = new Date(input.startAt);
  const end = new Date(input.endAt);
  const { error, value } = createEvent({
    title: input.title,
    description: input.description,
    start: [
      start.getUTCFullYear(),
      start.getUTCMonth() + 1,
      start.getUTCDate(),
      start.getUTCHours(),
      start.getUTCMinutes(),
    ],
    end: [
      end.getUTCFullYear(),
      end.getUTCMonth() + 1,
      end.getUTCDate(),
      end.getUTCHours(),
      end.getUTCMinutes(),
    ],
    productId: "Dialectica Expert Portal MVP",
  });

  if (error || !value) {
    throw new Error(error?.message ?? "Failed to generate ICS");
  }

  return value;
}

export class BookingsService {
  constructor(
    private readonly store: PortalStoreService,
    private readonly compliance: ComplianceService,
    private readonly audit: AuditService,
  ) {}

  list() {
    return this.store.listBookings();
  }

  exportIcs(user: PortalUser, bookingId: string) {
    const gate = this.compliance.evaluateSchedulingGate();
    if (!gate.allowed) {
      this.audit.emit({
        actor: user,
        action: "booking.blocked.compliance",
        entityType: "booking",
        entityId: bookingId,
        payload: { reason: gate.reason },
      });
      throw new Error(gate.reason ?? "Compliance gate blocked booking.");
    }

    const booking = this.store
      .listBookings()
      .find((item) => item.id === bookingId);
    if (!booking) {
      throw new Error(`Booking ${bookingId} not found`);
    }

    this.audit.emit({
      actor: user,
      action: "booking.created",
      entityType: "booking",
      entityId: booking.id,
      payload: { export: "ics" },
    });

    return buildBookingIcs({
      title: booking.title,
      startAt: booking.startAt,
      endAt: booking.endAt,
      description: `Opportunity ${booking.opportunityId}`,
    });
  }
}

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get("bookings")
  list() {
    return this.bookingsService.list();
  }

  @Post("bookings/:bookingId/ics")
  exportIcs(
    @CurrentUser() user: PortalUser,
    @Param("bookingId") bookingId: string,
  ) {
    return this.bookingsService.exportIcs(user, bookingId);
  }
}

@Module({
  imports: [PrismaModule, ComplianceModule, AuditModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
