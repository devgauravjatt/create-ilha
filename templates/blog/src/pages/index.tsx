import { PostList } from "$lib/posts.server";
import { head } from "@ilha/router";

/**
 * A thin client page. The list itself is a server island, so post data never
 * reaches the browser: https://ilha.build/guide/routing/server-islands/
 */
export default function Index() {
  head({ title: "Posts" });

  return (
    <div class="flex flex-col gap-8">
      <header class="flex flex-col gap-2">
        <h1 class="font-semibold text-3xl tracking-tight">Writing</h1>
        <p class="text-base-content/70">
          Notes on building with islands. Rendered on the server, hydrated only where you can
          click.
        </p>
      </header>

      <PostList />
    </div>
  );
}
