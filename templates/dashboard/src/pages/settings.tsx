import { head } from "@ilha/router";
import { atom, batch } from "ilha";

export default function Settings() {
  head({ title: "Settings" });

  const projectName = atom("Atlas");
  const notifications = atom(true);
  const region = atom("iad1");
  const saved = atom(false);

  const save = (event: SubmitEvent) => {
    event.preventDefault();
    // Persist however you like — this demo just flips a flag.
    saved.set(true);
  };

  const reset = () => {
    batch(() => {
      projectName.set("Atlas");
      notifications.set(true);
      region.set("iad1");
      saved.set(false);
    });
  };

  return (
    <>
      <header class="flex flex-col gap-1">
        <h1 class="font-semibold text-2xl">Settings</h1>
        <p class="text-base-content/60 text-sm">
          A form wired to atoms. `batch()` resets every field with one repaint.
        </p>
      </header>

      <form class="card border border-base-300 bg-base-100" onsubmit={save}>
        <div class="card-body gap-4">
          <label class="form-control w-full max-w-sm">
            <span class="label-text">Project name</span>
            <input
              class="input input-bordered"
              value={projectName}
              oninput={(event: Event) => {
                const target = event.currentTarget;
                if (target instanceof HTMLInputElement) {
                  projectName.set(target.value);
                  saved.set(false);
                }
              }}
            />
          </label>

          <label class="form-control w-full max-w-sm">
            <span class="label-text">Primary region</span>
            <select
              class="select select-bordered"
              value={region}
              onchange={(event: Event) => {
                const target = event.currentTarget;
                if (target instanceof HTMLSelectElement) {
                  region.set(target.value);
                  saved.set(false);
                }
              }}
            >
              <option value="iad1">iad1 — Washington</option>
              <option value="fra1">fra1 — Frankfurt</option>
              <option value="gru1">gru1 — São Paulo</option>
              <option value="syd1">syd1 — Sydney</option>
            </select>
          </label>

          <label class="label w-fit cursor-pointer gap-3">
            <input
              type="checkbox"
              class="toggle toggle-primary"
              checked={notifications}
              onchange={() => {
                notifications.update((value) => !value);
                saved.set(false);
              }}
            />
            <span class="label-text">Email me about incidents</span>
          </label>

          <div class="card-actions items-center gap-2">
            <button type="submit" class="btn btn-primary btn-sm">
              Save changes
            </button>
            <button type="button" class="btn btn-ghost btn-sm" onclick={reset}>
              Reset
            </button>
            {saved() ? <span class="text-success text-sm">Saved.</span> : null}
          </div>
        </div>
      </form>
    </>
  );
}
