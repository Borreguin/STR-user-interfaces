export const formatPercentage = (percentage: number, n: number) => {
  if (percentage === 100) {
    return "100";
  } else if (percentage < 0) {
    return "---";
  } else {
    return "" + percentage.toFixed(n);
  }
};
