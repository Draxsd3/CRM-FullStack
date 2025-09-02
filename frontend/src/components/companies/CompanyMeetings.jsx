import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { formatDate } from "../../utils/dateUtils";
const CompanyMeetings = ({ meetings, setOpenMeetingDialog }) => {
  return /* @__PURE__ */ jsxDEV(Box, { children: [
    /* @__PURE__ */ jsxDEV(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", children: "Reuni\xF5es da Empresa" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 18,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          variant: "contained",
          color: "primary",
          startIcon: /* @__PURE__ */ jsxDEV(EventNoteIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 22,
            columnNumber: 22
          }),
          onClick: () => setOpenMeetingDialog(true),
          children: "Nova Reuni\xE3o"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 19,
          columnNumber: 9
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 17,
      columnNumber: 7
    }),
    meetings.length === 0 ? /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", align: "center", py: 4, children: "Nenhuma reuni\xE3o agendada para esta empresa." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 30,
      columnNumber: 9
    }) : /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 2, children: meetings.map((meeting) => /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 6, children: /* @__PURE__ */ jsxDEV(Card, { variant: "outlined", children: /* @__PURE__ */ jsxDEV(CardContent, { children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", children: meeting.title }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 39,
        columnNumber: 19
      }),
      /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", children: [
        "Data: ",
        formatDate(meeting.startTime),
        " at\xE9 ",
        formatDate(meeting.endTime)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 40,
        columnNumber: 19
      }),
      /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", children: [
        "Local: ",
        meeting.location || "N\xE3o especificado"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 43,
        columnNumber: 19
      }),
      /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", children: [
        "Tipo: ",
        meeting.meetingType
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 46,
        columnNumber: 19
      }),
      /* @__PURE__ */ jsxDEV(
        Chip,
        {
          label: meeting.status,
          size: "small",
          color: meeting.status === "Realizada" ? "success" : meeting.status === "Cancelada" ? "error" : "primary",
          sx: { mt: 1 }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 49,
          columnNumber: 19
        }
      ),
      meeting.description && /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", mt: 1, children: meeting.description }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 57,
        columnNumber: 21
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 38,
      columnNumber: 17
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 37,
      columnNumber: 15
    }) }, meeting.id, false, {
      fileName: "<stdin>",
      lineNumber: 36,
      columnNumber: 13
    })) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 34,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 16,
    columnNumber: 5
  });
};
var stdin_default = CompanyMeetings;
export {
  stdin_default as default
};
