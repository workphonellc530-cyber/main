import Link from "next/link";

import { cn } from "@/lib/cn";

function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium text-zinc-700 hover:text-zinc-900",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-semibold tracking-tight text-zinc-900">
            AgentOps Revenue Engine
          </Link>
          <nav className="hidden items-center gap-5 md:flex">
            <NavLink href="#playbooks">Playbooks</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#proof">Proof</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}

