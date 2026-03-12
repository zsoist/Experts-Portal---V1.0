"use client";

import { useState } from "react";

import type { AvailabilityRule } from "@experts/contracts";
import { Button, Card } from "@experts/ui";

export function AvailabilityForm({ rules }: { rules: AvailabilityRule[] }) {
  const [saved, setSaved] = useState(false);

  return (
    <Card className="space-y-5">
      <div className="space-y-3">
        {rules.map((rule) => (
          <div key={rule.id} className="rounded-[24px] bg-slate-50 p-4">
            <p className="font-medium text-slate-950">
              Weekday {rule.weekday} · {rule.startTime} to {rule.endTime}
            </p>
            <p className="text-sm text-slate-600">
              Time zone {rule.timezone} · minimum {rule.leadHours}h notice
            </p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Default timezone
          <input
            defaultValue={rules[0]?.timezone}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Lead time (hours)
          <input
            defaultValue={rules[0]?.leadHours}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>
      </div>
      {saved ? (
        <p className="rounded-2xl bg-brand/10 px-4 py-3 text-sm text-brand">
          Draft availability captured. Persist through `POST/PATCH
          /availability-rules`.
        </p>
      ) : null}
      <Button onClick={() => setSaved(true)}>Update availability draft</Button>
    </Card>
  );
}
