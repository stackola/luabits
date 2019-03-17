import { combineReducers } from "redux";

import * as userReducer from "./user";
import * as configReducer from "./config";

export default combineReducers(Object.assign({}, userReducer, configReducer));
