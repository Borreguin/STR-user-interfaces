import { v2Bahia } from "./V2GeneralTypes";
import { BahiaElement } from "./GeneralTypes";

export const formatPercentage = (percentage: number, n: number) => {
  if (percentage === 100) {
    return "100";
  } else if (percentage < 0) {
    return "---";
  } else {
    return "" + percentage.toFixed(n);
  }
};

export const getDescriptionBahia = (bahia: v2Bahia) => {
  if (bahia.voltaje === 0) {
    return `${bahia.bahia_nombre}`;
  }
  return `${bahia.voltaje} - ${bahia.bahia_nombre}`;
};

export const getElementValues = (selectedValue: any) => {
  const document_id = selectedValue.document_id;
  const types = [
    selectedValue.tipo,
    selectedValue.entidad_tipo,
    selectedValue.instalacion_tipo,
    "Bahía",
  ];
  const names = [
    selectedValue.nombre,
    selectedValue.entidad_nombre,
    selectedValue.instalacion_nombre,
    selectedValue.bahia_nombre,
  ];
  const type = types.find((type) => type !== undefined);
  const name = names.find((name) => name !== undefined);
  return { document_id, type, name };
};

export const getElementValuesForBahias = (bahia: BahiaElement) => {
  const document_id = bahia.document_id;
  const type = "Bahia";
  const name = bahia.bahia_nombre;
  return { document_id, type, name };
};

export const getCurrentUser = () => {
  return (
    localStorage.getItem("userRole") +
    " | " +
    localStorage.getItem("userDisplayName")
  );
};
