import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Box, Typography } from "@mui/material";
import CompanyCard from "./CompanyCard";
const KanbanColumn = ({ title, companies, id }) => {
  return /* @__PURE__ */ jsxDEV(Box, { sx: { height: "100%", display: "flex", flexDirection: "column" }, children: [
    /* @__PURE__ */ jsxDEV(
      Box,
      {
        sx: {
          bgcolor: "background.paper",
          p: 2,
          borderBottom: "1px solid",
          borderBottomColor: "divider"
        },
        children: /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", children: [
          title,
          " (",
          companies.length,
          ")"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 17,
          columnNumber: 9
        })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 9,
        columnNumber: 7
      }
    ),
    /* @__PURE__ */ jsxDEV(Droppable, { droppableId: id, children: (provided, snapshot) => /* @__PURE__ */ jsxDEV(
      Box,
      {
        ref: provided.innerRef,
        ...provided.droppableProps,
        sx: {
          flexGrow: 1,
          minHeight: "400px",
          bgcolor: snapshot.isDraggingOver ? "action.hover" : "background.default",
          transition: "background-color 0.2s ease",
          p: 2,
          overflowY: "auto"
        },
        children: [
          companies.map((company, index) => /* @__PURE__ */ jsxDEV(
            CompanyCard,
            {
              company,
              index
            },
            company.id.toString(),
            false,
            {
              fileName: "<stdin>",
              lineNumber: 39,
              columnNumber: 15
            }
          )),
          provided.placeholder
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 24,
        columnNumber: 11
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 22,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 8,
    columnNumber: 5
  });
};
var stdin_default = KanbanColumn;
export {
  stdin_default as default
};
