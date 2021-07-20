import { DireflowComponent } from "direflow-component";
import App from "./App";

const direflowProperties = {
  root_public_id: "no_definida_aún",
};

export default DireflowComponent.create({
  component: App,
  configuration: {
    tagname: "interface-calculo",
    useShadow: false,
  },
  properties: direflowProperties,
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
