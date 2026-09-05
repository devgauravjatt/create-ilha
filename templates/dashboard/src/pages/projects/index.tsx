import { formatNumber, PROJECTS, type ProjectStatus, statusBadge } from "$lib/data";
import { head } from "@ilha/router";
import { atom } from "ilha";

const FILTERS: { label: string; value: ProjectStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Healthy", value: "healthy" },
  { label: "Degraded", value: "degraded" },
  { label: "Paused", value: "paused" },
];

export default function Projects() {
  head({ title: "Projects" });

  const query = atom("");
  const filter = atom<ProjectStatus | "all">("all");

  const visible = () => {
    const needle = query().trim().toLowerCase();
    const status = filter();
    return PROJECTS.filter((project) => {
      const matchesStatus = status === "all" || project.status === status;
      const matchesQuery = needle === "" || project.name.toLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });
  };

  return (
    <>
      <header class="flex flex-col gap-1">
        <h1 class="font-semibold text-2xl">Projects</h1>
        <p class="text-base-content/60 text-sm">Search and filter run entirely on the client.</p>
      </header>

      <div class="flex flex-wrap items-center gap-2">
        <input
          class="input input-bordered input-sm w-full sm:w-64"
          placeholder="Search projects"
          value={query}
          oninput={(event: Event) => {
            const target = event.currentTarget;
            if (target instanceof HTMLInputElement) {
              query.set(target.value);
            }
          }}
        />
        <div class="join">
          {FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              class={
                filter() === option.value
                  ? "btn btn-sm join-item btn-active"
                  : "btn btn-sm join-item"
              }
              onclick={() => filter.set(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div class="overflow-x-auto rounded-box border border-base-300 bg-base-100">
        <table class="table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th class="text-right">Requests</th>
              <th>Region</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {visible().map((project) => (
              <tr key={project.id}>
                <td>
                  <a class="link link-hover font-medium" href={`/projects/${project.id}`}>
                    {project.name}
                  </a>
                </td>
                <td>
                  <span class={statusBadge(project.status)}>{project.status}</span>
                </td>
                <td class="text-right tabular-nums">{formatNumber(project.requests)}</td>
                <td>{project.region}</td>
                <td class="text-base-content/60">{project.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible().length === 0 ? (
        <p class="text-base-content/60 text-sm">No project matches that filter.</p>
      ) : null}
    </>
  );
}
