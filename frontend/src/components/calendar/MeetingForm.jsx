import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import {
  TextField,
  Button,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Chip
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ScheduleIcon from "@mui/icons-material/Schedule";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
const MeetingForm = ({
  initialValues,
  onSubmit,
  onCancel,
  onDelete,
  isEditing,
  companies
}) => {
  const COMPANIES_CONFIG = {
    /** Minimum number of companies required */
    MIN_COMPANIES: 0,
    /** Default company when no companies are available */
    DEFAULT_COMPANY: { id: null, name: "Sem empresas cadastradas" },
    /** Enable logging for companies data */
    ENABLE_LOGGING: process.env.NODE_ENV === "development"
  };
  const safeCompanies = Array.isArray(companies) && companies.length > 0 ? companies : [COMPANIES_CONFIG.DEFAULT_COMPANY];
  if (COMPANIES_CONFIG.ENABLE_LOGGING) {
    console.log("Companies in MeetingForm:", safeCompanies);
  }
  const DEFAULT_FORM_VALUES = {
    title: "",
    description: "",
    startTime: dayjs(),
    endTime: dayjs().add(1, "hour"),
    location: "",
    meetingType: "Presencial",
    status: "Agendada",
    companyId: safeCompanies[0]?.id,
    enableNotification: true
    // New field for notification preference
  };
  const formInitialValues = {
    ...DEFAULT_FORM_VALUES,
    ...initialValues,
    // Ensure id is properly set when editing
    id: initialValues?.id || void 0
  };
  if (isEditing) {
    console.log("Editing meeting with initial values:", formInitialValues);
  }
  const [formValues, setFormValues] = React.useState(formInitialValues);
  const [formError, setFormError] = React.useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const handleDateChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };
  const handleStatusChange = (event, newStatus) => {
    if (newStatus !== null) {
      setFormValues({ ...formValues, status: newStatus });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      if (!formValues.title) {
        setFormError("T\xEDtulo da reuni\xE3o \xE9 obrigat\xF3rio");
        return;
      }
      if (!formValues.companyId) {
        setFormError("Selecione uma empresa");
        return;
      }
      const meetingData = {
        ...formValues,
        startTime: formValues.startTime instanceof dayjs ? formValues.startTime.toISOString() : formValues.startTime,
        endTime: formValues.endTime instanceof dayjs ? formValues.endTime.toISOString() : formValues.endTime
      };
      await onSubmit(meetingData);
    } catch (error) {
      console.error("Erro ao salvar reuni\xE3o:", error);
      setFormError("Erro ao salvar reuni\xE3o. Tente novamente.");
      toast.error("Erro ao salvar reuni\xE3o");
    }
  };
  const handleDelete = () => {
    if (onDelete && formValues.id) {
      const meetingId = Number(formValues.id);
      console.log("Deleting meeting with numeric ID:", meetingId);
      if (isNaN(meetingId) || meetingId <= 0) {
        toast.error("ID de reuni\xE3o inv\xE1lido para exclus\xE3o");
        return;
      }
      onDelete(meetingId);
    } else {
      console.error("Cannot delete: Invalid meeting ID or no delete handler provided", {
        id: formValues.id,
        hasDeleteHandler: !!onDelete
      });
      toast.error("N\xE3o foi poss\xEDvel excluir a reuni\xE3o");
    }
  };
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(DialogTitle, { children: isEditing ? "Editar Reuni\xE3o" : "Agendar Nova Reuni\xE3o" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 163,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(DialogContent, { children: [
      formError && /* @__PURE__ */ jsxDEV(Alert, { severity: "error", sx: { mb: 2 }, children: formError }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 168,
        columnNumber: 11
      }),
      isEditing && /* @__PURE__ */ jsxDEV(Box, { mb: 2, children: /* @__PURE__ */ jsxDEV(Typography, { variant: "caption", color: "text.secondary", children: [
        "ID da reuni\xE3o: ",
        formValues.id
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 175,
        columnNumber: 13
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 174,
        columnNumber: 11
      }),
      safeCompanies.length === 0 ? /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", color: "error", children: "Nenhuma empresa cadastrada. Por favor, cadastre uma empresa primeiro." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 182,
        columnNumber: 11
      }) : /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 2, sx: { mt: 1 }, children: [
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
          TextField,
          {
            name: "title",
            label: "T\xEDtulo da Reuni\xE3o",
            value: formValues.title,
            onChange: handleChange,
            fullWidth: true,
            required: true
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 189,
            columnNumber: 17
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 188,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxDEV(
          DateTimePicker,
          {
            label: "Data e Hora de In\xEDcio",
            value: dayjs(formValues.startTime),
            onChange: (value) => handleDateChange("startTime", value),
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
            lineNumber: 200,
            columnNumber: 17
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 199,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxDEV(
          DateTimePicker,
          {
            label: "Data e Hora de T\xE9rmino",
            value: dayjs(formValues.endTime),
            onChange: (value) => handleDateChange("endTime", value),
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
            lineNumber: 214,
            columnNumber: 17
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 213,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
          TextField,
          {
            name: "companyId",
            label: "Empresa",
            select: true,
            value: formValues.companyId,
            onChange: handleChange,
            fullWidth: true,
            required: true,
            disabled: safeCompanies.length === 1,
            children: safeCompanies.map((company) => /* @__PURE__ */ jsxDEV(MenuItem, { value: company.id, children: company.name }, company.id, false, {
              fileName: "<stdin>",
              lineNumber: 239,
              columnNumber: 21
            }))
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 228,
            columnNumber: 17
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 227,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxDEV(
          TextField,
          {
            name: "location",
            label: "Local",
            value: formValues.location,
            onChange: handleChange,
            fullWidth: true,
            placeholder: "Ex: Escrit\xF3rio, Zoom, Google Meet, etc."
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 247,
            columnNumber: 17
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 246,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxDEV(
          TextField,
          {
            name: "meetingType",
            label: "Tipo de Reuni\xE3o",
            select: true,
            value: formValues.meetingType,
            onChange: handleChange,
            fullWidth: true,
            required: true,
            children: [
              /* @__PURE__ */ jsxDEV(MenuItem, { value: "Presencial", children: "Presencial" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 267,
                columnNumber: 19
              }),
              /* @__PURE__ */ jsxDEV(MenuItem, { value: "Virtual", children: "Virtual" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 268,
                columnNumber: 19
              }),
              /* @__PURE__ */ jsxDEV(MenuItem, { value: "Telef\xF4nica", children: "Telef\xF4nica" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 269,
                columnNumber: 19
              })
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 258,
            columnNumber: 17
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 257,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
          FormControlLabel,
          {
            control: /* @__PURE__ */ jsxDEV(
              Switch,
              {
                checked: formValues.enableNotification,
                onChange: (e) => setFormValues({
                  ...formValues,
                  enableNotification: e.target.checked
                }),
                name: "enableNotification"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 276,
                columnNumber: 21
              }
            ),
            label: "Ativar notifica\xE7\xE3o 20 minutos antes (para reuni\xF5es virtuais)"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 274,
            columnNumber: 17
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 273,
          columnNumber: 15
        }),
        isEditing && /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: [
          /* @__PURE__ */ jsxDEV(Typography, { gutterBottom: true, children: "Status da Reuni\xE3o" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 291,
            columnNumber: 19
          }),
          /* @__PURE__ */ jsxDEV(
            ToggleButtonGroup,
            {
              value: formValues.status,
              exclusive: true,
              onChange: handleStatusChange,
              "aria-label": "status da reuni\xE3o",
              fullWidth: true,
              sx: { mb: 2 },
              children: [
                /* @__PURE__ */ jsxDEV(
                  ToggleButton,
                  {
                    value: "Agendada",
                    "aria-label": "agendada",
                    sx: {
                      bgcolor: formValues.status === "Agendada" ? "rgba(33, 150, 243, 0.08)" : "inherit",
                      color: formValues.status === "Agendada" ? "primary.main" : "inherit",
                      "&.Mui-selected": {
                        bgcolor: "primary.light",
                        color: "primary.contrastText"
                      }
                    },
                    children: /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex", flexDirection: "column", alignItems: "center", py: 1 }, children: [
                      /* @__PURE__ */ jsxDEV(ScheduleIcon, {}, void 0, false, {
                        fileName: "<stdin>",
                        lineNumber: 313,
                        columnNumber: 25
                      }),
                      /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", sx: { mt: 0.5 }, children: "Agendada" }, void 0, false, {
                        fileName: "<stdin>",
                        lineNumber: 314,
                        columnNumber: 25
                      })
                    ] }, void 0, true, {
                      fileName: "<stdin>",
                      lineNumber: 312,
                      columnNumber: 23
                    })
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 300,
                    columnNumber: 21
                  }
                ),
                /* @__PURE__ */ jsxDEV(
                  ToggleButton,
                  {
                    value: "Realizada",
                    "aria-label": "realizada",
                    sx: {
                      bgcolor: formValues.status === "Realizada" ? "rgba(76, 175, 80, 0.08)" : "inherit",
                      color: formValues.status === "Realizada" ? "success.main" : "inherit",
                      "&.Mui-selected": {
                        bgcolor: "success.light",
                        color: "success.contrastText"
                      }
                    },
                    children: /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex", flexDirection: "column", alignItems: "center", py: 1 }, children: [
                      /* @__PURE__ */ jsxDEV(CheckCircleIcon, {}, void 0, false, {
                        fileName: "<stdin>",
                        lineNumber: 330,
                        columnNumber: 25
                      }),
                      /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", sx: { mt: 0.5 }, children: "Realizada" }, void 0, false, {
                        fileName: "<stdin>",
                        lineNumber: 331,
                        columnNumber: 25
                      })
                    ] }, void 0, true, {
                      fileName: "<stdin>",
                      lineNumber: 329,
                      columnNumber: 23
                    })
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 317,
                    columnNumber: 21
                  }
                ),
                /* @__PURE__ */ jsxDEV(
                  ToggleButton,
                  {
                    value: "Reagendada",
                    "aria-label": "reagendada",
                    sx: {
                      bgcolor: formValues.status === "Reagendada" ? "rgba(255, 152, 0, 0.08)" : "inherit",
                      color: formValues.status === "Reagendada" ? "warning.main" : "inherit",
                      "&.Mui-selected": {
                        bgcolor: "warning.light",
                        color: "warning.contrastText"
                      }
                    },
                    children: /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex", flexDirection: "column", alignItems: "center", py: 1 }, children: [
                      /* @__PURE__ */ jsxDEV(EventRepeatIcon, {}, void 0, false, {
                        fileName: "<stdin>",
                        lineNumber: 347,
                        columnNumber: 25
                      }),
                      /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", sx: { mt: 0.5 }, children: "Reagendada" }, void 0, false, {
                        fileName: "<stdin>",
                        lineNumber: 348,
                        columnNumber: 25
                      })
                    ] }, void 0, true, {
                      fileName: "<stdin>",
                      lineNumber: 346,
                      columnNumber: 23
                    })
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 334,
                    columnNumber: 21
                  }
                ),
                /* @__PURE__ */ jsxDEV(
                  ToggleButton,
                  {
                    value: "Cancelada",
                    "aria-label": "cancelada",
                    sx: {
                      bgcolor: formValues.status === "Cancelada" ? "rgba(244, 67, 54, 0.08)" : "inherit",
                      color: formValues.status === "Cancelada" ? "error.main" : "inherit",
                      "&.Mui-selected": {
                        bgcolor: "error.light",
                        color: "error.contrastText"
                      }
                    },
                    children: /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex", flexDirection: "column", alignItems: "center", py: 1 }, children: [
                      /* @__PURE__ */ jsxDEV(CancelIcon, {}, void 0, false, {
                        fileName: "<stdin>",
                        lineNumber: 364,
                        columnNumber: 25
                      }),
                      /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", sx: { mt: 0.5 }, children: "Cancelada" }, void 0, false, {
                        fileName: "<stdin>",
                        lineNumber: 365,
                        columnNumber: 25
                      })
                    ] }, void 0, true, {
                      fileName: "<stdin>",
                      lineNumber: 363,
                      columnNumber: 23
                    })
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 351,
                    columnNumber: 21
                  }
                )
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 292,
              columnNumber: 19
            }
          ),
          formValues.status === "Cancelada" && /* @__PURE__ */ jsxDEV(Alert, { severity: "info", sx: { mb: 2 }, children: 'Ao cancelar uma reuni\xE3o, a empresa passar\xE1 para a coluna "Reuni\xE3o Cancelada" no pipeline. Voc\xEA poder\xE1 reagendar posteriormente.' }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 372,
            columnNumber: 21
          }),
          formValues.status === "Realizada" && /* @__PURE__ */ jsxDEV(Alert, { severity: "success", sx: { mb: 2 }, children: 'Ao marcar como realizada, a empresa passar\xE1 para a coluna "Reuni\xE3o Realizada" no pipeline.' }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 378,
            columnNumber: 21
          }),
          formValues.status === "Reagendada" && /* @__PURE__ */ jsxDEV(Alert, { severity: "warning", sx: { mb: 2 }, children: 'A reuni\xE3o ser\xE1 marcada como reagendada, mas a empresa continuar\xE1 na coluna "Reuni\xE3o Agendada" no pipeline.' }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 383,
            columnNumber: 21
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 290,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
          TextField,
          {
            name: "description",
            label: "Descri\xE7\xE3o",
            value: formValues.description || "",
            onChange: handleChange,
            fullWidth: true,
            multiline: true,
            rows: 4
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 391,
            columnNumber: 17
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 390,
          columnNumber: 15
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 187,
        columnNumber: 13
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 186,
        columnNumber: 11
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 166,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(DialogActions, { children: [
      isEditing && /* @__PURE__ */ jsxDEV(
        Button,
        {
          onClick: handleDelete,
          color: "error",
          startIcon: /* @__PURE__ */ jsxDEV(DeleteIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 410,
            columnNumber: 24
          }),
          children: "Excluir"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 407,
          columnNumber: 11
        }
      ),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          onClick: onCancel,
          startIcon: /* @__PURE__ */ jsxDEV(CloseIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 417,
            columnNumber: 22
          }),
          children: "Cancelar"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 415,
          columnNumber: 9
        }
      ),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          onClick: handleSubmit,
          variant: "contained",
          color: "primary",
          disabled: safeCompanies.length === 0,
          startIcon: /* @__PURE__ */ jsxDEV(SaveIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 426,
            columnNumber: 22
          }),
          children: isEditing ? "Atualizar" : "Agendar"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 421,
          columnNumber: 9
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 405,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 162,
    columnNumber: 5
  });
};
var stdin_default = MeetingForm;
export {
  stdin_default as default
};
