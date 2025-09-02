import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Chip
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import pipelineService from "../../services/pipelineService";
import meetingService from "../../services/meetingService";
const RescheduleDialog = ({
  open,
  onClose,
  company,
  onRescheduleComplete
}) => {
  const [startTime, setStartTime] = useState(dayjs().add(1, "day"));
  const [endTime, setEndTime] = useState(dayjs().add(1, "day").add(1, "hour"));
  const [location, setLocation] = useState("");
  const [observation, setObservation] = useState("");
  const [loading, setLoading] = useState(false);
  const handleReschedule = async () => {
    try {
      if (!company) return;
      setLoading(true);
      const meetingData = {
        title: `Reuni\xE3o Reagendada - ${company.name}`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        location,
        companyId: company.id,
        meetingType: "Presencial",
        status: "Reagendada",
        // Mark as rescheduled instead of scheduled
        description: `Reuni\xE3o reagendada. Observa\xE7\xF5es: ${observation}`
      };
      await meetingService.createMeeting(meetingData);
      await pipelineService.updateCompanyStatus(
        company.id,
        "Reuni\xE3o Agendada",
        // Change from "Reunião Cancelada" to "Reunião Agendada"
        `Reuni\xE3o reagendada: ${observation}`
      );
      toast.success("Reuni\xE3o reagendada com sucesso");
      if (onRescheduleComplete) {
        onRescheduleComplete();
      }
      onClose();
    } catch (error) {
      console.error("Erro ao reagendar reuni\xE3o:", error);
      toast.error("Erro ao reagendar reuni\xE3o");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxDEV(Dialog, { open, onClose, maxWidth: "md", fullWidth: true, children: [
    /* @__PURE__ */ jsxDEV(DialogTitle, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
      /* @__PURE__ */ jsxDEV(EventRepeatIcon, { color: "warning" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 80,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", children: "Reagendar Reuni\xE3o Cancelada" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 81,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 79,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(DialogContent, { children: [
      /* @__PURE__ */ jsxDEV(Box, { sx: { mb: 2, p: 2, bgcolor: "#fff9f0", borderRadius: 1, border: "1px solid #ffcc80" }, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "subtitle1", gutterBottom: true, fontWeight: "bold", children: [
          "Empresa: ",
          /* @__PURE__ */ jsxDEV("span", { style: { color: "#f57c00" }, children: company?.name }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 86,
            columnNumber: 22
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 85,
          columnNumber: 11
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "text.secondary", children: [
          "Status atual: ",
          /* @__PURE__ */ jsxDEV(Chip, { size: "small", label: "Reuni\xE3o Cancelada", color: "error" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 89,
            columnNumber: 27
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 88,
          columnNumber: 11
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "text.secondary", sx: { mt: 1 }, children: [
          "Ap\xF3s reagendamento: ",
          /* @__PURE__ */ jsxDEV(Chip, { size: "small", label: "Reuni\xE3o Agendada", color: "primary" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 92,
            columnNumber: 33
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 91,
          columnNumber: 11
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 84,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 2, children: [
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxDEV(
          DateTimePicker,
          {
            label: "Data e Hora de In\xEDcio",
            value: startTime,
            onChange: (value) => {
              setStartTime(value);
              setEndTime(dayjs(value).add(1, "hour"));
            },
            slotProps: {
              textField: {
                fullWidth: true,
                required: true
              }
            }
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 98,
            columnNumber: 13
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 97,
          columnNumber: 11
        }),
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxDEV(
          DateTimePicker,
          {
            label: "Data e Hora de T\xE9rmino",
            value: endTime,
            onChange: (value) => setEndTime(value),
            slotProps: {
              textField: {
                fullWidth: true,
                required: true
              }
            }
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 115,
            columnNumber: 13
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 114,
          columnNumber: 11
        }),
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
          TextField,
          {
            label: "Local",
            value: location,
            onChange: (e) => setLocation(e.target.value),
            fullWidth: true,
            placeholder: "Ex: Escrit\xF3rio da empresa, Zoom, Google Meet, etc.",
            InputProps: {
              startAdornment: /* @__PURE__ */ jsxDEV(CalendarTodayIcon, { color: "action", sx: { mr: 1 } }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 136,
                columnNumber: 33
              })
            }
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 129,
            columnNumber: 13
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 128,
          columnNumber: 11
        }),
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
          TextField,
          {
            label: "Observa\xE7\xF5es",
            value: observation,
            onChange: (e) => setObservation(e.target.value),
            required: true,
            error: !observation,
            helperText: !observation ? "Por favor, explique o motivo do reagendamento" : "",
            fullWidth: true,
            multiline: true,
            rows: 3
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 142,
            columnNumber: 13
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 141,
          columnNumber: 11
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 96,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 83,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(DialogActions, { children: [
      /* @__PURE__ */ jsxDEV(Button, { onClick: onClose, children: "Cancelar" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 157,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          onClick: handleReschedule,
          color: "warning",
          variant: "contained",
          disabled: loading || !observation,
          startIcon: /* @__PURE__ */ jsxDEV(EventRepeatIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 163,
            columnNumber: 22
          }),
          children: loading ? "Reagendando..." : "Reagendar Reuni\xE3o"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 158,
          columnNumber: 9
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 156,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 78,
    columnNumber: 5
  });
};
var stdin_default = RescheduleDialog;
export {
  stdin_default as default
};
