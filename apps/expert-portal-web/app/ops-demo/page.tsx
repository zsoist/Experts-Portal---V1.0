import { Badge, Card, PageShell } from "@experts/ui";

import { AppNav } from "../../components/app-nav";
import { OpsDemoClient } from "../../components/ops-demo-client";
import { OpsDemoNav } from "../../components/ops-demo-nav";

export default function OpsDemoPage() {
  return (
    <PageShell
      title="Operations command center for expert supply"
      subtitle="A distinct internal surface for verification review, compliance management, payment status control, and audit visibility."
      accent={
        <div className="space-y-3">
          <AppNav currentPath="/ops-demo" />
          <div className="space-y-3 rounded-[28px] bg-white p-5 text-slate-950">
            <p className="text-sm text-slate-500">RBAC context</p>
            <Badge className="bg-brand text-white">
              ops_admin / compliance_admin / finance_admin
            </Badge>
          </div>
        </div>
      }
    >
      <Card className="bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
              Internal product surface
            </p>
            <p className="text-lg text-slate-900">
              Separate app boundary for operational overrides and audit review,
              collapsed into the same demo for GitHub Pages delivery.
            </p>
          </div>
          <OpsDemoNav currentPath="/ops-demo" />
        </div>
      </Card>
      <OpsDemoClient />
    </PageShell>
  );
}
