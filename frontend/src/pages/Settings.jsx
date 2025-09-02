import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { Box, Typography, Alert } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import OperatorsManagement from "../components/settings/OperatorsManagement";
const Settings = () => {
  const { hasAccess } = useContext(AuthContext);
  if (!hasAccess(["ADM"])) {
    return /* @__PURE__ */ jsxDEV(Box, { children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", mb: 3, children: "Configura\xE7\xF5es" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 13,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(Alert, { severity: "error", children: "Voc\xEA n\xE3o tem permiss\xE3o para acessar esta p\xE1gina." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 16,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 12,
      columnNumber: 7
    });
  }
  return /* @__PURE__ */ jsxDEV(Box, { children: [
    /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", mb: 3, children: "Configura\xE7\xF5es" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 25,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(OperatorsManagement, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 28,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 24,
    columnNumber: 5
  });
};
var stdin_default = Settings;
export {
  stdin_default as default
};
