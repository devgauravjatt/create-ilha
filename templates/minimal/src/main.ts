import "./style.css";
import { mount } from "ilha";
import { App } from "./app.tsx";

const root = document.getElementById("app");

if (root) {
  mount(root, App);
}
