import { head, isActive } from "@ilha/router";
import type { View } from "ilha";

const APP_NAME = "{{projectName}}";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/projects", label: "Projects" },
  { href: "/settings", label: "Settings" },
];

export default function Layout({ children }: { children?: View }) {
  head({
    titleTemplate: (title) => (title ? `${title} · ${APP_NAME}` : APP_NAME),
  });

  return (
    <div class="min-h-screen bg-base-200/40 lg:grid lg:grid-cols-[16rem_1fr]">
      <aside class="flex flex-col gap-4 border-base-300 border-b bg-base-100 p-4 lg:h-screen lg:sticky lg:top-0 lg:border-r lg:border-b-0">
        <a href="/" class="px-2 font-semibold text-lg tracking-tight">
          {APP_NAME}
        </a>
        <nav class="flex gap-1 lg:flex-col">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              class={
                isActive(item.href)
                  ? "btn btn-sm btn-active justify-start"
                  : "btn btn-sm btn-ghost justify-start"
              }
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div class="mt-auto hidden text-base-content/60 text-xs lg:block">
          <p>
            Built with{" "}
            <a class="link" href="https://ilha.build" target="_blank" rel="noreferrer">
              Ilha
            </a>
          </p>
        </div>
      </aside>

      <main class="p-4 lg:p-8">
        <div class="mx-auto flex max-w-4xl flex-col gap-6">{children}</div>
      </main>
    </div>
  );
}
