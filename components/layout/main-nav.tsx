"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/nav-links";

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={`group relative py-1 text-sm transition-colors ${
              isActive ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {link.label}
            <span
              aria-hidden="true"
              className={`absolute -bottom-0.5 left-0 h-0.5 bg-accent-2 transition-all duration-200 ${
                isActive ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
