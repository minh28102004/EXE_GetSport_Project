import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.ts"; // import store
import "./index.css";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connectTokenSource } from "@lib/api";

connectTokenSource(() => store.getState().auth.accessToken);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
    <ToastContainer autoClose={3000} />
  </Provider>
);
