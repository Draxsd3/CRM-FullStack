import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { Box, Typography } from "@mui/material";
import CalendarComponent from "../components/calendar/Calendar";
const CalendarPage = () => {
  return /* @__PURE__ */ jsxDEV(Box, { children: [
    /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", mb: 3, children: "Agenda de Reuni\xF5es" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 8,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(CalendarComponent, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 9,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 7,
    columnNumber: 5
  });
};
var stdin_default = CalendarPage;
export {
  stdin_default as default
};
