import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const NotFound = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxDEV(
    Box,
    {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "70vh",
      children: /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, sx: { p: 5, textAlign: "center", maxWidth: 500 }, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h1", color: "primary", sx: { fontSize: "5rem", fontWeight: "bold" }, children: "404" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 17,
          columnNumber: 9
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h5", gutterBottom: true, children: "P\xE1gina n\xE3o encontrada" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 20,
          columnNumber: 9
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", color: "textSecondary", sx: { mb: 4 }, children: "A p\xE1gina que voc\xEA est\xE1 procurando n\xE3o existe ou foi movida." }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 23,
          columnNumber: 9
        }),
        /* @__PURE__ */ jsxDEV(
          Button,
          {
            variant: "contained",
            color: "primary",
            startIcon: /* @__PURE__ */ jsxDEV(ArrowBackIcon, {}, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 29,
              columnNumber: 22
            }),
            onClick: () => navigate("/"),
            children: "Voltar para Dashboard"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 26,
            columnNumber: 9
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 16,
        columnNumber: 7
      })
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 10,
      columnNumber: 5
    }
  );
};
var stdin_default = NotFound;
export {
  stdin_default as default
};
