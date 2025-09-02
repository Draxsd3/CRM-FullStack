import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
import { Paper, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Box, Chip } from "@mui/material";
import TimelineIcon from "@mui/icons-material/Timeline";
import PersonIcon from "@mui/icons-material/Person";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import pipelineService from "../../services/pipelineService";
const HistoryLog = ({ companyId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await pipelineService.getCompanyPipelineHistory(companyId);
        setHistory(data);
      } catch (error) {
        console.error("Erro ao carregar hist\xF3rico:", error);
      } finally {
        setLoading(false);
      }
    };
    if (companyId) {
      fetchHistory();
    }
  }, [companyId]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };
  if (loading) {
    return /* @__PURE__ */ jsxDEV(Typography, { children: "Carregando hist\xF3rico..." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 40,
      columnNumber: 12
    });
  }
  return /* @__PURE__ */ jsxDEV(Paper, { elevation: 2, sx: { p: 2, mt: 2 }, children: [
    /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", gutterBottom: true, children: "Hist\xF3rico de Movimenta\xE7\xF5es" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 45,
      columnNumber: 7
    }),
    history.length === 0 ? /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "text.secondary", children: "Nenhuma movimenta\xE7\xE3o registrada." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 50,
      columnNumber: 9
    }) : /* @__PURE__ */ jsxDEV(List, { sx: { width: "100%", bgcolor: "background.paper" }, children: history.map((item, index) => /* @__PURE__ */ jsxDEV(React.Fragment, { children: [
      /* @__PURE__ */ jsxDEV(ListItem, { alignItems: "flex-start", children: [
        /* @__PURE__ */ jsxDEV(ListItemAvatar, { children: /* @__PURE__ */ jsxDEV(Avatar, { children: item.previousAssignedUserId !== item.newAssignedUserId && item.newAssignedUserId ? /* @__PURE__ */ jsxDEV(SwapHorizIcon, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 61,
          columnNumber: 23
        }) : /* @__PURE__ */ jsxDEV(TimelineIcon, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 61,
          columnNumber: 43
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 59,
          columnNumber: 19
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 58,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV(
          ListItemText,
          {
            primary: /* @__PURE__ */ jsxDEV(Typography, { component: "span", variant: "body1", children: item.previousStatus ? `${item.previousStatus} \u2192 ${item.newStatus}` : `Criado como ${item.newStatus}` }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 66,
              columnNumber: 21
            }),
            secondary: /* @__PURE__ */ jsxDEV(Fragment, { children: [
              /* @__PURE__ */ jsxDEV(Typography, { component: "span", variant: "body2", color: "text.primary", children: formatDate(item.changeDate) }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 72,
                columnNumber: 23
              }),
              item.User && /* @__PURE__ */ jsxDEV(Box, { display: "flex", alignItems: "center", mt: 1, children: [
                /* @__PURE__ */ jsxDEV(Typography, { component: "span", variant: "body2", color: "text.secondary", children: "Alterado por:" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 79,
                  columnNumber: 27
                }),
                /* @__PURE__ */ jsxDEV(
                  Chip,
                  {
                    icon: /* @__PURE__ */ jsxDEV(PersonIcon, {}, void 0, false, {
                      fileName: "<stdin>",
                      lineNumber: 83,
                      columnNumber: 35
                    }),
                    label: item.User.name,
                    size: "small",
                    color: "primary",
                    variant: "outlined",
                    sx: { ml: 1 }
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 82,
                    columnNumber: 27
                  }
                )
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 78,
                columnNumber: 25
              }),
              item.previousAssignedUserId !== item.newAssignedUserId && item.newAssignedUserId && /* @__PURE__ */ jsxDEV(Box, { mt: 1, children: /* @__PURE__ */ jsxDEV(Typography, { component: "span", variant: "body2", color: "text.secondary", children: [
                "Respons\xE1vel alterado: ",
                item.PreviousAssignedUser?.name || "N\xE3o atribu\xEDdo",
                " \u2192 ",
                item.NewAssignedUser?.name
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 96,
                columnNumber: 27
              }) }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 95,
                columnNumber: 25
              }),
              item.observations && /* @__PURE__ */ jsxDEV(Typography, { component: "div", variant: "body2", color: "text.secondary", sx: { mt: 1 }, children: item.observations }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 103,
                columnNumber: 25
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 71,
              columnNumber: 21
            })
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 64,
            columnNumber: 17
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 57,
        columnNumber: 15
      }),
      index < history.length - 1 && /* @__PURE__ */ jsxDEV(Divider, { variant: "inset", component: "li" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 111,
        columnNumber: 46
      })
    ] }, item.id, true, {
      fileName: "<stdin>",
      lineNumber: 56,
      columnNumber: 13
    })) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 54,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 44,
    columnNumber: 5
  });
};
var stdin_default = HistoryLog;
export {
  stdin_default as default
};
