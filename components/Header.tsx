"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Topics" },
  { href: "/scripture", label: "Scripture" },
  { href: "/search", label: "Search" },
  { href: "/admin", label: "Add / Edit" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-maroon-100 bg-maroon-900 text-parchment">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-wide">
          LDS Apologetics Reference
        </Link>
        <nav className="flex flex-wrap gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-parchment text-maroon-900"
                    : "text-parchment/90 hover:bg-maroon-800"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
