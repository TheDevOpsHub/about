import Link from "next/link";
import Image from "next/image";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <Image
            src="/logo.png"
            alt=""
            width={32}
            height={32}
            className="rounded"
            priority
          />
          {siteConfig.name}
        </Link>
        <div className="flex items-center gap-4">
          <MainNav />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
