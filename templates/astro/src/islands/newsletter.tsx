import { atom, batch } from "ilha";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Newsletter = ({ cta = "Subscribe" }: { cta?: string }) => {
  const email = atom("");
  const message = atom("");
  const done = atom(false);

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    if (!emailPattern.test(email().trim())) {
      message.set("That email address does not look right.");
      return;
    }
    // Replace with your own endpoint.
    batch(() => {
      message.set("");
      done.set(true);
    });
  };

  return done() ? (
    <p class="island island--done">Thanks — check your inbox.</p>
  ) : (
    <form class="island" onsubmit={submit}>
      <input
        type="email"
        name="email"
        placeholder="you@example.com"
        value={email}
        oninput={(event: Event) => {
          const target = event.currentTarget;
          if (target instanceof HTMLInputElement) {
            email.set(target.value);
          }
        }}
      />
      <button type="submit">{cta}</button>
      {message() ? <span class="island__error">{message}</span> : null}
    </form>
  );
};
