import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: HTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const variantClassName =
    variant === "primary"
      ? "bg-brand text-white shadow-sm hover:opacity-90"
      : variant === "secondary"
        ? "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
        : "bg-transparent text-slate-700 hover:bg-slate-100";

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition",
        variantClassName,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        {eyebrow}
      </p>
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        {body ? (
          <p className="max-w-2xl text-sm text-slate-600">{body}</p>
        ) : null}
      </div>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="space-y-4 bg-slate-950 text-white">
      <p className="text-xs uppercase tracking-[0.25em] text-white/70">
        {label}
      </p>
      <div className="space-y-1">
        <p className="text-3xl font-semibold">{value}</p>
        <p className="text-sm text-white/80">{detail}</p>
      </div>
    </Card>
  );
}

export function PageShell({
  children,
  title,
  subtitle,
  accent,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
  accent?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef4f0_100%)] px-5 py-8 text-slate-950 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="grid gap-6 rounded-[32px] bg-slate-950 px-6 py-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] md:grid-cols-[1.6fr_1fr] md:px-10">
          <div className="space-y-4">
            <Badge className="bg-white/10 text-white">
              Dialectica expert supply
            </Badge>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                {title}
              </h1>
              <p className="max-w-2xl text-base text-white/80">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-end justify-start md:justify-end">
            {accent}
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
