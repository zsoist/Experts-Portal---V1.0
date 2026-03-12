import Link from "next/link";

import { cn } from "@experts/ui";

const items = [
  { href: "/", label: "Showcase" },
  {
    href: "/workspace",
    label: "Expert Workspace",
    matchPrefix: "/opportunities",
  },
  { href: "/profile", label: "Profile" },
  { href: "/availability", label: "Availability" },
  { href: "/projects", label: "Projects" },
  { href: "/ops-demo", label: "Ops Demo", matchPrefix: "/ops-demo" },
];

export function AppNav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            currentPath === item.href ||
              (item.matchPrefix && currentPath.startsWith(item.matchPrefix))
              ? "bg-white text-slate-950"
              : "bg-white/10 text-white hover:bg-white/20",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
