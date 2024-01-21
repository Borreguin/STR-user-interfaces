import { Button, Form, Spinner } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import { getAllNodeInfo, getEntityInfoById } from "../FetchData/V2SRFetchData";
import { msgUpdateNodes } from "../FetchData/constantes";
import { TypeAndNameOptions, TypeNameSelector } from "./TypeNameSelector";
import { SelectOption } from "./model";
import { v2Entity, v2Installation, v2Node } from "../V2GeneralTypes";
import { getOptions } from "./utils";

const renderLoading = (msg: string) => {
  return (
    <div>
      <br></br>
      <Spinner animation="border" role="status" size="sm" />
      <span> {msg}</span>
    </div>
  );
};

const renderUpdateButton = (onClickUpdate: () => void) => {
  return (
    <div className="update_label">
      <Button
        data-tip={"Actualiza todos los campos"}
        onClick={() => {
          onClickUpdate();
        }}
        variant="outline-success"
        size="sm"
        className="btn-actualizar"
      >
        Actualizar
      </Button>
      <ReactTooltip />
    </div>
  );
};

interface V2SRNodesFilterProps {
  onFinalChange: Function;
  toReload: boolean;
  onFinishReload: Function;
}

const V2SRNodesFilterComponent = (props: V2SRNodesFilterProps) => {
  const { onFinalChange, toReload, onFinishReload } = props;
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(msgUpdateNodes);
  // Node Management
  const [nodes, setNodes] = useState<Array<v2Node>>([]);
  const [selectedNode, setSelectedNode] = useState<v2Node>(undefined);
  const [nodeOptions, setNodeOptions] = useState<TypeAndNameOptions>(undefined);

  // Entity Management
  const [entities, setEntities] = useState<Array<v2Entity>>([]);
  const [selectedEntity, setSelectedEntity] = useState<v2Entity>(undefined);
  const [entityOptions, setEntityOptions] =
    useState<TypeAndNameOptions>(undefined);

  // Installation Management
  const [installations, setInstallations] = useState<Array<v2Installation>>([]);
  const [installationOptions, setInstallationOptions] =
    useState<TypeAndNameOptions>(undefined);

  const [lastSelectedNode, setLastSelectedNode] = useState<v2Node>(undefined);
  const [lastSelectedEntity, setLastSelectedEntity] =
    useState<v2Entity>(undefined);
  const [lastNodeTypeAndName, setLastNodeTypeAndName] = useState(undefined);
  const [lastEntityTypeAndName, setLastEntityTypeAndName] = useState(undefined);
  const [lastInstallationTypeAndName, setLastInstallationTypeAndName] =
    useState(undefined);

  useEffect(() => {
    const iniData = () => {
      setLoading(true);
      getAllNodeInfo().then((response) => {
        const _nodes = response.nodos;
        _nodes.sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
        setNodes(_nodes);
        setMsg(response.success ? "" : response.msg);
        setLoading(false);
      });
    };
    iniData();
  }, []);

  useEffect(() => {
    if (nodes.length === 0) {
      setSelectedNode(undefined);
      return;
    }
    if (lastSelectedNode !== undefined && lastSelectedEntity !== undefined) {
      setLastValues();
    } else {
      setDefaultValues();
    }
  }, [nodes]);

  useEffect(() => {
    if (toReload) {
      onUpdateRequest();
    } else {
      setLastValues();
    }
  }, [toReload]);

  const setDefaultValues = () => {
    setSelectedNode(nodes[0]);
    setNodeOptions(getNodeOptions(nodes));
  };

  const setLastValues = () => {
    const _node = nodes.find((n) => n._id === lastSelectedNode._id);
    if (_node === undefined) {
      setDefaultValues();
      return;
    }
    setNodeOptions(getNodeOptions(nodes));
    setSelectedNode(_node);
    const _entity = _node.entidades.find(
      (e) => e.id_entidad === lastSelectedEntity.id_entidad,
    );
    if (_entity !== undefined) {
      setSelectedEntity(_entity);
    } else {
      setDefaultValues();
    }
    return;
  };

  const onUpdateRequest = () => {
    setLastSelectedNode(selectedNode);
    setLastSelectedEntity(selectedEntity);
    setLoading(true);
    setMsg(msgUpdateNodes);
    getAllNodeInfo().then((response) => {
      setNodes(response.nodos);
      setMsg(response.success ? "" : response.msg);
      setLoading(false);
      onFinishReload();
    });
  };

  const getNodeOptions = (nodes: Array<v2Node>): TypeAndNameOptions => {
    return getOptions(nodes, "tipo", "nombre", "_id");
  };

  const getEntityOptions = (entities: Array<v2Entity>): TypeAndNameOptions => {
    return getOptions(entities, "entidad_tipo", "entidad_nombre", "id_entidad");
  };

  const getInstallationOptions = (
    installations: Array<v2Installation>,
  ): TypeAndNameOptions => {
    return getOptions(
      installations,
      "instalacion_tipo",
      "instalacion_nombre",
      "instalacion_id",
    );
  };

  const onSelectionNode = (nodeNameOption: SelectOption) => {
    const node = nodes.find((n) => n._id === nodeNameOption.id);
    setLastSelectedNode(selectedNode);
    setSelectedNode(node);
    if (node.entidades.length === 0) {
      setEntityOptions({ typeOptions: [], nameOptionsByType: {} });
      setInstallationOptions({ typeOptions: [], nameOptionsByType: {} });
      setEntities(undefined);
      setSelectedEntity(undefined);
    } else {
      setEntities(node.entidades);
      setEntityOptions(getEntityOptions(node.entidades));
    }
  };

  const onSelectionEntity = (entityNameOption: SelectOption) => {
    const entity = entities.find((n) => n.id_entidad === entityNameOption.id);
    if (entity === undefined) {
      return;
    }
    getEntityInfoById(entity.id_entidad).then((response) => {
      if (response?.entidad) {
        setSelectedEntity(response.entidad);
        const _installations = response.entidad.instalaciones;
        _installations.sort((a, b) =>
          a.instalacion_nombre > b.instalacion_nombre ? 1 : -1,
        );
        const options = getInstallationOptions(_installations);
        setInstallationOptions(options);
        setInstallations(_installations);
      }
    });
  };

  const onSelectionInstallation = (installationNameOption: SelectOption) => {
    const installation = installations.find(
      (n) => n.instalacion_id === installationNameOption.id,
    );
    onFinalChange({
      selectedNode,
      selectedEntity,
      selectedInstallation: installation,
    });
  };

  if (loading) {
    return renderLoading(msg);
  }

  return (
    <Form className="tab-container">
      {renderUpdateButton(() => {
        onUpdateRequest();
      })}
      <TypeNameSelector
        key={"node"}
        label={"Nodo"}
        typeAndNameOptions={nodeOptions}
        selectedTypeAndName={lastNodeTypeAndName}
        onSelection={(
          nodeTypeOption: SelectOption,
          nodeNameOption: SelectOption,
        ) => {
          onSelectionNode(nodeNameOption);
          setLastNodeTypeAndName({
            selectedType: nodeTypeOption,
            selectedName: nodeNameOption,
          });
        }}
      />
      <TypeNameSelector
        key={"entity"}
        label={"Entidad"}
        typeAndNameOptions={entityOptions}
        selectedTypeAndName={lastEntityTypeAndName}
        onSelection={(
          entityTypeOption: SelectOption,
          entityNameOption: SelectOption,
        ) => {
          onSelectionEntity(entityNameOption);
          setLastEntityTypeAndName({
            selectedType: entityTypeOption,
            selectedName: entityNameOption,
          });
        }}
      />
      <TypeNameSelector
        key={"installation"}
        label={"Instalación"}
        typeAndNameOptions={installationOptions}
        selectedTypeAndName={lastInstallationTypeAndName}
        onSelection={(
          installationTypeOption: SelectOption,
          installationNameOption: SelectOption,
        ) => {
          onSelectionInstallation(installationNameOption);
          setLastInstallationTypeAndName({
            selectedType: installationTypeOption,
            selectedName: installationNameOption,
          });
        }}
      />
    </Form>
  );
};

export const V2SRNodesFilter = React.memo(V2SRNodesFilterComponent);
