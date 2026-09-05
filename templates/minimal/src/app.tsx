import * as Atom from "effect/unstable/reactivity/Atom";
import { atom } from "ilha";

const APP_NAME = "{{projectName}}";
const STEP = 1;

export const App = () => {
  const count = atom(0);
  // Derived state: pass the underlying Effect atom, wrap the result in atom().
  const doubled = atom(Atom.map(count.atom, (value) => value * 2));

  return (
    <main class="page">
      <h1>{APP_NAME}</h1>
      <p class="lede">
        A single island, mounted with <code>mount()</code>. No router, no build-time magic.
      </p>

      <div class="card">
        <button type="button" onclick={() => count.update((value) => value - STEP)}>
          −
        </button>
        <output>{count}</output>
        <button type="button" onclick={() => count.update((value) => value + STEP)}>
          +
        </button>
      </div>

      <p class="hint">
        Doubled: <strong>{doubled}</strong>
      </p>

      <p class="hint">
        Edit <code>src/app.tsx</code> and save to see it update. Add pages with{" "}
        <a href="https://ilha.build/guide/routing/overview/">@ilha/router</a>.
      </p>
    </main>
  );
};
