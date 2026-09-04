import { ALL_TAGS, PROJECTS } from "$lib/projects";
import { head } from "@ilha/router";
import { atom } from "ilha";

export default function Work() {
  head({ title: "Work" });

  const activeTag = atom("all");

  const visible = () => {
    const tag = activeTag();
    return tag === "all" ? PROJECTS : PROJECTS.filter((project) => project.tags.includes(tag));
  };

  return (
    <div class="flex flex-col gap-10">
      <section class="flex flex-col gap-4">
        <h1 class="text-balance font-semibold text-3xl leading-tight sm:text-4xl">
          I design and build fast, quiet interfaces.
        </h1>
        <p class="max-w-xl text-base-content/70 text-lg">
          Selected work from the last few years. Everything here ships as little JavaScript as it
          can get away with.
        </p>
      </section>

      <section class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class={activeTag() === "all" ? "btn btn-xs btn-active" : "btn btn-xs btn-ghost"}
            onclick={() => activeTag.set("all")}
          >
            All
          </button>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              class={activeTag() === tag ? "btn btn-xs btn-active" : "btn btn-xs btn-ghost"}
              onclick={() => activeTag.set(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          {visible().map((project) => (
            <article key={project.id} class="card border border-base-300 bg-base-100">
              <div class="card-body gap-2">
                <div class="flex items-baseline justify-between gap-2">
                  <h2 class="card-title text-lg">{project.title}</h2>
                  <span class="text-base-content/50 text-sm">{project.year}</span>
                </div>
                <p class="text-base-content/70">{project.summary}</p>
                <div class="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <span key={tag} class="badge badge-ghost badge-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  class="link link-hover mt-2 font-medium text-sm"
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
