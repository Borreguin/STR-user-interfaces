import { Col, Form } from "react-bootstrap";
import React, { memo, useEffect, useState } from "react";
import { SelectOption } from "./model";
import { v4 as uuidv4 } from "uuid";

export interface TypeAndNameOptions {
  nameOptionsByType: { [K: string]: SelectOption[] };
  typeOptions: SelectOption[];
}

interface TypeSelector {
  selectedOption: SelectOption | undefined;
  options: Array<SelectOption>;
  onSelection: any;
}

export const RenderSelection = (props: TypeSelector): JSX.Element => {
  const { selectedOption, options, onSelection } = props;
  const [selectedValue, setSelectedValue] = useState<string>(
    selectedOption ? selectedOption.id : "",
  );
  useEffect(() => {
    if (selectedOption !== undefined) {
      setSelectedValue(selectedOption.id);
    }
  }, [selectedOption]);

  const _options = () => {
    if (
      selectedOption === undefined ||
      options.length === 0 ||
      selectedOption.value === undefined
    ) {
      return <option></option>;
    }
    return options.map((op) => (
      <option key={`${op.id}_${op.value}`} value={op.id}>
        {op.value}
      </option>
    ));
  };

  const _onSelection = (e) => {
    const id = e.target.value;
    const selectedOption = options.find((op) => op.id === id);
    setSelectedValue(id);
    onSelection(selectedOption);
  };

  return (
    <>
      <Form.Control
        key={uuidv4()}
        as="select"
        size="sm"
        value={selectedValue}
        onChange={(e) => _onSelection(e)}
      >
        {_options()}
      </Form.Control>
    </>
  );
};

interface TypeNameSelector {
  label: string;
  selectedTypeAndName:
    | { selectedType: SelectOption; selectedName: SelectOption }
    | undefined;
  typeAndNameOptions: TypeAndNameOptions;
  onSelection: any;
}

const renderAlert = (msg: string, type: string) => {
  return (
    <>
      <div className={`alert alert-${type}`} role="alert">
        {msg}
      </div>
    </>
  );
};

const TypeNameSelectorComponent = (props: TypeNameSelector): JSX.Element => {
  const { label, typeAndNameOptions, onSelection, selectedTypeAndName } = props;
  const [selectedType, setSelectedType] = useState<SelectOption>(
    selectedTypeAndName ? selectedTypeAndName.selectedType : undefined,
  );
  const [selectedName, setSelectedName] = useState<SelectOption>(
    selectedTypeAndName ? selectedTypeAndName.selectedName : undefined,
  );
  const [nameOptions, setNameOptions] = useState<SelectOption[]>([]);
  const [lastNameOptionId, setLastNameOptionId] = useState<string>("");

  useEffect(() => {
    if (selectedType === undefined && typeAndNameOptions !== undefined) {
      const toTypeSelect = typeAndNameOptions.typeOptions[0];
      setNameOptionsByType(toTypeSelect);
    }
  }, []);

  useEffect(() => {
    if (selectedType !== undefined) {
      setNameOptionsByType(selectedType);
    }
  }, [selectedType]);

  useEffect(() => {
    if (
      selectedType !== undefined &&
      selectedName !== undefined &&
      lastNameOptionId !== selectedName.id
    ) {
      setLastNameOptionId(selectedName.id);
      onSelection(selectedType, selectedName);
    }
  }, [selectedType, selectedName]);

  useEffect(() => {
    if (
      typeAndNameOptions === undefined ||
      typeAndNameOptions.typeOptions === undefined ||
      typeAndNameOptions.typeOptions.length === 0 ||
      typeAndNameOptions.nameOptionsByType === undefined
    ) {
      setLastNameOptionId(undefined);
      return;
    }
    if (selectedType === undefined || selectedName === undefined) {
      const toTypeSelect = typeAndNameOptions.typeOptions[0];
      setNameOptionsByType(toTypeSelect);
      return;
    }
    findTypeAndNameOptions();
  }, [typeAndNameOptions]);

  const findTypeAndNameOptions = () => {
    let foundName: SelectOption;
    const foundType = typeAndNameOptions.typeOptions.find(
      (t) => t.id === selectedType.id,
    );
    if (typeAndNameOptions.nameOptionsByType[selectedType.id] !== undefined) {
      foundName = typeAndNameOptions.nameOptionsByType[selectedType.id].find(
        (n) => n.id === selectedName.id,
      );
    }
    // special case when the selected name is not in the list of names
    // and needs to change the selected type
    if (
      typeAndNameOptions.nameOptionsByType[selectedType.id] === undefined ||
      foundType === undefined ||
      foundName === undefined
    ) {
      const toTypeSelect = typeAndNameOptions.typeOptions[0];
      setSelectedType(toTypeSelect);
    }
    if (lastNameOptionId !== selectedName.id) {
      onSelection(selectedType, selectedName);
    }
  };

  const setNameOptionsByType = (toTypeSelect: SelectOption) => {
    if (
      toTypeSelect !== undefined &&
      typeAndNameOptions !== undefined &&
      typeAndNameOptions.nameOptionsByType[toTypeSelect.id] !== undefined
    ) {
      setSelectedType(toTypeSelect);
      const foundName = typeAndNameOptions.nameOptionsByType[
        toTypeSelect.id
      ].find((n) => n.id === selectedName?.id);
      if (selectedName === undefined || foundName === undefined) {
        setSelectedName(
          typeAndNameOptions.nameOptionsByType[toTypeSelect.id][0],
        );
      }
      let nameOptions = typeAndNameOptions.nameOptionsByType[toTypeSelect.id];
      nameOptions.sort((a, b) => (a.value > b.value ? 1 : -1));
      setNameOptions(nameOptions);
    }
  };

  if (typeAndNameOptions === undefined) {
    return renderAlert(`Cargando información de ${label}`, "info");
  }

  if (typeAndNameOptions && typeAndNameOptions.typeOptions?.length === 0) {
    return renderAlert(`No hay ${label} registrados`, "warning");
  }

  return (
    <>
      <Form.Label className="cons-label" id={label}>
        Seleccione {label}
      </Form.Label>
      <Form.Row id={label}>
        <Form.Group as={Col}>
          <RenderSelection
            key={`${label}-type`}
            selectedOption={selectedType}
            options={typeAndNameOptions.typeOptions}
            onSelection={(option: React.SetStateAction<SelectOption>) => {
              setSelectedType(option);
            }}
          />
        </Form.Group>
        <Form.Group as={Col}>
          <RenderSelection
            key={`${label}-name`}
            selectedOption={selectedName}
            options={nameOptions}
            onSelection={(option: React.SetStateAction<SelectOption>) => {
              setSelectedName(option);
            }}
          />
        </Form.Group>
      </Form.Row>
    </>
  );
};

export const TypeNameSelector = memo(TypeNameSelectorComponent);
