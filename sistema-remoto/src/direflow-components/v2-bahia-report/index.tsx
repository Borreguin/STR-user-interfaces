import { DireflowComponent } from "direflow-component";
import BahiaReport from "./App";

export default DireflowComponent.create({
  component: BahiaReport,
  configuration: {
    tagname: "v2-bahia-report",
    useShadow: false,
  },
  plugins: [
    {
      name: "font-loader",
      options: {
        google: {
          families: ["Advent Pro", "Noto Sans JP"],
        },
      },
    },
  ],
});
