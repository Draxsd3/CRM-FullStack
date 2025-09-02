import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
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
import userService from "../../../services/userService";
const TransferDialog = ({
  open,
  onClose,
  company,
  onTransferComplete
}) => {
  const [closers, setClosers] = useState([]);
  const [selectedCloserId, setSelectedCloserId] = useState("");
  const [observations, setObservations] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (open) {
      fetchClosers();
    }
  }, [open]);
  const fetchClosers = async () => {
    try {
      setLoading(true);
      const users = await userService.getAllUsers();
      const closerUsers = users.filter((user) => user.role === "Closer");
      setClosers(closerUsers);
    } catch (error) {
      console.error("Erro ao carregar Closers:", error);
      toast.error("Erro ao carregar Closers");
    } finally {
      setLoading(false);
    }
  };
  const handleTransfer = async () => {
    try {
      if (!company || !selectedCloserId) {
        toast.error("Selecione um Closer para transferir");
        return;
      }
      setLoading(true);
      await pipelineService.transferToCloser(
        company.id,
        selectedCloserId,
        observations || "Lead transferido para Closer"
        // Add default observation
      );
      toast.success("Empresa transferida para Closer com sucesso");
      const TRANSITION_DELAY = 1e3;
      setTimeout(() => {
        if (onTransferComplete) {
          onTransferComplete();
        }
        setSelectedCloserId("");
        setObservations("");
        onClose();
      }, TRANSITION_DELAY);
    } catch (error) {
      console.error("Erro ao transferir empresa:", error);
      toast.error("Erro ao transferir empresa: " + (error.message || "Erro desconhecido"));
      setLoading(false);
    }
  };
  const handleClose = () => {
    setSelectedCloserId("");
    setObservations("");
    onClose();
  };
  return /* @__PURE__ */ jsxDEV(Dialog, { open, onClose: handleClose, children: [
    /* @__PURE__ */ jsxDEV(DialogTitle, { children: "Transferir para Closer" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 98,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(DialogContent, { children: [
      /* @__PURE__ */ jsxDEV(DialogContentText, { gutterBottom: true, children: [
        "Transferir ",
        /* @__PURE__ */ jsxDEV("strong", { children: company?.name }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 101,
          columnNumber: 22
        }),
        " para qual Closer?"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 100,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(FormControl, { fullWidth: true, sx: { mt: 2 }, children: [
        /* @__PURE__ */ jsxDEV(InputLabel, { children: "Closer" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 104,
          columnNumber: 11
        }),
        /* @__PURE__ */ jsxDEV(
          Select,
          {
            value: selectedCloserId,
            label: "Closer",
            onChange: (e) => setSelectedCloserId(e.target.value),
            disabled: loading || closers.length === 0,
            children: closers.map((closer) => /* @__PURE__ */ jsxDEV(MenuItem, { value: closer.id, children: closer.name }, closer.id, false, {
              fileName: "<stdin>",
              lineNumber: 112,
              columnNumber: 15
            }))
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 105,
            columnNumber: 11
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 103,
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
          value: observations,
          onChange: (e) => setObservations(e.target.value),
          sx: { mt: 2 }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 118,
          columnNumber: 9
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 99,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(DialogActions, { children: [
      /* @__PURE__ */ jsxDEV(Button, { onClick: handleClose, children: "Cancelar" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 132,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          onClick: handleTransfer,
          color: "primary",
          variant: "contained",
          disabled: loading || !selectedCloserId,
          children: loading ? "Transferindo..." : "Transferir"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 133,
          columnNumber: 9
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 131,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 97,
    columnNumber: 5
  });
};
var stdin_default = TransferDialog;
export {
  stdin_default as default
};
