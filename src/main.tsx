import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { register } from "swiper/element/bundle";
import { ProductProvider } from "./pages/admin/utils/ProductContext";
import { ServiceProvider } from "./pages/admin/utils/ServiceContext";

register();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProductProvider>
      <ServiceProvider>
        <App />
      </ServiceProvider>
    </ProductProvider>
  </StrictMode>
);
