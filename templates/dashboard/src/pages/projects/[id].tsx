import { findProject, formatNumber, statusBadge } from "$lib/data";
import { error, head, useRoute } from "@ilha/router";

export default function ProjectDetail() {
  const { params } = useRoute();
  const id = params().id ?? "";
  const project = findProject(id);

  // Throws a RouteError caught by the nearest +error.tsx boundary.
  if (!project) {
    error(404, `No project named "${id}"`);
    return null;
  }

  head({ title: project.name });

  return (
    <>
      <nav class="breadcrumbs text-sm">
        <ul>
          <li>
            <a href="/projects">Projects</a>
          </li>
          <li>{project.name}</li>
        </ul>
      </nav>

      <header class="flex flex-wrap items-center gap-3">
        <h1 class="font-semibold text-2xl">{project.name}</h1>
        <span class={statusBadge(project.status)}>{project.status}</span>
      </header>

      <section class="stats stats-vertical border border-base-300 bg-base-100 sm:stats-horizontal">
        <div class="stat">
          <div class="stat-title">Requests (24h)</div>
          <div class="stat-value text-3xl">{formatNumber(project.requests)}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Error rate</div>
          <div class="stat-value text-3xl">{project.errorRate}%</div>
        </div>
        <div class="stat">
          <div class="stat-title">Region</div>
          <div class="stat-value text-3xl">{project.region}</div>
        </div>
      </section>

      <article class="card border border-base-300 bg-base-100">
        <div class="card-body gap-2">
          <h2 class="card-title text-lg">Next step</h2>
          <p class="text-base-content/70">
            This page reads from a local array. Fetch real data inside an async component, or move
            the query to the server with a{" "}
            <a
              class="link"
              href="https://ilha.build/guide/routing/server-islands/"
              target="_blank"
              rel="noreferrer"
            >
              server island
            </a>
            .
          </p>
          <p class="text-base-content/60 text-sm">Last updated {project.updatedAt}.</p>
        </div>
      </article>
    </>
  );
}
