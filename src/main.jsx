import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Web3Provider } from "./context/Web3Context";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Web3Provider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "'Nunito', system-ui, sans-serif",
              fontSize: "14px",
              borderRadius: "12px",
              border: "1px solid #EDE7E1",
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.07)",
            },
            success: { iconTheme: { primary: "#7DBFA0", secondary: "white" } },
            error: { iconTheme: { primary: "#f87171", secondary: "white" } },
          }}
        />
      </Web3Provider>
    </BrowserRouter>
  </React.StrictMode>
);
