import { atom } from "ilha";
import { Button } from "./button";

export interface CounterProps {
  start?: number;
  step?: number;
  label?: string;
}

/**
 * A stateful component. `atom()` keeps the value; reading `{count}` in JSX
 * subscribes just that text node.
 */
export const Counter = ({ label = "Count", start = 0, step = 1 }: CounterProps) => {
  const count = atom(start);

  return (
    <div class="ui-counter">
      <Button variant="ghost" size="sm" onclick={() => count.update((value) => value - step)}>
        −
      </Button>
      <output class="ui-counter__value">
        {label}: {count}
      </output>
      <Button variant="ghost" size="sm" onclick={() => count.update((value) => value + step)}>
        +
      </Button>
    </div>
  );
};
