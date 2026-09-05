/**
 * Post content. This module is imported by server pages, so the bodies never
 * ship to the browser — swap it for a database, a CMS or a Markdown loader.
 */

export interface Post {
  slug: string;
  title: string;
  summary: string;
  date: string;
  author: string;
  readingMinutes: number;
  body: string[];
}

export const POSTS: Post[] = [
  {
    author: "Ana",
    body: [
      "The post list and this body are server islands: they live in *.server.tsx modules, so their render functions never reach the browser.",
      "That means the post body, the author's notes and any database query stay on the server. The client receives HTML and a small proxy that can ask for a fresh frame.",
      "Interactive bits stay islands too. The reaction button below runs its action on the server and streams the new count back to every reader.",
    ],
    date: "2026-02-14",
    readingMinutes: 4,
    slug: "hello-server-pages",
    summary: "What renders on the server, and what still ships to the browser.",
    title: "Hello, server pages",
  },
  {
    author: "Kai",
    body: [
      "A server island is a component whose render function runs on the server, on demand.",
      "The plugin swaps the module for a client proxy. The proxy posts to /__ilha/frame, morphs the returned HTML into place and reconnects the event handlers.",
      "Because the transport is a stream, every yield from the server repaints the island — no polling loop in your page code.",
    ],
    date: "2026-02-02",
    readingMinutes: 6,
    slug: "server-islands-in-practice",
    summary: "Actions, streams and frames — the moving parts behind an island that lives on the server.",
    title: "Server islands in practice",
  },
  {
    author: "Sam",
    body: [
      "Content sites do not need a client-side data layer. Fetch inside the page, render HTML, and let islands own the few interactive corners.",
      "This template keeps the post list and post bodies on the server and hydrates only the reaction island.",
      "The result is a small bundle that stays small as the content grows.",
    ],
    date: "2026-01-21",
    readingMinutes: 3,
    slug: "less-javascript",
    summary: "Ship HTML for content, and JavaScript only where a reader can click.",
    title: "Less JavaScript, more content",
  },
];

export const findPost = (slug: string): Post | undefined =>
  POSTS.find((post) => post.slug === slug);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
