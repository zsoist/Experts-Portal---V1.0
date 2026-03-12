import { Controller, Get, Module, Param, Post } from "@nestjs/common";

import type { AuditService } from "../audit/audit.module";
import { AuditModule } from "../audit/audit.module";
import { CurrentUser, type PortalUser } from "../auth/auth.module";
import type { AppConfigService } from "../config/app-config.service";
import { type PortalStoreService, PrismaModule } from "../prisma/prisma.module";

export class PaymentsService {
  constructor(
    private readonly store: PortalStoreService,
    private readonly config: AppConfigService,
    private readonly audit: AuditService,
  ) {}

  list() {
    return this.store.listPayments();
  }

  createExternalLink(user: PortalUser, engagementId: string) {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15).toISOString();
    const url = new URL(
      `/engagements/${engagementId}`,
      this.config.env.EXTERNAL_PAYMENT_BASE_URL,
    );
    url.searchParams.set("expertId", user.id);

    this.audit.emit({
      actor: user,
      action: "payment.external_link_opened",
      entityType: "payment",
      entityId: engagementId,
      payload: { expiresAt },
    });

    return {
      url: url.toString(),
      expiresAt,
    };
  }

  updateStatus(
    user: PortalUser,
    paymentId: string,
    status: Parameters<PortalStoreService["updatePaymentStatus"]>[1],
  ) {
    const payment = this.store.updatePaymentStatus(paymentId, status);
    this.audit.emit({
      actor: user,
      action: "payment.status.updated",
      entityType: "payment",
      entityId: paymentId,
      payload: { status },
    });
    return payment;
  }
}

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  list() {
    return this.paymentsService.list();
  }

  @Post(":engagementId/external-link")
  createExternalLink(
    @CurrentUser() user: PortalUser,
    @Param("engagementId") engagementId: string,
  ) {
    return this.paymentsService.createExternalLink(user, engagementId);
  }
}

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
