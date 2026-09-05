import { head } from "@ilha/router";
import { atom } from "ilha";

const FEATURES = [
  {
    body: "Ship HTML first, hydrate only the parts that need to be interactive.",
    title: "Islands by default",
  },
  {
    body: "atom() for local state, Effect Streams when data arrives over time.",
    title: "Reactive without a VDOM",
  },
  {
    body: "File-system routes, layouts and error boundaries out of the box.",
    title: "Routing included",
  },
  {
    body: "Move a component to the server by renaming it to *.server.tsx.",
    title: "Server islands",
  },
];

const LOGOS = ["Northwind", "Acme", "Globex", "Initech", "Umbrella"];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Waitlist() {
  const email = atom("");
  const status = atom<"idle" | "invalid" | "joined">("idle");

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    const value = email().trim();
    if (!emailPattern.test(value)) {
      status.set("invalid");
      return;
    }
    // Swap this for your own API call, e.g. fetch("/api/waitlist", ...).
    status.set("joined");
  };

  return (
    <div id="waitlist" class="card border border-base-300 bg-base-200/40">
      <div class="card-body items-center gap-4 text-center">
        <h2 class="card-title text-2xl">Join the waitlist</h2>
        <p class="max-w-md text-base-content/70">
          No spam. We send one email when the beta opens.
        </p>
        {/* novalidate: the check below owns the error message, not the browser. */}
        <form
          class="flex w-full max-w-md flex-col gap-2 sm:flex-row"
          novalidate
          onsubmit={submit}
        >
          <input
            type="email"
            name="email"
            class="input input-bordered w-full"
            placeholder="you@company.com"
            value={email}
            oninput={(event: Event) => {
              const target = event.currentTarget;
              if (target instanceof HTMLInputElement) {
                email.set(target.value);
              }
            }}
          />
          <button type="submit" class="btn btn-primary">
            Request access
          </button>
        </form>
        {status() === "invalid" ? (
          <p class="text-error text-sm">That email address does not look right.</p>
        ) : null}
        {status() === "joined" ? (
          <p class="text-success text-sm">You are on the list. Talk soon!</p>
        ) : null}
      </div>
    </div>
  );
}

export default function Home() {
  head({ title: "Home" });

  return (
    <div class="flex flex-col gap-16">
      <section class="flex flex-col items-center gap-6 py-10 text-center">
        <span class="badge badge-outline">Now in private beta</span>
        <h1 class="max-w-2xl text-balance font-semibold text-4xl leading-tight sm:text-5xl">
          The fastest way to ship an interactive site
        </h1>
        <p class="max-w-xl text-base-content/70 text-lg">
          A landing page built with Ilha islands. Static HTML where it can be, interactive where
          it counts.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-2">
          <a href="#waitlist" class="btn btn-primary">
            Get early access
          </a>
          <a href="/pricing" class="btn btn-ghost">
            See pricing
          </a>
        </div>
      </section>

      <section class="flex flex-wrap items-center justify-center gap-6 opacity-60">
        {LOGOS.map((logo) => (
          <span key={logo} class="font-medium text-sm tracking-widest uppercase">
            {logo}
          </span>
        ))}
      </section>

      <section class="grid gap-4 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <article key={feature.title} class="card border border-base-300 bg-base-100">
            <div class="card-body">
              <h3 class="card-title text-lg">{feature.title}</h3>
              <p class="text-base-content/70">{feature.body}</p>
            </div>
          </article>
        ))}
      </section>

      <Waitlist />
    </div>
  );
}
