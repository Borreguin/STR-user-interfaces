import { v2Bahia } from "./V2GeneralTypes";

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
