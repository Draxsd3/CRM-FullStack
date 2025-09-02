import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button
} from "@mui/material";
import { toast } from "react-toastify";
import pipelineService from "../../../services/pipelineService";
import { AuthContext } from "../../../contexts/AuthContext";
const StatusDialog = ({
  open,
  onClose,
  company,
  onStatusChange
}) => {
  const [newStatus, setNewStatus] = useState("");
  const [statusObservation, setStatusObservation] = useState("");
  const { user } = useContext(AuthContext);
  const getStatusOptions = () => {
    if (user?.role === "SDR" && company?.ownerType === "SDR") {
      return [
        "Lead",
        "Reuni\xE3o Agendada",
        "Reuni\xE3o Realizada"
      ];
    } else if (user?.role === "Closer") {
      return [
        "Reuni\xE3o Agendada",
        "Reuni\xE3o Realizada",
        "Aguardando Documenta\xE7\xE3o",
        "Aguardando Cadastro",
        "Cadastro Efetivado",
        "Cliente Operando"
      ];
    } else {
      return [
        "Lead",
        "Reuni\xE3o Agendada",
        "Reuni\xE3o Realizada",
        "Aguardando Documenta\xE7\xE3o",
        "Aguardando Cadastro",
        "Cadastro Efetivado",
        "Cliente Operando"
      ];
    }
  };
  const handleStatusChange = async () => {
    try {
      if (!company || !newStatus) return;
      await pipelineService.updateCompanyStatus(
        company.id,
        newStatus,
        statusObservation
      );
      toast.success(`Status atualizado para ${newStatus}`);
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
      setNewStatus("");
      setStatusObservation("");
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar status no pipeline:", error);
      toast.error("Erro ao atualizar status");
    }
  };
  const handleClose = () => {
    setNewStatus("");
    setStatusObservation("");
    onClose();
  };
  return /* @__PURE__ */ jsxDEV(Dialog, { open, onClose: handleClose, children: [
    /* @__PURE__ */ jsxDEV(DialogTitle, { children: "Alterar Status no Pipeline" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 95,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(DialogContent, { children: [
      /* @__PURE__ */ jsxDEV(DialogContentText, { gutterBottom: true, children: [
        "Selecione o novo status para ",
        company?.name,
        ":"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 97,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(FormControl, { fullWidth: true, sx: { mt: 2 }, children: [
        /* @__PURE__ */ jsxDEV(InputLabel, { children: "Novo Status" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 101,
          columnNumber: 11
        }),
        /* @__PURE__ */ jsxDEV(
          Select,
          {
            value: newStatus,
            label: "Novo Status",
            onChange: (e) => setNewStatus(e.target.value),
            children: getStatusOptions().map((status) => /* @__PURE__ */ jsxDEV(MenuItem, { value: status, children: status }, status, false, {
              fileName: "<stdin>",
              lineNumber: 108,
              columnNumber: 15
            }))
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 102,
            columnNumber: 11
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 100,
        columnNumber: 9
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
          value: statusObservation,
          onChange: (e) => setStatusObservation(e.target.value),
          sx: { mt: 2 }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 112,
          columnNumber: 9
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 96,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(DialogActions, { children: [
      /* @__PURE__ */ jsxDEV(Button, { onClick: handleClose, children: "Cancelar" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 126,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          onClick: handleStatusChange,
          color: "primary",
          variant: "contained",
          disabled: !newStatus,
          children: "Confirmar"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 127,
          columnNumber: 9
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 125,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 94,
    columnNumber: 5
  });
};
var stdin_default = StatusDialog;
export {
  stdin_default as default
};
