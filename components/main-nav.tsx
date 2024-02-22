"use client";

import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const MainNav = () => {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo />
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <a
          href={siteConfig.url}
          className="transition-colors hover:text-foreground/80 text-foreground/60"
          target="_blank"
          rel="noopener"
        >
          About Us
        </a>
        <Link
          href={siteConfig.links.github}
          className={cn(
            "hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block"
          )}
        >
          GitHub
        </Link>
      </nav>
    </div>
  );
};
