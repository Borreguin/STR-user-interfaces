import React, { useEffect, useState } from "react";
import { CheckBoxMapType, CheckBoxSection } from "./CheckBoxSection";
import { ButtonSection } from "./ButtonSection";
import { selectedElements, TAG } from "../GeneralTypes";
import {
  editBahia,
  getTagValues,
  searchTags,
} from "../FetchData/V2SRFetchData";
import { TagValuesResponse } from "../FetchData/model";
import { FilterOptions } from "./FilterOptions";
import { filterExpression } from "./constants";

interface TagManagerProps {
  selectedValues: selectedElements;
  requestReload?: Function;
}

type bahiaOption = {
  bahia_code: string;
  bahia_nombre: string;
};

export function TagManager(props: TagManagerProps) {
  const { selectedValues, requestReload } = props;
  const bahias = selectedValues.selectedInstallation.bahias;
  const [clearAll, setClearAll] = useState(false);
  const [selectedBahia, setSelectedBahia] = useState(null);
  const [systemCheckBoxes, setSystemCheckBoxes] = useState(
    {} as CheckBoxMapType,
  );
  const [piServerCheckBoxes, setPiServerCheckBoxes] = useState(
    {} as CheckBoxMapType,
  );

  const [moveFromLeft, setMoveFromLeft] = useState(false);
  const [moveFromRight, setMoveFromRight] = useState(false);

  const handleClearClick = () => {
    setClearAll(true);
  };
  useEffect(() => {
    const initialBahiaCode =
      bahias && bahias.length > 0 ? bahias[0].bahia_code : null;
    if (!initialBahiaCode) return;
    const getInitialTagValues = () => {
      const bahia = bahias.find((b) => b.bahia_code === initialBahiaCode);
      if (!bahia) return;
      const tagList = bahia.tags;
      getTagValues(tagList).then((response) => {
        getTagValuesForSelectedBahia(response);
      });
      setSelectedBahia(bahia);
    };
    getInitialTagValues();
  }, []);

  useEffect(() => {
    if (selectedBahia) {
      const tagList = selectedBahia.tags;
      getTagValues(tagList).then((response) => {
        getTagValuesForSelectedBahia(response);
      });
    } else {
      setSystemCheckBoxes({});
    }
  }, [selectedBahia]);

  const getTagValuesForSelectedBahia = (
    tagValuesResponse: TagValuesResponse,
  ) => {
    const checkBoxes = {} as CheckBoxMapType;
    if (tagValuesResponse.success) {
      const tags = tagValuesResponse.tags;
      for (const tag of tags) {
        checkBoxes[tag.id] = {
          id: tag.id,
          checked: false,
          toSearch: tag.id,
          tagName: tag.name,
          value: `${tag.name} - [${tag.timestamp}] - ${tag.value}`,
        };
      }
    }
    setSystemCheckBoxes(checkBoxes);
  };

  const handleMoveToLeftSection = (checkBoxes: CheckBoxMapType) => {
    setMoveFromRight(false);
    const newCheckBoxes = { ...piServerCheckBoxes, ...checkBoxes };
    setPiServerCheckBoxes(newCheckBoxes);
  };

  const handleMoveToRightSection = (checkBoxes: CheckBoxMapType) => {
    setMoveFromLeft(false);
    const newCheckBoxes = { ...systemCheckBoxes, ...checkBoxes };
    setSystemCheckBoxes(newCheckBoxes);
  };

  const handleSaveTags = () => {
    const installationId = selectedValues.selectedInstallation._id;
    if (!selectedBahia) return;
    const bahiaForm = { ...selectedBahia };
    const bahiaId = selectedBahia.document_id;
    let tagsToSave: TAG[] = [];
    for (const checkBox of Object.values(systemCheckBoxes)) {
      const tag = {
        tag_name: checkBox.tagName,
        filter_expression: filterExpression,
        activado: true,
      } as TAG;
      tagsToSave.push(tag);
    }
    bahiaForm.tags = tagsToSave;
    setClearAll(true);
    editBahia(installationId, bahiaId, bahiaForm).then((response) => {
      if (response.success) {
        requestReload();
      }
    });
  };

  return (
    <div>
      <FilterOptions
        selectedValues={selectedValues}
        onSelection={setSelectedBahia}
        onFilterTags={setPiServerCheckBoxes}
        onSaveTags={handleSaveTags}
      ></FilterOptions>
      <div className={"check-boxes-container"}>
        <CheckBoxSection
          title={"Consulta desde PI-server"}
          checkMap={piServerCheckBoxes}
          clearAll={clearAll}
          onClearAll={() => setClearAll(false)}
          moveSelected={moveFromLeft}
          onMoveSelected={handleMoveToRightSection}
        />
        <ButtonSection
          onClearClick={handleClearClick}
          moveToLeftClick={() => setMoveFromRight(true)}
          moveToRightClick={() => setMoveFromLeft(true)}
        ></ButtonSection>
        <CheckBoxSection
          title={"Tags en el sistema (bahía seleccionada)"}
          checkMap={systemCheckBoxes}
          clearAll={clearAll}
          onClearAll={() => setClearAll(false)}
          moveSelected={moveFromRight}
          onMoveSelected={handleMoveToLeftSection}
        ></CheckBoxSection>
      </div>
    </div>
  );
}
