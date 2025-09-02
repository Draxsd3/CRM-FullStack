import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useContext } from "react";
import {
  Paper,
  Typography,
  Divider,
  Grid,
  Button
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import TimelineIcon from "@mui/icons-material/Timeline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import companyService from "../../services/companyService";
import { AuthContext } from "../../contexts/AuthContext";
const CompanyActions = ({
  company,
  setOpenMeetingDialog,
  setOpenStatusDialog,
  setOpenQualificationDialog
}) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const handleDeleteCompany = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta empresa?")) {
      try {
        await companyService.deleteCompany(id);
        toast.success("Empresa exclu\xEDda com sucesso");
        navigate("/companies");
      } catch (error) {
        console.error("Erro ao excluir empresa:", error);
        toast.error("Erro ao excluir empresa");
      }
    }
  };
  return /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, sx: { p: 2 }, children: [
    /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", gutterBottom: true, children: "A\xE7\xF5es R\xE1pidas" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 43,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Divider, { sx: { mb: 2 } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 46,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 2, children: [
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxDEV(
        Button,
        {
          fullWidth: true,
          variant: "outlined",
          startIcon: /* @__PURE__ */ jsxDEV(EventNoteIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 52,
            columnNumber: 24
          }),
          onClick: () => setOpenMeetingDialog(true),
          children: "Agendar Reuni\xE3o"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 49,
          columnNumber: 11
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 48,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxDEV(
        Button,
        {
          fullWidth: true,
          variant: "outlined",
          startIcon: /* @__PURE__ */ jsxDEV(TimelineIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 62,
            columnNumber: 24
          }),
          onClick: () => setOpenStatusDialog(true),
          children: "Alterar Status no Pipeline"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 59,
          columnNumber: 11
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 58,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxDEV(
        Button,
        {
          fullWidth: true,
          variant: "outlined",
          color: company?.qualificationStatus === "Lead Qualificado" ? "success" : "primary",
          startIcon: /* @__PURE__ */ jsxDEV(CheckCircleIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 73,
            columnNumber: 24
          }),
          onClick: () => setOpenQualificationDialog(true),
          children: company?.qualificationStatus ? "Alterar Qualifica\xE7\xE3o" : "Qualificar Lead"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 69,
          columnNumber: 11
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 68,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxDEV(
        Button,
        {
          fullWidth: true,
          variant: "outlined",
          color: "error",
          startIcon: /* @__PURE__ */ jsxDEV(DeleteIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 84,
            columnNumber: 24
          }),
          onClick: () => handleDeleteCompany(company.id),
          children: "Excluir Empresa"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 80,
          columnNumber: 11
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 79,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 47,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 42,
    columnNumber: 5
  });
};
var stdin_default = CompanyActions;
export {
  stdin_default as default
};
