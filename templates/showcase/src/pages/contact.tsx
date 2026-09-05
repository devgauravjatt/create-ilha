import { head } from "@ilha/router";
import { atom, batch } from "ilha";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  head({ title: "Contact" });

  const name = atom("");
  const email = atom("");
  const message = atom("");
  const error = atom("");
  const sent = atom(false);

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    if (name().trim().length === 0) {
      error.set("Please add your name.");
      return;
    }
    if (!emailPattern.test(email().trim())) {
      error.set("That email address does not look right.");
      return;
    }
    if (message().trim().length < 10) {
      error.set("Tell me a little more — at least 10 characters.");
      return;
    }
    // Point this at your own endpoint or form service.
    batch(() => {
      error.set("");
      sent.set(true);
    });
  };

  const bindInput =
    (target: { set: (value: string) => void }) =>
    (event: Event) => {
      const element = event.currentTarget;
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        target.set(element.value);
      }
    };

  return (
    <div class="flex flex-col gap-6">
      <header class="flex flex-col gap-2">
        <h1 class="font-semibold text-3xl tracking-tight">Contact</h1>
        <p class="text-base-content/70">
          Tell me about the project. I reply to everything within a couple of days.
        </p>
      </header>

      {sent() ? (
        <div class="alert alert-success">
          <span>Thanks — your message is on its way.</span>
        </div>
      ) : (
        // novalidate: the checks in submit() own the error messages.
        <form class="flex flex-col gap-4" novalidate onsubmit={submit}>
          <label class="form-control">
            <span class="label-text">Name</span>
            <input class="input input-bordered" value={name} oninput={bindInput(name)} />
          </label>
          <label class="form-control">
            <span class="label-text">Email</span>
            <input
              type="email"
              class="input input-bordered"
              value={email}
              oninput={bindInput(email)}
            />
          </label>
          <label class="form-control">
            <span class="label-text">Message</span>
            <textarea
              class="textarea textarea-bordered min-h-32"
              value={message}
              oninput={bindInput(message)}
            />
          </label>
          {error() ? <p class="text-error text-sm">{error}</p> : null}
          <button type="submit" class="btn btn-primary self-start">
            Send message
          </button>
        </form>
      )}
    </div>
  );
}
