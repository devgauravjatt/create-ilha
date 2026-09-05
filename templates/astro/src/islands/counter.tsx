import { atom } from "ilha";

export interface CounterProps {
  start?: number;
  step?: number;
}

/**
 * A plain Ilha component. Astro renders it to HTML on the server and
 * `@ilha/astro/client` hydrates it when the client directive fires.
 */
export const Counter = ({ start = 0, step = 1 }: CounterProps) => {
  const count = atom(start);

  return (
    <div class="island">
      <button type="button" onclick={() => count.update((value) => value - step)}>
        −
      </button>
      <output>{count}</output>
      <button type="button" onclick={() => count.update((value) => value + step)}>
        +
      </button>
    </div>
  );
};
