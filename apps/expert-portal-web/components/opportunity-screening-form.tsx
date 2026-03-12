"use client";

import { useState } from "react";

import type { OpportunityDetail } from "@experts/contracts";
import { Button, Card } from "@experts/ui";

export function OpportunityScreeningForm({
  opportunity,
}: {
  opportunity: OpportunityDetail;
}) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="space-y-5">
      <div className="space-y-4">
        {opportunity.screeningQuestions.map((question) => (
          <label
            key={question.id}
            className="grid gap-2 text-sm font-medium text-slate-700"
          >
            {question.prompt}
            <textarea className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
        ))}
      </div>
      {submitted ? (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Draft screening answers captured. Wire submit/accept actions to `POST
          /opportunities/:id/screening-answers`.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => setSubmitted(true)}>Save screening draft</Button>
        <Button variant="secondary" onClick={() => setSubmitted(true)}>
          Submit and accept
        </Button>
      </div>
    </Card>
  );
}
