import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContextProvider } from "./context/UserContext";
import { LoadingContextProvider } from "./context/LoadingContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { CartProvider } from "react-use-cart";

const client = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <CartProvider>
        <UserContextProvider>
          <LoadingContext>
            <QueryClientProvider client={client}>
              <App />
            </QueryClientProvider>
          </LoadingContext>
        </UserContextProvider>
      </CartProvider>
    </Router>
  </React.StrictMode>
);
