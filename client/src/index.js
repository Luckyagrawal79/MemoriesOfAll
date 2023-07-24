import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
} from "redux";
import thunk from "redux-thunk";
import reducers from "./reducers";
import "./index.css";
import App from "./App/App";
import { SnackbarProvider } from "./contexts/SnackbarContext";

const store = createStore(reducers, {}, compose(applyMiddleware(thunk)));
ReactDOM.render(
  <Provider store={store}>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </Provider>,
  document.getElementById("root")
);
