import { head, isActive } from "@ilha/router";
import type { View } from "ilha";

const SITE_NAME = "{{projectName}}";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
];

export default function Layout({ children }: { children?: View }) {
  head({
    meta: [
      { content: `${SITE_NAME} — built with Ilha`, name: "description" },
      { content: `${SITE_NAME}`, property: "og:title" },
    ],
    titleTemplate: (title) => (title ? `${title} · ${SITE_NAME}` : SITE_NAME),
  });

  return (
    <div class="flex min-h-screen flex-col bg-base-100">
      <header class="navbar mx-auto w-full max-w-5xl px-4">
        <div class="flex-1">
          <a href="/" class="btn btn-ghost px-2 text-lg font-semibold tracking-tight">
            {SITE_NAME}
          </a>
        </div>
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
          <a href="#waitlist" class="btn btn-sm btn-primary">
            Get early access
          </a>
        </nav>
      </header>

      <main class="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>

      <footer class="footer footer-center border-base-300 border-t p-6 text-sm">
        <aside>
          <p>
            {SITE_NAME} · built with{" "}
            <a class="link" href="https://ilha.build" target="_blank" rel="noreferrer">
              Ilha
            </a>
          </p>
        </aside>
      </footer>
    </div>
  );
}
