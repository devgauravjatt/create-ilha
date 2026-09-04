import type { View } from "ilha";

export interface CardProps {
  title?: string;
  footer?: View;
  children?: View;
}

export const Card = ({ children, footer, title }: CardProps) => (
  <section class="ui-card">
    {title ? <h3 class="ui-card__title">{title}</h3> : null}
    <div class="ui-card__body">{children}</div>
    {footer ? <div class="ui-card__footer">{footer}</div> : null}
  </section>
);
