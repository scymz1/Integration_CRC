export const SET_DATA_SET = "SET_DATASET";

export function setDataSet(dataSet) {
  return {type: SET_DATA_SET, dataSet: dataSet};
}