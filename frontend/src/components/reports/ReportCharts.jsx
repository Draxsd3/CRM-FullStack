import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);
const ReportCharts = ({ reportData }) => {
  const DEBUG_LOGGING = false;
  const DEFAULT_REPORT_DATA = {
    meetingStats: {
      totalMeetings: 0,
      meetingsByStatus: [],
      meetingsByType: []
    },
    pipelineStats: {
      newLeads: 0,
      newClients: 0,
      conversionRate: 0,
      currentPipelineCount: [],
      sdrPerformance: []
    }
  };
  const safeReportData = reportData || DEFAULT_REPORT_DATA;
  if (DEBUG_LOGGING) {
    console.log("Report Data:", safeReportData);
  }
  const COLOR_PALETTE = {
    pipelineStatus: [
      "rgba(212, 175, 55, 0.6)",
      // Gold
      "rgba(255, 206, 86, 0.6)",
      "rgba(255, 159, 64, 0.6)",
      "rgba(75, 192, 192, 0.6)",
      "rgba(46, 125, 50, 0.6)"
    ],
    meetingStatus: [
      "rgba(212, 175, 55, 0.6)",
      // Gold
      "rgba(75, 192, 192, 0.6)",
      "rgba(255, 99, 132, 0.6)",
      "rgba(255, 206, 86, 0.6)"
    ],
    meetingType: [
      "rgba(212, 175, 55, 0.6)",
      // Gold
      "rgba(54, 162, 235, 0.6)",
      "rgba(255, 159, 64, 0.6)"
    ],
    sdrPerformance: {
      /* @tweakable Colors for SDR performance chart */
      meetings: "rgba(212, 175, 55, 0.8)",
      // Gold
      conversions: "rgba(75, 192, 192, 0.8)"
    }
  };
  const CHART_CONFIG = {
    maintainAspectRatio: false,
    responsive: true,
    height: 300
  };
  const meetingStats = safeReportData.meetingStats || DEFAULT_REPORT_DATA.meetingStats;
  const pipelineStats = safeReportData.pipelineStats || DEFAULT_REPORT_DATA.pipelineStats;
  const pipelineStatusData = {
    labels: (pipelineStats.currentPipelineCount || []).map((item) => item.status || "-"),
    datasets: [{
      label: "Empresas por Status",
      data: (pipelineStats.currentPipelineCount || []).map((item) => Number(item.count) || 0),
      backgroundColor: COLOR_PALETTE.pipelineStatus
    }]
  };
  const meetingsByStatusData = {
    labels: (meetingStats.meetingsByStatus || []).map((item) => item.status || "-"),
    datasets: [{
      label: "Reuni\xF5es por Status",
      data: (meetingStats.meetingsByStatus || []).map((item) => Number(item.count) || 0),
      backgroundColor: COLOR_PALETTE.meetingStatus
    }]
  };
  const meetingsByTypeData = {
    labels: (meetingStats.meetingsByType || []).map((item) => item.type || "-"),
    datasets: [{
      label: "Reuni\xF5es por Tipo",
      data: (meetingStats.meetingsByType || []).map((item) => Number(item.count) || 0),
      backgroundColor: COLOR_PALETTE.meetingType
    }]
  };
  const sdrPerformanceData = {
    labels: (pipelineStats.sdrPerformance || []).map((sdr) => sdr?.name || "-"),
    datasets: [
      {
        /* @tweakable Bar thickness for SDR chart */
        label: "Reuni\xF5es Agendadas",
        barThickness: 30,
        data: (pipelineStats.sdrPerformance || []).map((sdr) => Number(sdr?.meetingsScheduled) || 0),
        backgroundColor: COLOR_PALETTE.sdrPerformance.meetings
      },
      {
        label: "Clientes Convertidos",
        barThickness: 30,
        data: (pipelineStats.sdrPerformance || []).map((sdr) => Number(sdr?.clientsConverted) || 0),
        backgroundColor: COLOR_PALETTE.sdrPerformance.conversions
      }
    ]
  };
  return /* @__PURE__ */ jsxDEV(Box, { children: /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 3, children: [
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 2, children: [
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(Card, { elevation: 2, children: /* @__PURE__ */ jsxDEV(CardContent, { children: [
        /* @__PURE__ */ jsxDEV(Typography, { color: "textSecondary", gutterBottom: true, children: "Total de Reuni\xF5es" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 159,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", children: meetingStats.totalMeetings || 0 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 162,
          columnNumber: 19
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 158,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 157,
        columnNumber: 15
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 156,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(Card, { elevation: 2, children: /* @__PURE__ */ jsxDEV(CardContent, { children: [
        /* @__PURE__ */ jsxDEV(Typography, { color: "textSecondary", gutterBottom: true, children: "Novos Leads" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 171,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", children: pipelineStats.newLeads || 0 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 174,
          columnNumber: 19
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 170,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 169,
        columnNumber: 15
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 168,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(Card, { elevation: 2, children: /* @__PURE__ */ jsxDEV(CardContent, { children: [
        /* @__PURE__ */ jsxDEV(Typography, { color: "textSecondary", gutterBottom: true, children: "Clientes Operando" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 183,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", children: pipelineStats.newClients || 0 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 186,
          columnNumber: 19
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 182,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 181,
        columnNumber: 15
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 180,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(Card, { elevation: 2, children: /* @__PURE__ */ jsxDEV(CardContent, { children: [
        /* @__PURE__ */ jsxDEV(Typography, { color: "textSecondary", gutterBottom: true, children: "Taxa de Convers\xE3o" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 195,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", children: pipelineStats.conversionRate !== void 0 ? `${pipelineStats.conversionRate}%` : "0%" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 198,
          columnNumber: 19
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 194,
        columnNumber: 17
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 193,
        columnNumber: 15
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 192,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 155,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 154,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 6, children: /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, sx: { p: 2 }, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", gutterBottom: true, children: "Distribui\xE7\xE3o no Pipeline" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 212,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Divider, { sx: { mb: 2 } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 215,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Box, { height: CHART_CONFIG.height, children: /* @__PURE__ */ jsxDEV(
        Pie,
        {
          data: pipelineStatusData,
          options: {
            maintainAspectRatio: false,
            responsive: true
          }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 217,
          columnNumber: 15
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 216,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 211,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 210,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 6, children: /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, sx: { p: 2 }, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", gutterBottom: true, children: "Desempenho por Usu\xE1rio" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 231,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Divider, { sx: { mb: 2 } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 234,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Box, { height: CHART_CONFIG.height, children: /* @__PURE__ */ jsxDEV(
        Bar,
        {
          data: sdrPerformanceData,
          options: {
            /* @tweakable SDR chart display options */
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Quantidade"
                }
              }
            },
            plugins: {
              legend: {
                position: "top"
              },
              tooltip: {
                callbacks: {
                  title: function(tooltipItems) {
                    return tooltipItems[0].label;
                  }
                }
              }
            }
          }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 236,
          columnNumber: 15
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 235,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 230,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 229,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 6, children: /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, sx: { p: 2 }, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", gutterBottom: true, children: "Reuni\xF5es por Status" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 272,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Divider, { sx: { mb: 2 } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 275,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Box, { height: CHART_CONFIG.height, children: /* @__PURE__ */ jsxDEV(
        Bar,
        {
          data: meetingsByStatusData,
          options: {
            maintainAspectRatio: false,
            responsive: true
          }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 277,
          columnNumber: 15
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 276,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 271,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 270,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 6, children: /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, sx: { p: 2 }, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", gutterBottom: true, children: "Reuni\xF5es por Tipo" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 291,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Divider, { sx: { mb: 2 } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 294,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Box, { height: CHART_CONFIG.height, children: /* @__PURE__ */ jsxDEV(
        Pie,
        {
          data: meetingsByTypeData,
          options: {
            maintainAspectRatio: false,
            responsive: true
          }
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 296,
          columnNumber: 15
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 295,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 290,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 289,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 152,
    columnNumber: 7
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 151,
    columnNumber: 5
  });
};
var stdin_default = ReportCharts;
export {
  stdin_default as default
};
