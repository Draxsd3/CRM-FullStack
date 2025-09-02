import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";
import { toast } from "react-toastify";
import pipelineService from "../../../services/pipelineService";
const QualificationDialog = ({
  open,
  onClose,
  company,
  onQualificationChange
}) => {
  const handleQualifyLead = async (isQualified) => {
    try {
      if (!company) return;
      const qualificationStatus = isQualified ? "Lead Qualificado" : "Lead Desqualificado";
      const observation = isQualified ? "Lead qualificado ap\xF3s avalia\xE7\xE3o" : "Lead desqualificado ap\xF3s avalia\xE7\xE3o";
      await pipelineService.updateCompanyStatus(
        company.id,
        company.pipelineStatus,
        // Keep current pipeline status
        observation,
        qualificationStatus
      );
      toast.success(`Lead marcado como ${isQualified ? "qualificado" : "desqualificado"}`);
      if (onQualificationChange) {
        onQualificationChange(qualificationStatus);
      }
      onClose();
      if (!isQualified) {
        window.location.href = "/companies";
      }
    } catch (error) {
      console.error("Erro ao atualizar qualifica\xE7\xE3o do lead:", error);
      toast.error("Erro ao atualizar qualifica\xE7\xE3o do lead");
    }
  };
  return /* @__PURE__ */ jsxDEV(Dialog, { open, onClose, children: [
    /* @__PURE__ */ jsxDEV(DialogTitle, { children: "Qualificar Lead" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 56,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(DialogContent, { children: /* @__PURE__ */ jsxDEV(DialogContentText, { children: "Deseja qualificar ou desqualificar este lead?" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 58,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 57,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(DialogActions, { children: [
      /* @__PURE__ */ jsxDEV(Button, { onClick: () => handleQualifyLead(false), color: "error", children: "Desqualificar" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 63,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(Button, { onClick: () => handleQualifyLead(true), color: "success", variant: "contained", children: "Qualificar" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 66,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 62,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 55,
    columnNumber: 5
  });
};
var stdin_default = QualificationDialog;
export {
  stdin_default as default
};
