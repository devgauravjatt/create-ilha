import { head } from "@ilha/router";

const TIMELINE = [
  { body: "Independent design engineer. Interfaces, design systems, the occasional CLI.", year: "2024 — now" },
  { body: "Led front-end at a small product studio.", year: "2021 — 2024" },
  { body: "Started writing about performance and progressive enhancement.", year: "2019" },
];

export default function About() {
  head({ title: "About" });

  return (
    <div class="flex flex-col gap-8">
      <section class="flex flex-col gap-4">
        <h1 class="font-semibold text-3xl tracking-tight">About</h1>
        <p class="text-base-content/80 leading-relaxed">
          I build interfaces that stay fast on a bad connection. Mostly product work: design
          systems, dashboards, marketing sites that do not fight the browser.
        </p>
      </section>

      <section class="flex flex-col gap-4">
        <h2 class="font-medium text-xl">Timeline</h2>
        <ul class="flex flex-col divide-y divide-base-300">
          {TIMELINE.map((entry) => (
            <li key={entry.year} class="flex flex-col gap-1 py-4 sm:flex-row sm:gap-6">
              <span class="w-32 shrink-0 text-base-content/50 text-sm">{entry.year}</span>
              <span class="text-base-content/80">{entry.body}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
