import { Entity, new_entity } from "./SRCardModel";
import * as _ from "lodash";
import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

export interface SREntityCardProps {
  entidades: Array<Entity>;
  onEntityChange: Function;
}

/*Generación de entidades */
export class EntityCards extends React.Component<SREntityCardProps> {
  state: {
    edited: false;
  };
  bck_entities: Array<Entity>;
  //lcl_entities : Array<Entity>;
  constructor(props) {
    super(props);
    this.state = {
      edited: false,
    };
    //this.lcl_entities = _.cloneDeep(props.entidades);
    this.bck_entities = _.cloneDeep(props.entidades);
  }

  is_edited = () => {
    if (_.isEqual(this.bck_entities, this.props.entidades)) {
      this.setState({ edited: false });
    } else {
      this.setState({ edited: true });
    }
  };
  // funcion que llama a funcion de parametro onEntityChange
  // ligada al padre
  handle_entity_change = (new_entities) => {
    this.props.onEntityChange(new_entities);
  };

  _eliminar_entidad = async (id: string) => {
    let new_ents = [];
    this.props.entidades.forEach((entidad) => {
      if (entidad.id_entidad !== id) {
        new_ents.push(entidad);
      }
    });
    this.is_edited();
    this.handle_entity_change(new_ents);
  };
  _add_entidad = () => {
    let e = new_entity();
    console.log(e);
    let new_ents = [e].concat(this.props.entidades);
    this.is_edited();
    this.handle_entity_change(new_ents);
  };
  _update_entidad_activado = (ix: number) => {
    this.props.entidades[ix].activado = !this.props.entidades[ix].activado;
    this.is_edited();
    this.handle_entity_change(this.props.entidades);
  };
  _update_entidad_nombre = (p, ix: number, trim: boolean) => {
    if (trim) {
      this.setState({ edited: true });
      this.props.entidades[ix].entidad_nombre = p.target.value.trim();
    } else {
      this.props.entidades[ix].entidad_nombre = p.target.value;
    }
    this.is_edited();
    this.handle_entity_change(this.props.entidades);
  };
  _update_entidad_tipo = (p, ix: number, trim: boolean) => {
    if (trim) {
      this.setState({ edited: true });
      this.props.entidades[ix].entidad_tipo = p.target.value.trim();
    } else {
      this.props.entidades[ix].entidad_tipo = p.target.value;
    }
    this.is_edited();
    this.handle_entity_change(this.props.entidades);
  };

  render() {
    return (
      <>
        <Button
          variant="outline-light"
          className="src-btn-plus"
          onClick={this._add_entidad}
        >
          <FontAwesomeIcon inverse icon={faPlusCircle} size="lg" />
        </Button>
        {this.props.entidades.map((entidad, ix) => (
          <div key={entidad.id_entidad}>
            <div className="src-port-block">
              <Button
                className="src-btn-delete"
                onClick={() => this._eliminar_entidad(entidad.id_entidad)}
              >
                <FontAwesomeIcon icon={faTrash} size="1x" />
              </Button>
              <input
                className="src-input-entity"
                value={entidad.entidad_tipo}
                onChange={(p) => this._update_entidad_tipo(p, ix, false)}
                onBlur={(p) => this._update_entidad_tipo(p, ix, true)}
                onMouseLeave={this.is_edited}
              ></input>
              <input
                className="src-input-entity"
                value={entidad.entidad_nombre}
                onChange={(p) => this._update_entidad_nombre(p, ix, false)}
                onBlur={(p) => this._update_entidad_nombre(p, ix, true)}
                onMouseLeave={this.is_edited}
              ></input>
              <div className="src-port-connect">
                <span className="badge badge-warning">{entidad.n_utrs} utrs</span>
                <span className="badge badge-info">{entidad.n_tags} tags</span>
                <input
                  type="checkbox"
                  className="chk-entity"
                  checked={entidad.activado}
                  onChange={() => this._update_entidad_activado(ix)}
                ></input>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }
}
