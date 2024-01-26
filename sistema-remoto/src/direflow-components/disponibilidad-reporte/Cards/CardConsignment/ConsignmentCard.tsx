import { Card } from "react-bootstrap";
import React from "react";
import { Consignment } from "../../../Common/GeneralTypes";
import { Styled } from "direflow-component";
import bootstrap from "bootstrap/dist/css/bootstrap.min.css";
import styles from "./style.css";
import ReactJson from "react-json-view";
import {
  lb_fecha_final,
  lb_fecha_inicio,
  lb_responsable,
  lb_tiempo_consignado_minutos,
} from "../../../Common/common-constants";

type ConsignmentCardProps = {
  consignment: Consignment;
};
export const ConsignmentCard = (props: ConsignmentCardProps) => {
  const { consignment } = props;

  const getName = () => {
    console.log("getName: ", consignment.detalle.element);
    if (consignment.detalle.element?.instalacion_nombre !== undefined)
      return `${consignment.detalle.element?.instalacion_tipo} ${consignment.detalle.element?.instalacion_nombre}`;
    if (consignment.detalle.element?.bahia_nombre !== undefined)
      return `${consignment.detalle.element?.voltaje} ${consignment.detalle.element?.bahia_nombre}`;
    if (consignment.detalle.element?.entidad_nombre !== undefined)
      return `${consignment.detalle.element?.entidad_tipo} ${consignment.detalle.element?.entidad_nombre}`;
    if (consignment.detalle.element?.nombre !== undefined)
      return `${consignment.detalle.element?.nombre} ${consignment.detalle.element?.nombre}`;
    return "";
  };

  const formatConsignment = () => {
    return {
      [lb_fecha_inicio]: consignment.fecha_inicio,
      [lb_fecha_final]: consignment.fecha_final,
      [lb_tiempo_consignado_minutos]: consignment.t_minutos,
      [lb_responsable]: consignment.responsable,
      [consignment.detalle.descripcion_corta]: consignment.detalle.detalle,
    };
  };

  return (
    <Styled styles={[bootstrap, styles]} scoped={false}>
      <Card className={"c-container"}>
        <Card.Header>
          {getName()} {"-"} {consignment.no_consignacion}
        </Card.Header>
        <Card.Body>
          <div className={"c-json-viewer"}>
            <ReactJson
              name={getName()}
              displayObjectSize={false}
              collapsed={false}
              iconStyle="circle"
              displayDataTypes={false}
              indentWidth={3}
              quotesOnKeys={false}
              src={formatConsignment()}
            />
          </div>
        </Card.Body>
      </Card>
    </Styled>
  );
};
