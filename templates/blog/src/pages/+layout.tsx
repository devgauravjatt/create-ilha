import { head, isActive } from "@ilha/router";
import type { View } from "ilha";

const SITE_NAME = "{{projectName}}";

const NAV = [
  { href: "/", label: "Posts" },
  { href: "/about", label: "About" },
];

export default function Layout({ children }: { children?: View }) {
  head({
    meta: [{ content: `${SITE_NAME} — a blog built with Ilha`, name: "description" }],
    titleTemplate: (title) => (title ? `${title} · ${SITE_NAME}` : SITE_NAME),
  });

  return (
    <div class="flex min-h-screen flex-col bg-base-100">
      <header class="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4 py-6">
        <a href="/" class="font-semibold text-lg tracking-tight">
          {SITE_NAME}
        </a>
        <nav class="flex items-center gap-1">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              class={isActive(item.href) ? "btn btn-sm" : "btn btn-sm btn-ghost"}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main class="mx-auto w-full max-w-2xl flex-1 px-4 pb-12">{children}</main>

      <footer class="mx-auto w-full max-w-2xl border-base-300 border-t px-4 py-6 text-base-content/60 text-sm">
        <p>
          Server-rendered with{" "}
          <a class="link" href="https://ilha.build" target="_blank" rel="noreferrer">
            Ilha
          </a>{" "}
          and{" "}
          <a class="link" href="https://oxide.build" target="_blank" rel="noreferrer">
            Oxide
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
