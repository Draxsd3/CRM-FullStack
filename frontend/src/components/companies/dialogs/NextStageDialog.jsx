import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField
} from "@mui/material";
import { toast } from "react-toastify";
import pipelineService from "../../../services/pipelineService";
const PIPELINE_STAGES = [
  "Lead",
  "Reuni\xE3o Agendada",
  "Reuni\xE3o Realizada",
  "Aguardando Documenta\xE7\xE3o",
  "Aguardando Cadastro",
  "Cadastro Efetivado",
  "Cliente Operando"
];
const NextStageDialog = ({
  open,
  onClose,
  company,
  onStatusChange
}) => {
  const [observation, setObservation] = useState("");
  const getNextStage = (currentStage) => {
    const currentIndex = PIPELINE_STAGES.indexOf(currentStage);
    if (currentIndex === -1 || currentIndex === PIPELINE_STAGES.length - 1) {
      return null;
    }
    return PIPELINE_STAGES[currentIndex + 1];
  };
  const handleMoveToNextStage = async () => {
    try {
      if (!company) return;
      const nextStage2 = getNextStage(company.pipelineStatus);
      if (!nextStage2) {
        toast.info("Empresa j\xE1 est\xE1 no \xFAltimo est\xE1gio do pipeline");
        onClose();
        return;
      }
      await pipelineService.updateCompanyStatus(
        company.id,
        nextStage2,
        observation || `Avan\xE7ado para ${nextStage2}`
      );
      toast.success(`Empresa avan\xE7ada para ${nextStage2}`);
      if (onStatusChange) {
        onStatusChange(nextStage2);
      }
      setObservation("");
      onClose();
    } catch (error) {
      console.error("Erro ao avan\xE7ar empresa no pipeline:", error);
      toast.error("Erro ao atualizar status");
    }
  };
  if (!company) return null;
  const nextStage = getNextStage(company.pipelineStatus);
  return /* @__PURE__ */ jsxDEV(Dialog, { open, onClose, children: [
    /* @__PURE__ */ jsxDEV(DialogTitle, { children: "Avan\xE7ar no Pipeline" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 83,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(DialogContent, { children: nextStage ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(DialogContentText, { gutterBottom: true, children: [
        "Deseja avan\xE7ar ",
        /* @__PURE__ */ jsxDEV("strong", { children: company.name }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 88,
          columnNumber: 30
        }),
        " para o pr\xF3ximo est\xE1gio?"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 87,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Box, { my: 2, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "subtitle1", children: [
          "Est\xE1gio atual: ",
          /* @__PURE__ */ jsxDEV("strong", { children: company.pipelineStatus }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 92,
            columnNumber: 32
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 91,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "subtitle1", children: [
          "Pr\xF3ximo est\xE1gio: ",
          /* @__PURE__ */ jsxDEV("strong", { children: nextStage }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 95,
            columnNumber: 34
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 94,
          columnNumber: 15
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 90,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(
        TextField,
        {
          margin: "dense",
          id: "observation",
          label: "Observa\xE7\xE3o (opcional)",
          type: "text",
          fullWidth: true,
          multiline: true,
          rows: 3,
          value: observation,
          onChange: (e) => setObservation(e.target.value)
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 98,
          columnNumber: 13
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 86,
      columnNumber: 11
    }) : /* @__PURE__ */ jsxDEV(DialogContentText, { children: "Esta empresa j\xE1 est\xE1 no \xFAltimo est\xE1gio do pipeline." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 111,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 84,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(DialogActions, { children: [
      /* @__PURE__ */ jsxDEV(Button, { onClick: onClose, children: "Cancelar" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 117,
        columnNumber: 9
      }),
      nextStage && /* @__PURE__ */ jsxDEV(
        Button,
        {
          onClick: handleMoveToNextStage,
          color: "primary",
          variant: "contained",
          children: "Avan\xE7ar"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 119,
          columnNumber: 11
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 116,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 82,
    columnNumber: 5
  });
};
var stdin_default = NextStageDialog;
export {
  stdin_default as default
};
