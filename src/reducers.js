import {SET_DATA_SET} from "./actions";

const initialState = {
  dataSet:["0", "0"],
}

export function Reducer(state = initialState, action) {
  switch (action.type) {
    case SET_DATA_SET:
      return {
        ...state,
        dataSet: [action.dataSet, action.dataSet]
      }
    default:
      return state;
  }
}