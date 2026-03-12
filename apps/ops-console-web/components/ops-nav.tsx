import Link from "next/link";

import { cn } from "@experts/ui";

const items = [
  { href: "/", label: "Ops dashboard" },
  {
    href: "/experts/4dd4d84f-33fd-476f-b814-5cc6d55f32a9",
    label: "Expert detail",
  },
];

export function OpsNav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            currentPath === item.href
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
