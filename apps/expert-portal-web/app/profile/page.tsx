import { fetchExpertProfile } from "@experts/contracts";
import { Card, PageShell, SectionHeading } from "@experts/ui";

import { AppNav } from "../../components/app-nav";
import { ProfileForm } from "../../components/profile-form";

export default async function ProfilePage() {
  const profile = await fetchExpertProfile();

  return (
    <PageShell
      title="Profile and recency management"
      subtitle="Let experts keep role history, expertise, and freshness signals current without involving associate follow-up."
      accent={<AppNav currentPath="/profile" />}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <ProfileForm profile={profile} />
        <Card className="space-y-4">
          <SectionHeading
            eyebrow="Freshness"
            title="Signals that drive better screening"
            body="Role recency is explicit so associates do not have to reconstruct it from email or old call history."
          />
          <div className="space-y-4">
            {profile.recencySignals.map((signal) => (
              <div key={signal.id} className="rounded-[24px] bg-slate-50 p-4">
                <p className="font-medium text-slate-950">{signal.topic}</p>
                <p className="text-sm text-slate-600">
                  Last hands-on{" "}
                  {new Date(signal.lastHandsOnDate).toLocaleDateString()} ·
                  confidence {Math.round(signal.confidence * 100)}%
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
