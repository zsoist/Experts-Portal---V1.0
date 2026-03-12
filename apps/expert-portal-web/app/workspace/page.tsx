import { Badge, Card, PageShell } from "@experts/ui";

import { AppNav } from "../../components/app-nav";
import { DashboardClient } from "../../components/dashboard-client";

export default function WorkspacePage() {
  return (
    <PageShell
      title="Expert workspace"
      subtitle="The actual self-service product surface: opportunities, profile freshness, availability, project tracking, and payment status in one place."
      accent={<AppNav currentPath="/workspace" />}
    >
      <Card className="bg-slate-950 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.25em] text-white/70">
              Demo mode
            </p>
            <p className="text-lg text-white/90">
              Seeded with realistic expert workflow data so leadership can see
              the product shape immediately.
            </p>
          </div>
          <Badge className="bg-white text-slate-950">
            Expert-facing live prototype
          </Badge>
        </div>
      </Card>
      <DashboardClient />
    </PageShell>
  );
}
