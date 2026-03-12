"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { ExpertProfile } from "@experts/contracts";
import { Button, Card } from "@experts/ui";

const schema = z.object({
  fullName: z.string().min(2),
  headline: z.string().min(10),
  timezone: z.string().min(2),
  expertiseTags: z.string().min(3),
});

type FormValues = z.infer<typeof schema>;

export function ProfileForm({ profile }: { profile: ExpertProfile }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: profile.fullName,
      headline: profile.headline,
      timezone: profile.timezone,
      expertiseTags: profile.expertiseTags.join(", "),
    },
  });

  const saved = form.formState.isSubmitSuccessful;

  return (
    <Card className="space-y-5">
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(async () => {
          await Promise.resolve();
        })}
      >
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Full name
          <input
            {...form.register("fullName")}
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Headline
          <textarea
            {...form.register("headline")}
            className="min-h-28 rounded-2xl border border-slate-200 px-4 py-3"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Time zone
            <input
              {...form.register("timezone")}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Expertise tags
            <input
              {...form.register("expertiseTags")}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            />
          </label>
        </div>
        {saved ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Local draft saved. Wire this form to `PATCH /experts/me` to persist
            updates.
          </p>
        ) : null}
        <Button>Save profile draft</Button>
      </form>
    </Card>
  );
}
