import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";   // import store
import "./index.css";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
    <ToastContainer autoClose={3000} />
  </Provider>
);
