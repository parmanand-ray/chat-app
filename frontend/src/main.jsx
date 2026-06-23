import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";

export const serverUrl = "http://localhost:3000";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ToastContainer position="top-right" autoClose={3000} theme="light" />
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
