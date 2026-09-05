import { useRoute } from "@ilha/router";

export default function NotFound() {
  const { path } = useRoute();
  return (
    <section class="flex flex-col gap-3">
      <h1 class="font-semibold text-2xl">404</h1>
      <p class="text-base-content/70">
        No page found for <code>{path()}</code>.
      </p>
      <a class="link" href="/">
        Back to the posts
      </a>
    </section>
  );
}
