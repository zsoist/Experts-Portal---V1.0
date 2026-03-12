import Link from "next/link";

import { demoExpertProfile } from "@experts/contracts";
import { cn } from "@experts/ui";

const items = [
  { href: "/ops-demo", label: "Ops dashboard", matchPrefix: undefined },
  {
    href: `/ops-demo/experts/${demoExpertProfile.id}`,
    label: "Expert detail",
    matchPrefix: "/ops-demo/experts",
  },
] as const;

export function OpsDemoNav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            currentPath === item.href ||
              (item.matchPrefix !== undefined &&
                currentPath.startsWith(item.matchPrefix))
              ? "bg-brand text-white"
              : "bg-white text-slate-700 hover:bg-slate-100",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
