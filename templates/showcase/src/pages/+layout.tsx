import { head, isActive } from "@ilha/router";
import type { View } from "ilha";

const OWNER = "{{projectName}}";

const NAV = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Layout({ children }: { children?: View }) {
  head({
    meta: [{ content: `${OWNER} — selected work`, name: "description" }],
    titleTemplate: (title) => (title ? `${title} · ${OWNER}` : OWNER),
  });

  return (
    <div class="flex min-h-screen flex-col bg-base-100">
      <header class="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-8">
        <a href="/" class="font-semibold text-lg tracking-tight">
          {OWNER}
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

      <main class="mx-auto w-full max-w-3xl flex-1 px-4 pb-16">{children}</main>

      <footer class="mx-auto w-full max-w-3xl border-base-300 border-t px-4 py-6 text-base-content/60 text-sm">
        <p>
          © {new Date().getFullYear()} {OWNER} · built with{" "}
          <a class="link" href="https://ilha.build" target="_blank" rel="noreferrer">
            Ilha
          </a>
        </p>
      </footer>
    </div>
  );
}
