import {
  LinkModel,
  PortModel,
  DefaultLinkModel,
  PortModelAlignment,
} from "@projectstorm/react-diagrams";
import * as _ from "lodash";
import { canLinkToInportPort } from "../_common/common_functions";

export class InPortModel extends PortModel {
  constructor(name: string) {
    super({
      type: "InPort",
      name: name,
      alignment: PortModelAlignment.LEFT,
      connected_to: name,
    });
  }

  canLinkToPort(port: PortModel) {
    // función común para todos para nodos:
    return canLinkToInportPort(port);
  }

  createLinkModel(): LinkModel {
    return new DefaultLinkModel();
  }

  serialize() {
    // const position = this.position;
    /*return _.merge(super.serialize(),
			{nx: this.position.x, ny: this}
		)*/
    return _.merge({ port: this });
  }
}
