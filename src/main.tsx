import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { register } from "swiper/element/bundle";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./app/store";
import { Provider } from "react-redux";

register();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);

