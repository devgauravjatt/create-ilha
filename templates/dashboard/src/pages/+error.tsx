import type { AppError } from "@ilha/router";

// Error boundaries are called as `handler(error, route)` — the error arrives as
// the first argument, not inside a props object.
export default function ErrorPage(error: AppError) {
  return (
    <div class="card border border-base-300 bg-base-100">
      <div class="card-body items-start gap-3">
        <span class="badge badge-error">{error.status ?? 500}</span>
        <h1 class="card-title">Something went wrong</h1>
        <p class="text-base-content/70">{error.message}</p>
        <a href="/" class="btn btn-sm btn-primary">
          Back to overview
        </a>
      </div>
    </div>
  );
}
