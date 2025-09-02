import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import KanbanBoard from "../components/pipeline/KanbanBoard";
const Pipeline = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxDEV(Box, { children: [
    /* @__PURE__ */ jsxDEV(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", children: "Pipeline de Vendas" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 13,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          variant: "contained",
          color: "primary",
          startIcon: /* @__PURE__ */ jsxDEV(AddIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 17,
            columnNumber: 22
          }),
          onClick: () => navigate("/companies"),
          children: "Nova Empresa"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 14,
          columnNumber: 9
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 12,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Paper, { elevation: 0, sx: { bgcolor: "transparent", height: "calc(100vh - 180px)" }, children: /* @__PURE__ */ jsxDEV(KanbanBoard, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 25,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 24,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 11,
    columnNumber: 5
  });
};
var stdin_default = Pipeline;
export {
  stdin_default as default
};
