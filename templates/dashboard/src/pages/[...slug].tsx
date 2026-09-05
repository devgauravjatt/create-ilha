import { useRoute } from "@ilha/router";

export default function NotFound() {
  const { path } = useRoute();
  return (
    <div class="card border border-base-300 bg-base-100">
      <div class="card-body items-start gap-3">
        <span class="badge badge-ghost">404</span>
        <h1 class="card-title">Page not found</h1>
        <p class="text-base-content/70">
          No page matches <code>{path()}</code>.
        </p>
        <a href="/" class="btn btn-sm btn-primary">
          Back to overview
        </a>
      </div>
    </div>
  );
}
