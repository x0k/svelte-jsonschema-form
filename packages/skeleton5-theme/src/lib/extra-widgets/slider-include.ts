import { definitions } from "../definitions.js";
import Slider from "./slider.svelte";
import "./slider.svelte";

declare module "../definitions.js" {
  interface ExtraWidgets {
    skeleton5SliderWidget: {};
  }
}

definitions.skeleton5SliderWidget = Slider;
