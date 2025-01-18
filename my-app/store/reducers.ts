import { combineReducers } from "redux";
import signUpReducer from "./slices/signUpSlice";
import signInReducer from "./slices/signInSlices";
import forgotPasswordReducer from "./slices/forgotPasswordSlice";
import assetHistoryReducer from "./slices/assetHistorySlice";
import notificationsReducer from "./slices/notificationsSlice";

const rootReducer = combineReducers({
  signUp: signUpReducer,
  signIn: signInReducer,
  forgotPassword: forgotPasswordReducer,
  assetHistory: assetHistoryReducer,
  notifications: notificationsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
