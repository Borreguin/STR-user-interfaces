import * as _ from "lodash";
import { PortModel, DefaultLinkModel, DefaultPortModel } from "@projectstorm/react-diagrams-core";

export class NextPortModel extends PortModel {
    constructor(isNext, name, label, id){
        super(name, "Next", id);
        this.next = isNext;
        this.label = label || name;
    }

    deSerialize(object, engine) {
        super.deSerialize(object, engine);
        this.next = object.next;
        this.label = object.label;
    }

    serialize() {
        return _.merge(super.serialize(), {
            next: this.next,
            label: this.label
        });
    }

    link(port) {
        let link = this.createLinkModel();
        link.setSourcePort(this);
        link.setTargetPort(port);
        return link;
    }

    canLinkToPort(port) {
        if (port instanceof DefaultPortModel) {
            return this.next === port.in;
        }
        return true;
    }

    createLinkModel() {
        let link = super.createLinkModel();
        return link || new DefaultLinkModel();
    }
}
