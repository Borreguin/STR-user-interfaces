import {
  LinkModel,
  PortModel,
  DefaultLinkModel,
  PortModelAlignment,
} from "@projectstorm/react-diagrams";
import * as _ from "lodash";

export class ParallelOutPortModel extends PortModel {
  constructor(name: string) {
    super({
      type: "PARALELO",
      name: name,
      alignment: PortModelAlignment.RIGHT,
      connected_to: name,
    });
  }

  canLinkToPort(port: PortModel) {
    // Esta función comprueba si se puede realizar las conexiones:
    // 1. PARALELO -> InPort
    const isInPort = port.getType() === "InPort";
    const isFreeConnect = Object.keys(port.links).length === 0;
    const connect = isFreeConnect && isInPort;
    return connect;
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
