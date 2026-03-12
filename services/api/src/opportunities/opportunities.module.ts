import type { OpportunityStatus } from "@experts/contracts";
import { Body, Controller, Get, Module, Param, Post } from "@nestjs/common";
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

import type { AuditService } from "../audit/audit.module";
import { AuditModule } from "../audit/audit.module";
import { CurrentUser, type PortalUser } from "../auth/auth.module";
import { type PortalStoreService, PrismaModule } from "../prisma/prisma.module";
import { assertOpportunityTransition } from "./opportunity.state-machine";

class ScreeningAnswerInputDto {
  @IsString()
  questionId!: string;

  @IsString()
  answerText!: string;
}

class SubmitScreeningAnswersDto {
  @IsArray()
  answers!: ScreeningAnswerInputDto[];

  @IsOptional()
  @IsBoolean()
  submit?: boolean;
}

class DeclineOpportunityDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

export class OpportunitiesService {
  constructor(
    private readonly store: PortalStoreService,
    private readonly audit: AuditService,
  ) {}

  listForCurrentExpert() {
    return this.store.listOpportunities();
  }

  getOne(opportunityId: string) {
    return this.store.getOpportunity(opportunityId);
  }

  updateStatus(
    user: PortalUser,
    opportunityId: string,
    status: OpportunityStatus,
    payload?: Record<string, unknown>,
  ) {
    const current = this.store.getOpportunity(opportunityId)!.status;
    assertOpportunityTransition(current, status);
    const opportunity = this.store.updateOpportunityStatus(
      opportunityId,
      status,
    );
    this.audit.emit({
      actor: user,
      action:
        status === "declined" ? "opportunity.declined" : "opportunity.accepted",
      entityType: "opportunity",
      entityId: opportunity.id,
      payload: payload ?? { status },
    });
    return opportunity;
  }

  saveScreeningAnswers(
    user: PortalUser,
    opportunityId: string,
    body: SubmitScreeningAnswersDto,
  ) {
    const current = this.store.getOpportunity(opportunityId)!.status;
    if (current === "invited") {
      this.store.updateOpportunityStatus(
        opportunityId,
        "screening_in_progress",
      );
    }

    const answers = this.store.saveScreeningAnswers(
      opportunityId,
      body.answers.map((answer) => ({
        id: crypto.randomUUID(),
        questionId: answer.questionId,
        answerText: answer.answerText,
        submittedAt: new Date().toISOString(),
        version: 1,
      })),
    );

    if (body.submit) {
      this.updateStatus(user, opportunityId, "accepted", { submitted: true });
    }

    this.audit.emit({
      actor: user,
      action: "screening.submitted",
      entityType: "opportunity",
      entityId: opportunityId,
      payload: {
        answerCount: body.answers.length,
        submit: body.submit ?? false,
      },
    });

    return answers;
  }

  upsertOpportunity(input: {
    id?: string;
    title: string;
    topic: string;
    deadlineAt: string;
    description: string;
    estimatedMinutes: number;
    rateUsd: number;
  }) {
    return this.store.saveOpportunity({
      id: input.id ?? crypto.randomUUID(),
      title: input.title,
      topic: input.topic,
      status: "invited",
      deadlineAt: input.deadlineAt,
      rateUsd: input.rateUsd,
      complianceFlags: [],
      description: input.description,
      estimatedMinutes: input.estimatedMinutes,
      screeningQuestions: [],
    });
  }

  addCandidates(opportunityId: string, expertIds: string[]) {
    return this.store.addCandidates(opportunityId, expertIds);
  }
}

@Controller()
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get("experts/me/opportunities")
  listForCurrentExpert() {
    return this.opportunitiesService.listForCurrentExpert();
  }

  @Get("opportunities/:opportunityId")
  getOne(@Param("opportunityId") opportunityId: string) {
    return this.opportunitiesService.getOne(opportunityId);
  }

  @Post("opportunities/:opportunityId/accept")
  accept(
    @CurrentUser() user: PortalUser,
    @Param("opportunityId") opportunityId: string,
  ) {
    return this.opportunitiesService.updateStatus(
      user,
      opportunityId,
      "accepted",
    );
  }

  @Post("opportunities/:opportunityId/decline")
  decline(
    @CurrentUser() user: PortalUser,
    @Param("opportunityId") opportunityId: string,
    @Body() body: DeclineOpportunityDto,
  ) {
    return this.opportunitiesService.updateStatus(
      user,
      opportunityId,
      "declined",
      {
        reason: body.reason,
      },
    );
  }

  @Post("opportunities/:opportunityId/screening-answers")
  submitAnswers(
    @CurrentUser() user: PortalUser,
    @Param("opportunityId") opportunityId: string,
    @Body() body: SubmitScreeningAnswersDto,
  ) {
    return this.opportunitiesService.saveScreeningAnswers(
      user,
      opportunityId,
      body,
    );
  }
}

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService],
  exports: [OpportunitiesService],
})
export class OpportunitiesModule {}
