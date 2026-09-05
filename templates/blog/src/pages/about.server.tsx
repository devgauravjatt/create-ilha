import { head } from "@ilha/router";

// A whole route on the server: `about.server.tsx` serves `/about`, and its
// render function stays out of the client bundle.
export default function About() {
  head({ title: "About" });

  return (
    <div class="flex flex-col gap-4">
      <h1 class="font-semibold text-3xl tracking-tight">About</h1>
      <p class="text-base-content/80 leading-relaxed">
        This page is a <em>server page</em>: the file is named <code>about.server.tsx</code>, so
        the client mounts a proxy and pulls the rendered HTML from the server instead of running
        this component.
      </p>
      <p class="text-base-content/80 leading-relaxed">
        The home page and the post pages are ordinary client pages that host server islands. Mixing
        the two is the point: render on the server when a page needs data or secrecy, and keep the
        rest on the client.
      </p>
      <a
        class="link"
        href="https://ilha.build/guide/routing/server-islands/"
        target="_blank"
        rel="noreferrer"
      >
        Read the server islands guide →
      </a>
    </div>
  );
}
