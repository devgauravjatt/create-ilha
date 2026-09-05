/**
 * A server island: the reaction counts live on the server, mutations run there
 * too, and each change streams back to every reader.
 *
 * https://ilha.build/guide/routing/server-islands/
 */

import * as Effect from "effect/Effect";
import * as PubSub from "effect/PubSub";
import * as Stream from "effect/Stream";
import { action } from "oxidejs";

export type Reactions = Record<string, number>;

// Swap this for your database. It is process state, so it resets on restart.
const reactions: Reactions = {};

const hub = Effect.runSync(PubSub.unbounded<Reactions>({ replay: 1 }));
const snapshot = (): Reactions => ({ ...reactions });
const notify = () => Effect.runSync(PubSub.publish(hub, snapshot()));
notify();

// SAFETY: async-iterable rejection values have no schema; normalize to Error.
const asStreamError = <T,>(error: T): Error =>
  error instanceof Error ? error : new Error(String(error));

export const getReactions = action(async function* getReactions() {
  yield* Stream.toAsyncIterable(Stream.fromPubSub(hub));
});

export const addReaction = action((slug: string) => {
  if (!slug) {
    return;
  }
  reactions[slug] = (reactions[slug] ?? 0) + 1;
  notify();
});

// JSX props arrive as a loose bag, so island props are optional with defaults.
export const ReactionButton = function ReactionButton({ slug = "" }: { slug?: string }) {
  // Keep fromAsyncIterable(getReactions()) in the island body so the
  // server-island scanner can wire the stream transport.
  return Stream.map(
    Stream.fromAsyncIterable(getReactions(), asStreamError),
    (counts: Reactions) => (
      <button type="button" class="btn btn-sm btn-outline gap-2" onclick={addReaction.with(slug)}>
        <span aria-hidden="true">♥</span>
        <span>Appreciate</span>
        <span class="badge badge-sm">{counts[slug] ?? 0}</span>
      </button>
    )
  );
};
