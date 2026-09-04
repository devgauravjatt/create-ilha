import { head } from "@ilha/router";
import * as Atom from "effect/unstable/reactivity/Atom";
import { atom } from "ilha";

interface Plan {
  name: string;
  monthly: number;
  blurb: string;
  features: string[];
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    blurb: "For side projects and prototypes.",
    features: ["1 project", "Community support", "Static deploys"],
    monthly: 0,
    name: "Hobby",
  },
  {
    blurb: "For teams shipping to production.",
    featured: true,
    features: ["Unlimited projects", "Server islands", "Priority support"],
    monthly: 24,
    name: "Pro",
  },
  {
    blurb: "For organizations with compliance needs.",
    features: ["SSO & audit logs", "Custom regions", "Dedicated support"],
    monthly: 96,
    name: "Enterprise",
  },
];

const YEARLY_DISCOUNT = 0.8;

export default function Pricing() {
  head({ title: "Pricing" });
  const yearly = atom(false);
  const period = atom(Atom.map(yearly.atom, (value) => (value ? "/mo billed yearly" : "/mo")));

  const priceFor = (plan: Plan) =>
    yearly() ? Math.round(plan.monthly * YEARLY_DISCOUNT) : plan.monthly;

  return (
    <div class="flex flex-col gap-8">
      <header class="flex flex-col items-center gap-3 text-center">
        <h1 class="font-semibold text-3xl">Simple pricing</h1>
        <p class="max-w-lg text-base-content/70">
          Start free. Upgrade when your islands need a server.
        </p>
        <label class="label cursor-pointer gap-3">
          <span class="label-text">Monthly</span>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            checked={yearly}
            onchange={() => yearly.update((value) => !value)}
          />
          <span class="label-text">Yearly (save 20%)</span>
        </label>
      </header>

      <div class="grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <article
            key={plan.name}
            class={
              plan.featured
                ? "card border-2 border-primary bg-base-100 shadow"
                : "card border border-base-300 bg-base-100"
            }
          >
            <div class="card-body gap-4">
              <div class="flex items-center justify-between">
                <h2 class="card-title">{plan.name}</h2>
                {plan.featured ? <span class="badge badge-primary">Popular</span> : null}
              </div>
              <p class="text-base-content/70">{plan.blurb}</p>
              <p class="font-semibold text-3xl">
                ${priceFor(plan)}
                <span class="ml-1 font-normal text-base text-base-content/60">{period}</span>
              </p>
              <ul class="flex flex-col gap-1 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <a
                href="/#waitlist"
                class={plan.featured ? "btn btn-primary" : "btn btn-outline"}
              >
                Choose {plan.name}
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
