import type { AppError } from "@ilha/router";

// Error boundaries are called as `handler(error, route)` — the error arrives as
// the first argument, not inside a props object.
export default function ErrorPage(error: AppError) {
  return (
    <section class="flex flex-col gap-3">
      <h1 class="font-semibold text-2xl">{error.status ?? 500}</h1>
      <p class="text-base-content/70">{error.message}</p>
      <a class="link" href="/">
        Back to the posts
      </a>
    </section>
  );
}
