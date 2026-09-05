/**
 * Server islands for one post. The render functions run on the server, so the
 * post bodies never reach the browser — the client gets HTML and a proxy that
 * can ask for a fresh frame.
 *
 * https://ilha.build/guide/routing/server-islands/
 */

import { head } from "@ilha/router";
import { findPost, formatDate, POSTS } from "./posts";

// JSX props arrive as a loose bag, so island props are optional with defaults.
export const PostList = function PostList() {
  return (
    <ul class="flex flex-col divide-y divide-base-300">
      {POSTS.map((post) => (
        <li key={post.slug} class="flex flex-col gap-1 py-5">
          <a class="font-medium text-xl hover:underline" href={`/posts/${post.slug}`}>
            {post.title}
          </a>
          <p class="text-base-content/70">{post.summary}</p>
          <p class="text-base-content/50 text-sm">
            {formatDate(post.date)} · {post.readingMinutes} min read · {post.author}
          </p>
        </li>
      ))}
    </ul>
  );
};

export const PostView = function PostView({ slug = "" }: { slug?: string }) {
  const post = findPost(slug);

  if (!post) {
    return (
      <section class="flex flex-col gap-3">
        <h1 class="font-semibold text-2xl">404</h1>
        <p class="text-base-content/70">No post at "{slug}".</p>
        <a class="link" href="/">
          Back to the posts
        </a>
      </section>
    );
  }

  head({
    meta: [{ content: post.summary, name: "description" }],
    title: post.title,
  });

  return (
    <article class="flex flex-col gap-6">
      <header class="flex flex-col gap-2">
        <h1 class="font-semibold text-3xl tracking-tight">{post.title}</h1>
        <p class="text-base-content/50 text-sm">
          {formatDate(post.date)} · {post.readingMinutes} min read · {post.author}
        </p>
      </header>

      <div class="flex flex-col gap-4 text-base-content/90 leading-relaxed">
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
};
