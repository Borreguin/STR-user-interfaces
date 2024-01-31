/**
 * In this file you can export components that will
 * be built as a pure React component library.
 *
 * Using the command `npm run build:lib` will
 * produce a folder `lib` with your React components.
 *
 * If you're not using a React component library,
 * this file can be safely deleted.
 */

import ZDireflowNavigate from "./direflow-components/zdireflow-navigate/App";
import ZDireflowTemplate from "./direflow-components/zdireflow-template/App";
import NodeManagement from "./direflow-components/v1-manejo-nodos/App";
import UTRandTagsManagement from "./direflow-components/v1-manejo-utr-tags/App";
import SRBackupFiles from "./direflow-components/v1-versionamiento-nodos/App";
import SRCalDisponibilidad from "./direflow-components/disponibilidad-reporte/App";
import ConsignacionesConsulta from "./direflow-components/v1-consignaciones-consulta/App";
import ConsignacionesIngreso from "./direflow-components/v1-consignaciones-ingreso/App";
import TendenciaDisponibilidadAdquisicion from "./direflow-components/tendencia-disponibilidad-adquisicion/App";
import ConverterV2 from "./direflow-components/v2-converter/App";
import NodeManagementV2 from "./direflow-components/v2-manejo-nodos/App";
import ConsignmentManagementV2 from "./direflow-components/v2-consignaciones-ingreso/App";
import ConsignmentsViewV2 from "./direflow-components/v2-consignaciones-consulta/App";

export {
  ZDireflowNavigate,
  ZDireflowTemplate,
  NodeManagement,
  UTRandTagsManagement,
  SRBackupFiles,
  SRCalDisponibilidad,
  ConsignacionesConsulta,
  ConsignacionesIngreso,
  TendenciaDisponibilidadAdquisicion,
  ConverterV2,
  NodeManagementV2,
  ConsignmentManagementV2,
  ConsignmentsViewV2,
};
