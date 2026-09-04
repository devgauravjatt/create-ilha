import { Button, Card, Counter } from "../src/index";

const LIBRARY_NAME = "{{projectName}}";

export const Gallery = () => (
  <main class="playground">
    <h1>{LIBRARY_NAME}</h1>
    <p class="playground__lede">
      A playground for the components in <code>src/</code>. It is not part of the published
      bundle.
    </p>

    <Card title="Button">
      <div class="playground__row">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button disabled>Disabled</Button>
      </div>
    </Card>

    <Card title="Counter" footer={<span>Local state via atom()</span>}>
      <Counter start={3} />
    </Card>

    <Card title="Custom element">
      <p class="playground__lede">
        The same component is registered as <code>&lt;ui-counter&gt;</code> in{" "}
        <code>src/elements.ts</code> — see the bottom of <code>index.html</code>.
      </p>
    </Card>
  </main>
);
