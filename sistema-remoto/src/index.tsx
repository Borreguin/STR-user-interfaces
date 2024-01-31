/**
 * This is the entry file of the Direflow setup.
 *
 * You can add any additional functionality here.
 * For example, this is a good place to hook into your
 * Web Component once it's mounted on the DOM.
 *
 * !This file cannot be removed.
 * It can be left blank if not needed.
 */

import { Route, BrowserRouter as Router } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom";

// importando Componentes:
import {
  ZDireflowTemplate,
  NodeManagement,
  UTRandTagsManagement,
  SRBackupFiles,
  SRCalDisponibilidad,
  ConsignacionesConsulta,
  ConsignacionesIngreso,
  TendenciaDisponibilidadAdquisicion,
  ConsignmentManagementV2,
  ConsignmentsViewV2,
} from "./component-exports";
import TemplateComp from "./direflow-components/zdireflow-navigate";
import ConverterV2 from "./direflow-components/v2-converter/App";
import NodeManagementV2 from "./direflow-components/v2-manejo-nodos/App";
import { InstallationAndBahiasManagement } from "./direflow-components/v2-manejo-bahias/App";
import BahiaReport from "./direflow-components/v2-bahia-report/App";

export const routes = [
  { path: "/", component: ZDireflowTemplate, description: "Inicio" },
  {
    path: "/zdireflow-template",
    component: ZDireflowTemplate,
    description: "Plantilla",
  },
  {
    path: "/manejo-nodos",
    component: NodeManagement,
    description: "Manejo de nodos",
  },
  {
    path: "/manejo-utr-tags",
    component: UTRandTagsManagement,
    description: "Manejo de UTR y Tags",
  },
  {
    path: "/versionamiento-nodos",
    component: SRBackupFiles,
    description: "Versionamiento de Nodos",
  },
  {
    path: "/disponibilidad-reporte",
    component: SRCalDisponibilidad,
    description: "Reporte disponibilidad",
  },
  {
    path: "/consignaciones-ingreso",
    component: ConsignacionesIngreso,
    description: "Ingreso de consignaciones",
  },
  {
    path: "/consignaciones-consulta",
    component: ConsignacionesConsulta,
    description: "Consultar consignaciones",
  },
  {
    path: "/tendencia-disponibilidad-adquisicion",
    component: TendenciaDisponibilidadAdquisicion,
    description: "Tendencia de disponibilidad de adquisicion de datos",
  },
  { path: "/converterV2", component: ConverterV2, description: "ConverterV2" },
  {
    path: "/manejo-nodos-v2",
    component: NodeManagementV2,
    description: "Manejo de nodos V2",
  },
  {
    path: "/manejo-instalaciones",
    component: InstallationAndBahiasManagement,
    description: "Manejo de instalaciones V2",
  },
  {
    path: "/consignaciones-ingreso-v2",
    component: ConsignmentManagementV2,
    description: "Ingreso de consignaciones V2",
  },
  {
    path: "/bahia-report",
    component: BahiaReport,
    description: "Reporte de Bahias V2",
  },
  {
    path: "/consulta-consignaciones-v2",
    component: ConsignmentsViewV2,
    description: "Consulta de consignaciones V2",
  },
];

//<Route exact path="/icons" component={IconLibrary} />
const routing = (
  <Router>
    {routes.map((route, ix) => (
      <Route key={ix} exact path={route.path} component={route.component} />
    ))}
  </Router>
);

/*ReactDOM.render(
   <React.StrictMode>
     {routing}
   </React.StrictMode>,
   document.getElementById('root')
 );*/

TemplateComp.then(() => {
  //Access DOM node when it's mounted
  // console.log('sistema-remoto is mounted on the DOM', element);
  // console.log('root', document.getElementById('root'));
  ReactDOM.render(
    <React.StrictMode>{routing}</React.StrictMode>,
    document.getElementById("component"),
  );
});
