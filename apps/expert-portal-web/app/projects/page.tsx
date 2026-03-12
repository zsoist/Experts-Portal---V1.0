import { fetchBookings, fetchPayments } from "@experts/contracts";
import { Card, PageShell, SectionHeading } from "@experts/ui";

import { AppNav } from "../../components/app-nav";

export default async function ProjectsPage() {
  const [bookings, payments] = await Promise.all([
    fetchBookings(),
    fetchPayments(),
  ]);

  return (
    <PageShell
      title="Projects and payments in one timeline"
      subtitle="The expert should always understand what is booked, what has completed, and what still needs a payout action."
      accent={<AppNav currentPath="/projects" />}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card className="space-y-4">
          <SectionHeading
            eyebrow="Consultations"
            title="Current and upcoming calls"
            body="This is the authoritative pipeline view for v1."
          />
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-[24px] border border-slate-200 p-4"
              >
                <p className="font-medium text-slate-950">{booking.title}</p>
                <p className="text-sm text-slate-600">
                  {new Date(booking.startAt).toLocaleString()} ·{" "}
                  {booking.status}
                </p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="space-y-4">
          <SectionHeading
            eyebrow="Payouts"
            title="Status visibility"
            body="v1 keeps provider logic outside the portal but exposes clear payment history and next actions."
          />
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="rounded-[24px] bg-slate-50 p-4">
                <p className="font-medium text-slate-950">
                  ${payment.amountUsd}
                </p>
                <p className="text-sm text-slate-600">
                  {payment.status.replaceAll("_", " ")} · due{" "}
                  {new Date(payment.dueAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
