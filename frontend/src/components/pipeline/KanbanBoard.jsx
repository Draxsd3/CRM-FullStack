import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useContext, useRef } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { Grid, Typography, Paper, Dialog, TextField, DialogTitle, DialogContent, DialogActions, Button, FormControlLabel, Switch } from "@mui/material";
import { toast } from "react-toastify";
import KanbanColumn from "./KanbanColumn";
import RescheduleDialog from "./RescheduleDialog";
import pipelineService from "../../services/pipelineService";
import { AuthContext } from "../../contexts/AuthContext";
const PIPELINE_STAGES = [
  "Lead",
  "Reuni\xE3o Agendada",
  "Reuni\xE3o Realizada",
  "Reuni\xE3o Cancelada",
  "Aguardando Documenta\xE7\xE3o",
  "Cadastro Efetivado",
  "Cliente Operando"
];
const KanbanBoard = () => {
  const KANBAN_CONFIG = {
    /** Maximum number of stages visible */
    MAX_STAGES: 7,
    /** Enable logging for drag and drop operations */
    ENABLE_DRAG_LOGGING: process.env.NODE_ENV === "development",
    /** Minimum allowed drag delay */
    DRAG_DELAY_MS: 100,
    /** Status change confirmation settings */
    STATUS_CHANGE_CONFIG: {
      /** Always require confirmation and notes for all status changes */
      REQUIRE_NOTES: true,
      /** Require observation for all status transitions */
      REQUIRE_OBSERVATION_STAGES: PIPELINE_STAGES
    },
    /** @tweakable Whether to filter companies by assigned user */
    FILTER_BY_ASSIGNED_USER: false,
    /** @tweakable Whether pipeline is shared among all users */
    SHARED_PIPELINE: true,
    /** @tweakable Auto-refresh interval in milliseconds */
    AUTO_REFRESH_INTERVAL: 3e4
    // Increased to 30 seconds to reduce flickering
  };
  const [columns, setColumns] = useState({});
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [targetStatus, setTargetStatus] = useState("");
  const [observation, setObservation] = useState("");
  const [prevColumns, setPrevColumns] = useState({});
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [changeAssignedUser, setChangeAssignedUser] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const refreshIntervalRef = useRef(null);
  const lastFetchTimeRef = useRef(0);
  const { user } = useContext(AuthContext);
  const fetchPipelineData = async (force = false) => {
    if (isDragging && !force) {
      return;
    }
    const now = Date.now();
    const minTimeBetweenFetches = 2e3;
    if (!force && now - lastFetchTimeRef.current < minTimeBetweenFetches) {
      return;
    }
    lastFetchTimeRef.current = now;
    try {
      setLoading(true);
      const pipelineData = await pipelineService.getPipelineCompanies();
      Object.keys(pipelineData).forEach((key) => {
        pipelineData[key] = pipelineData[key].filter(
          (company) => company.qualificationStatus !== "Lead Desqualificado"
        );
      });
      const completeColumns = {};
      PIPELINE_STAGES.forEach((stage) => {
        completeColumns[stage] = pipelineData[stage] || [];
      });
      setColumns(completeColumns);
    } catch (error) {
      console.error("Erro ao carregar dados do pipeline:", error);
      toast.error("N\xE3o foi poss\xEDvel carregar os dados do pipeline");
    } finally {
      setLoading(false);
    }
  };
  const validateStageProgression = (sourceStage, destStage) => {
    const sourceIndex = PIPELINE_STAGES.indexOf(sourceStage);
    const destIndex = PIPELINE_STAGES.indexOf(destStage);
    return destIndex >= sourceIndex;
  };
  const onDragStart = () => {
    setIsDragging(true);
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };
  const onDragEnd = (result) => {
    setIsDragging(false);
    if (!refreshIntervalRef.current) {
      refreshIntervalRef.current = setInterval(() => {
        fetchPipelineData();
      }, KANBAN_CONFIG.AUTO_REFRESH_INTERVAL);
    }
    if (KANBAN_CONFIG.ENABLE_DRAG_LOGGING) {
      console.log("Drag result:", result);
    }
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    if (!validateStageProgression(source.droppableId, destination.droppableId)) {
      toast.warning("N\xE3o \xE9 poss\xEDvel mover um lead para um est\xE1gio anterior");
      return;
    }
    if (!columns[source.droppableId] || !columns[destination.droppableId]) {
      return;
    }
    const newColumns = { ...columns };
    const movedCompany = columns[source.droppableId][source.index];
    if (!movedCompany) return;
    newColumns[source.droppableId] = newColumns[source.droppableId].filter(
      (company) => company.id !== movedCompany.id
    );
    const updatedCompany = {
      ...movedCompany,
      pipelineStatus: destination.droppableId
    };
    newColumns[destination.droppableId] = [
      ...newColumns[destination.droppableId].slice(0, destination.index),
      updatedCompany,
      ...newColumns[destination.droppableId].slice(destination.index)
    ];
    setPrevColumns(columns);
    setColumns(newColumns);
    const isDifferentUser = movedCompany.assignedUserId !== user.id;
    setChangeAssignedUser(false);
    setSelectedCompany(movedCompany);
    setTargetStatus(destination.droppableId);
    setOpenDialog(true);
    setObservation("");
  };
  const handleConfirmStatusChange = async (company, targetStatus2, obs = "", changeUser = false) => {
    try {
      if (!obs.trim()) {
        toast.error("Por favor, forne\xE7a uma observa\xE7\xE3o para a mudan\xE7a de status");
        return;
      }
      await pipelineService.updateCompanyStatus(
        company.id,
        targetStatus2,
        obs,
        null,
        // No change to qualification status
        changeUser
        // Explicitly pass the flag indicating whether to change user
      );
      toast.success(`${company.name} movido para ${targetStatus2}`);
      setTimeout(() => {
        fetchPipelineData(true);
      }, 300);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      setColumns(prevColumns);
      toast.error(
        error.response?.data?.error || "Erro ao atualizar status. Tente novamente."
      );
    }
  };
  const handleDialogConfirm = () => {
    if (!observation.trim()) {
      toast.error("Por favor, forne\xE7a uma observa\xE7\xE3o para a mudan\xE7a de status");
      return;
    }
    const isDifferentUser = selectedCompany.assignedUserId !== user.id;
    handleConfirmStatusChange(
      selectedCompany,
      targetStatus,
      observation,
      changeAssignedUser
    );
    setOpenDialog(false);
  };
  const handleDialogClose = () => {
    setColumns(prevColumns);
    setOpenDialog(false);
    setSelectedCompany(null);
    setTargetStatus("");
    setObservation("");
    setChangeAssignedUser(false);
  };
  useEffect(() => {
    const handleRefreshPipeline = (event) => {
      console.log("Received pipeline refresh event", event?.detail);
      setTimeout(() => {
        fetchPipelineData(true);
      }, 300);
    };
    window.addEventListener("refreshPipeline", handleRefreshPipeline);
    fetchPipelineData(true);
    refreshIntervalRef.current = setInterval(() => {
      fetchPipelineData();
    }, KANBAN_CONFIG.AUTO_REFRESH_INTERVAL);
    const handleFocus = () => {
      const now = Date.now();
      if (now - lastFetchTimeRef.current > 5e3) {
        fetchPipelineData();
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("refreshPipeline", handleRefreshPipeline);
      window.removeEventListener("focus", handleFocus);
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);
  const handleCardClick = (company) => {
    if (company.pipelineStatus === "Reuni\xE3o Cancelada") {
      setSelectedCompany(company);
      setOpenRescheduleDialog(true);
    } else {
    }
  };
  if (loading && !columns["Lead"]) {
    return /* @__PURE__ */ jsxDEV(Typography, { children: "Carregando pipeline..." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 321,
      columnNumber: 12
    });
  }
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(DragDropContext, { onDragStart, onDragEnd, children: /* @__PURE__ */ jsxDEV(
      Grid,
      {
        container: true,
        spacing: 2,
        sx: {
          overflowX: "auto",
          flexWrap: "nowrap",
          py: 2,
          minHeight: "70vh"
        },
        children: PIPELINE_STAGES.map((stage) => /* @__PURE__ */ jsxDEV(
          Grid,
          {
            item: true,
            sx: {
              minWidth: 300,
              maxWidth: 300
            },
            children: /* @__PURE__ */ jsxDEV(
              Paper,
              {
                elevation: 3,
                sx: {
                  height: "100%",
                  transition: "box-shadow 0.2s ease-in-out"
                },
                children: /* @__PURE__ */ jsxDEV(
                  KanbanColumn,
                  {
                    title: stage,
                    companies: columns[stage] || [],
                    id: stage,
                    handleCardClick
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 353,
                    columnNumber: 17
                  }
                )
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 346,
                columnNumber: 15
              }
            )
          },
          stage,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 338,
            columnNumber: 13
          }
        ))
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 327,
        columnNumber: 9
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 326,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(
      Dialog,
      {
        open: openDialog,
        onClose: handleDialogClose,
        children: [
          /* @__PURE__ */ jsxDEV(DialogTitle, { children: "Atualizar Status da Empresa" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 369,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV(DialogContent, { children: [
            /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", gutterBottom: true, children: [
              "Mover ",
              /* @__PURE__ */ jsxDEV("strong", { children: selectedCompany?.name }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 374,
                columnNumber: 19
              }),
              " para ",
              /* @__PURE__ */ jsxDEV("strong", { children: targetStatus }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 374,
                columnNumber: 65
              }),
              "?"
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 373,
              columnNumber: 11
            }),
            selectedCompany && selectedCompany.assignedUserId !== user.id && /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", sx: { mt: 2, mb: 1 }, children: [
                "Esta empresa est\xE1 atualmente atribu\xEDda a ",
                /* @__PURE__ */ jsxDEV("strong", { children: selectedCompany.AssignedUser?.name || "outro usu\xE1rio" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 381,
                  columnNumber: 58
                })
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 380,
                columnNumber: 15
              }),
              /* @__PURE__ */ jsxDEV(
                FormControlLabel,
                {
                  control: /* @__PURE__ */ jsxDEV(
                    Switch,
                    {
                      checked: changeAssignedUser,
                      onChange: (e) => setChangeAssignedUser(e.target.checked),
                      color: "primary"
                    },
                    void 0,
                    false,
                    {
                      fileName: "<stdin>",
                      lineNumber: 385,
                      columnNumber: 19
                    }
                  ),
                  label: `Transferir empresa para ${user.name} (voc\xEA)`
                },
                void 0,
                false,
                {
                  fileName: "<stdin>",
                  lineNumber: 383,
                  columnNumber: 15
                }
              )
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 379,
              columnNumber: 13
            }),
            /* @__PURE__ */ jsxDEV(
              TextField,
              {
                autoFocus: true,
                margin: "dense",
                label: "Observa\xE7\xE3o (obrigat\xF3rio)",
                type: "text",
                fullWidth: true,
                multiline: true,
                rows: 3,
                value: observation,
                onChange: (e) => setObservation(e.target.value),
                required: true,
                error: !observation,
                helperText: !observation ? "Por favor, explique o motivo desta mudan\xE7a de status" : "",
                sx: { mt: 2 }
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 396,
                columnNumber: 11
              }
            )
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 372,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV(DialogActions, { children: [
            /* @__PURE__ */ jsxDEV(Button, { onClick: handleDialogClose, children: "Cancelar" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 413,
              columnNumber: 11
            }),
            /* @__PURE__ */ jsxDEV(
              Button,
              {
                onClick: handleDialogConfirm,
                color: "primary",
                variant: "contained",
                disabled: !observation,
                children: "Confirmar"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 416,
                columnNumber: 11
              }
            )
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 412,
            columnNumber: 9
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 365,
        columnNumber: 7
      }
    ),
    /* @__PURE__ */ jsxDEV(
      RescheduleDialog,
      {
        open: openRescheduleDialog,
        onClose: () => setOpenRescheduleDialog(false),
        company: selectedCompany,
        onRescheduleComplete: fetchPipelineData
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 427,
        columnNumber: 7
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 325,
    columnNumber: 5
  });
};
var stdin_default = KanbanBoard;
export {
  stdin_default as default
};
