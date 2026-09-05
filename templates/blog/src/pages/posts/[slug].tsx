import { PostView } from "$lib/posts.server";
import { ReactionButton } from "$lib/reactions.server";
import { head, useRoute } from "@ilha/router";

/**
 * A thin client page. Both children are server islands: the post body renders
 * on the server, and the reaction count streams from there too.
 */
export default function PostPage() {
  const { params } = useRoute();
  const slug = params().slug ?? "";

  head({ title: "Post" });

  return (
    <div class="flex flex-col gap-6">
      <nav class="text-sm">
        <a class="link link-hover" href="/">
          ← All posts
        </a>
      </nav>

      <PostView slug={slug} />

      <footer class="flex items-center gap-3 border-base-300 border-t pt-6">
        <ReactionButton slug={slug} />
        <span class="text-base-content/50 text-sm">Counts live on the server.</span>
      </footer>
    </div>
  );
}
