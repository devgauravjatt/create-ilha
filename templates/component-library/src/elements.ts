/**
 * Optional entry: register the components as custom elements so plain HTML can
 * instantiate them without a `mount()` call site.
 *
 * https://ilha.build/guide/ui/custom-elements/
 */

import { define } from "ilha/define";
import { Counter } from "./components/counter";

// define() mounts a component that takes no props — close over the
// defaults you want the element to render with.
define("ui-counter", () => Counter({}));

export { Counter };
