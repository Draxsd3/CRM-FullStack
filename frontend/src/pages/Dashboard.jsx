import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import BusinessIcon from "@mui/icons-material/Business";
import EventNoteIcon from "@mui/icons-material/EventNote";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Bar } from "react-chartjs-2";
import companyService from "../services/companyService";
import meetingService from "../services/meetingService";
import pipelineService from "../services/pipelineService";
const Dashboard = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [pipelineData, setPipelineData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const companiesData = await companyService.getAllCompanies();
        setCompanies(companiesData.slice(0, 5));
        const startDate = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
        const endDate = format(new Date((/* @__PURE__ */ new Date()).setDate((/* @__PURE__ */ new Date()).getDate() + 7)), "yyyy-MM-dd");
        const meetingsData = await meetingService.getMeetingsByDateRange(startDate, endDate);
        setMeetings(meetingsData.slice(0, 5));
        const pipeline = await pipelineService.getPipelineCompanies();
        setPipelineData(pipeline);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };
  const countCompaniesByStatus = () => {
    const counts = {};
    for (const status in pipelineData) {
      counts[status] = pipelineData[status]?.length || 0;
    }
    return counts;
  };
  const generatePipelineChartData = () => {
    const counts = countCompaniesByStatus();
    return {
      labels: Object.keys(counts),
      datasets: [
        {
          label: "Empresas por Status",
          data: Object.values(counts),
          backgroundColor: [
            "rgba(212, 175, 55, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(46, 125, 50, 0.6)"
          ],
          borderColor: [
            "rgba(212, 175, 55, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(46, 125, 50, 1)"
          ],
          borderWidth: 1
        }
      ]
    };
  };
  if (loading) {
    return /* @__PURE__ */ jsxDEV(Typography, { children: "Carregando dashboard..." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 113,
      columnNumber: 12
    });
  }
  return /* @__PURE__ */ jsxDEV(Box, { children: /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 3, children: [
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", gutterBottom: true, children: "Dashboard" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 121,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(Typography, { variant: "subtitle1", color: "textSecondary", children: "Vis\xE3o geral do CRM Gold Credit" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 124,
        columnNumber: 11
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 120,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 2, children: [
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(Card, { elevation: 2, children: /* @__PURE__ */ jsxDEV(CardContent, { children: [
        /* @__PURE__ */ jsxDEV(Typography, { color: "textSecondary", gutterBottom: true, children: "Total de Empresas" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 135,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", children: companies.length }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 138,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Box, { mt: 2, display: "flex", justifyContent: "flex-end", children: /* @__PURE__ */ jsxDEV(
          Button,
          {
            size: "small",
            color: "primary",
            onClick: () => navigate("/companies"),
            children: "Ver Todas"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 142,
            columnNumber: 21
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 141,
          columnNumber: 19
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 134,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 133,
        columnNumber: 15
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 132,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(Card, { elevation: 2, children: /* @__PURE__ */ jsxDEV(CardContent, { children: [
        /* @__PURE__ */ jsxDEV(Typography, { color: "textSecondary", gutterBottom: true, children: "Empresas em Lead" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 156,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", children: pipelineData["Lead"]?.length || 0 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 159,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Box, { mt: 2, display: "flex", justifyContent: "flex-end", children: /* @__PURE__ */ jsxDEV(
          Button,
          {
            size: "small",
            color: "primary",
            onClick: () => navigate("/pipeline"),
            children: "Ver Pipeline"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 163,
            columnNumber: 21
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 162,
          columnNumber: 19
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 155,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 154,
        columnNumber: 15
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 153,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(Card, { elevation: 2, children: /* @__PURE__ */ jsxDEV(CardContent, { children: [
        /* @__PURE__ */ jsxDEV(Typography, { color: "textSecondary", gutterBottom: true, children: "Clientes Operando" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 177,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", children: pipelineData["Cliente Operando"]?.length || 0 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 180,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Box, { mt: 2, display: "flex", justifyContent: "flex-end", children: /* @__PURE__ */ jsxDEV(
          Button,
          {
            size: "small",
            color: "primary",
            onClick: () => navigate("/pipeline"),
            children: "Ver Clientes"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 184,
            columnNumber: 21
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 183,
          columnNumber: 19
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 176,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 175,
        columnNumber: 15
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 174,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(Card, { elevation: 2, children: /* @__PURE__ */ jsxDEV(CardContent, { children: [
        /* @__PURE__ */ jsxDEV(Typography, { color: "textSecondary", gutterBottom: true, children: "Pr\xF3ximas Reuni\xF5es" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 198,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", children: meetings.length }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 201,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Box, { mt: 2, display: "flex", justifyContent: "flex-end", children: /* @__PURE__ */ jsxDEV(
          Button,
          {
            size: "small",
            color: "primary",
            onClick: () => navigate("/calendar"),
            children: "Ver Agenda"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 205,
            columnNumber: 21
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 204,
          columnNumber: 19
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 197,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 196,
        columnNumber: 15
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 195,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 131,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 130,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(Paper, { elevation: 2, sx: { p: 2 }, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", gutterBottom: true, children: "A\xE7\xF5es R\xE1pidas" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 222,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Divider, { sx: { mb: 2 } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 225,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 2, children: [
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 6, sm: 3, children: /* @__PURE__ */ jsxDEV(
          Button,
          {
            fullWidth: true,
            variant: "outlined",
            startIcon: /* @__PURE__ */ jsxDEV(AddCircleIcon, {}, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 231,
              columnNumber: 30
            }),
            onClick: () => navigate("/companies"),
            sx: { p: 1 },
            children: "Nova Empresa"
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
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 6, sm: 3, children: /* @__PURE__ */ jsxDEV(
          Button,
          {
            fullWidth: true,
            variant: "outlined",
            startIcon: /* @__PURE__ */ jsxDEV(EventNoteIcon, {}, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 242,
              columnNumber: 30
            }),
            onClick: () => navigate("/calendar"),
            sx: { p: 1 },
            children: "Nova Reuni\xE3o"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 239,
            columnNumber: 17
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 238,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 6, sm: 3, children: /* @__PURE__ */ jsxDEV(
          Button,
          {
            fullWidth: true,
            variant: "outlined",
            startIcon: /* @__PURE__ */ jsxDEV(BusinessIcon, {}, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 253,
              columnNumber: 30
            }),
            onClick: () => navigate("/pipeline"),
            sx: { p: 1 },
            children: "Ver Pipeline"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 250,
            columnNumber: 17
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 249,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 6, sm: 3, children: /* @__PURE__ */ jsxDEV(
          Button,
          {
            fullWidth: true,
            variant: "outlined",
            startIcon: /* @__PURE__ */ jsxDEV(TrendingUpIcon, {}, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 264,
              columnNumber: 30
            }),
            onClick: () => navigate("/reports"),
            sx: { p: 1 },
            children: "Ver Relat\xF3rios"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 261,
            columnNumber: 17
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 260,
          columnNumber: 15
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 226,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 221,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 220,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 6, children: /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, sx: { p: 2 }, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", gutterBottom: true, children: "Distribui\xE7\xE3o no Pipeline" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 278,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Divider, { sx: { mb: 2 } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 281,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Box, { height: 300, children: /* @__PURE__ */ jsxDEV(
        Bar,
        {
          data: generatePipelineChartData(),
          options: {
            maintainAspectRatio: false,
            responsive: true
          }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 283,
          columnNumber: 15
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 282,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 277,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 276,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 6, children: /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, sx: { p: 2, height: "100%" }, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", gutterBottom: true, children: "Empresas Recentes" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 297,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Divider, { sx: { mb: 2 } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 300,
        columnNumber: 13
      }),
      companies.length > 0 ? /* @__PURE__ */ jsxDEV(List, { children: companies.map((company) => /* @__PURE__ */ jsxDEV(
        ListItem,
        {
          button: true,
          onClick: () => navigate(`/companies/${company.id}`),
          sx: { borderBottom: "1px solid #eee" },
          children: [
            /* @__PURE__ */ jsxDEV(ListItemIcon, { children: /* @__PURE__ */ jsxDEV(Avatar, { children: /* @__PURE__ */ jsxDEV(BusinessIcon, {}, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 312,
              columnNumber: 25
            }) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 311,
              columnNumber: 23
            }) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 310,
              columnNumber: 21
            }),
            /* @__PURE__ */ jsxDEV(
              ListItemText,
              {
                primary: company.name,
                secondary: `Status: ${company.pipelineStatus} | Cadastro: ${formatDate(company.createdAt)}`
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 315,
                columnNumber: 21
              }
            )
          ]
        },
        company.id,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 304,
          columnNumber: 19
        }
      )) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 302,
        columnNumber: 15
      }) : /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", align: "center", children: "Nenhuma empresa cadastrada." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 323,
        columnNumber: 15
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 296,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 295,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, sx: { p: 2 }, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", gutterBottom: true, children: "Pr\xF3ximas Reuni\xF5es" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 333,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Divider, { sx: { mb: 2 } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 336,
        columnNumber: 13
      }),
      meetings.length > 0 ? /* @__PURE__ */ jsxDEV(List, { children: /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 2, children: meetings.map((meeting) => /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 6, children: /* @__PURE__ */ jsxDEV(Paper, { elevation: 1, sx: { p: 2 }, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", children: meeting.title }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 343,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", children: [
          "Data: ",
          formatDate(meeting.startTime)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 344,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", gutterBottom: true, children: [
          "Empresa: ",
          meeting.Company?.name || "N/A"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 347,
          columnNumber: 25
        }),
        /* @__PURE__ */ jsxDEV(Box, { mt: 1, display: "flex", justifyContent: "flex-end", children: /* @__PURE__ */ jsxDEV(
          Button,
          {
            size: "small",
            color: "primary",
            onClick: () => navigate("/calendar"),
            children: "Ver Detalhes"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 351,
            columnNumber: 27
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 350,
          columnNumber: 25
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 342,
        columnNumber: 23
      }) }, meeting.id, false, {
        fileName: "<stdin>",
        lineNumber: 341,
        columnNumber: 21
      })) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 339,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 338,
        columnNumber: 15
      }) : /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", align: "center", children: "Nenhuma reuni\xE3o agendada para os pr\xF3ximos dias." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 365,
        columnNumber: 15
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 332,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 331,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 118,
    columnNumber: 7
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 117,
    columnNumber: 5
  });
};
var stdin_default = Dashboard;
export {
  stdin_default as default
};
