import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  /* @__PURE__ */ jsxDEV(React.StrictMode, { children: /* @__PURE__ */ jsxDEV(BrowserRouter, { children: [
    /* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 13,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(ToastContainer, { position: "top-right", autoClose: 5e3 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 14,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 12,
    columnNumber: 5
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 11,
    columnNumber: 3
  })
);
