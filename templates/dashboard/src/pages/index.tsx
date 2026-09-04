import { ACTIVITY, formatNumber, PROJECTS, statusBadge } from "$lib/data";
import { head } from "@ilha/router";
import * as Atom from "effect/unstable/reactivity/Atom";
import { atom } from "ilha";

const RANGES = [
  { days: 1, label: "24h" },
  { days: 7, label: "7d" },
  { days: 30, label: "30d" },
];

export default function Overview() {
  head({ title: "Overview" });

  const rangeDays = atom(7);
  // Derived atoms recompute when `rangeDays` changes — no effects to wire up.
  const totalRequests = atom(
    Atom.map(rangeDays.atom, (days) =>
      formatNumber(PROJECTS.reduce((total, project) => total + project.requests * days, 0))
    )
  );
  const errorRate = atom(
    Atom.map(rangeDays.atom, () => {
      const active = PROJECTS.filter((project) => project.status !== "paused");
      const sum = active.reduce((total, project) => total + project.errorRate, 0);
      return active.length === 0 ? "0.00" : (sum / active.length).toFixed(2);
    })
  );

  return (
    <>
      <header class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="font-semibold text-2xl">Overview</h1>
          <p class="text-base-content/60 text-sm">Everything across your projects.</p>
        </div>
        <div class="join">
          {RANGES.map((range) => (
            <button
              key={range.label}
              type="button"
              class={
                rangeDays() === range.days
                  ? "btn btn-sm join-item btn-active"
                  : "btn btn-sm join-item"
              }
              onclick={() => rangeDays.set(range.days)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </header>

      <section class="stats stats-vertical border border-base-300 bg-base-100 sm:stats-horizontal">
        <div class="stat">
          <div class="stat-title">Requests</div>
          <div class="stat-value text-3xl">{totalRequests}</div>
          <div class="stat-desc">across {PROJECTS.length} projects</div>
        </div>
        <div class="stat">
          <div class="stat-title">Error rate</div>
          <div class="stat-value text-3xl">{errorRate}%</div>
          <div class="stat-desc">average of active projects</div>
        </div>
        <div class="stat">
          <div class="stat-title">Healthy</div>
          <div class="stat-value text-3xl">
            {PROJECTS.filter((project) => project.status === "healthy").length}
          </div>
          <div class="stat-desc">of {PROJECTS.length} projects</div>
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-2">
        <article class="card border border-base-300 bg-base-100">
          <div class="card-body gap-3">
            <h2 class="card-title text-lg">Projects</h2>
            <ul class="flex flex-col divide-y divide-base-300">
              {PROJECTS.map((project) => (
                <li key={project.id} class="flex items-center justify-between gap-2 py-2">
                  <a class="link link-hover font-medium" href={`/projects/${project.id}`}>
                    {project.name}
                  </a>
                  <span class={statusBadge(project.status)}>{project.status}</span>
                </li>
              ))}
            </ul>
            <a href="/projects" class="btn btn-sm btn-ghost self-start">
              View all
            </a>
          </div>
        </article>

        <article class="card border border-base-300 bg-base-100">
          <div class="card-body gap-3">
            <h2 class="card-title text-lg">Recent activity</h2>
            <ul class="flex flex-col gap-3 text-sm">
              {ACTIVITY.map((entry) => (
                <li key={entry.action} class="flex items-start gap-3">
                  <span class="badge badge-neutral badge-sm">{entry.actor}</span>
                  <span class="flex-1">{entry.action}</span>
                  <span class="text-base-content/50">{entry.at}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>
    </>
  );
}
