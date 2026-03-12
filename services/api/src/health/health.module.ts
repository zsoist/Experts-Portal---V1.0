import { Controller, Get, Module } from "@nestjs/common";

import { Public } from "../auth/auth.module";

@Controller("health")
export class HealthController {
  @Get()
  @Public()
  status() {
    return {
      ok: true,
      service: "expert-portal-api",
      timestamp: new Date().toISOString(),
    };
  }
}

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
