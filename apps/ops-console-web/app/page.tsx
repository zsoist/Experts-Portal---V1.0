import { Badge, Card, PageShell } from "@experts/ui";

import { OpsDashboardClient } from "../components/ops-dashboard-client";
import { OpsNav } from "../components/ops-nav";

export default function OpsHomePage() {
  return (
    <PageShell
      title="Operations command center for expert supply"
      subtitle="A distinct internal surface for verification review, compliance management, and payment status control."
      accent={
        <div className="space-y-3 rounded-[28px] bg-white p-5 text-slate-950">
          <p className="text-sm text-slate-500">RBAC context</p>
          <Badge className="bg-brand text-white">
            ops_admin / compliance_admin / finance_admin
          </Badge>
        </div>
      }
    >
      <Card className="bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Ops surface
            </p>
            <p className="text-lg text-slate-900">
              Separate app boundary for operational overrides and audit review.
            </p>
          </div>
          <OpsNav currentPath="/" />
        </div>
      </Card>
      <OpsDashboardClient />
    </PageShell>
  );
}
