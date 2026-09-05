import "../src/styles.css";
import "./playground.css";
import "../src/elements";
import { mount } from "ilha";
import { Gallery } from "./gallery";

const root = document.getElementById("app");

if (root) {
  mount(root, Gallery);
}
