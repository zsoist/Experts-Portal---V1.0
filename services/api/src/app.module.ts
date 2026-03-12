import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuditModule } from "./audit/audit.module";
import { AuthModule } from "./auth/auth.module";
import { AvailabilityModule } from "./availability/availability.module";
import { BookingsModule } from "./bookings/bookings.module";
import { ComplianceModule } from "./compliance/compliance.module";
import { AppConfigModule } from "./config/app-config.module";
import { AppConfigService } from "./config/app-config.service";
import { ExpertsModule } from "./experts/experts.module";
import { HealthModule } from "./health/health.module";
import { OpportunitiesModule } from "./opportunities/opportunities.module";
import { OpsModule } from "./ops/ops.module";
import { PaymentsModule } from "./payments/payments.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AppConfigModule,
    PrismaModule,
    AuthModule,
    AuditModule,
    ExpertsModule,
    OpportunitiesModule,
    AvailabilityModule,
    BookingsModule,
    ComplianceModule,
    PaymentsModule,
    OpsModule,
    HealthModule,
  ],
  providers: [AppConfigService],
})
export class AppModule {}
