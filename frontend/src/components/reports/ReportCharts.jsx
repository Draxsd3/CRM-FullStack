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
  RadialLinearScale,
  BarElement,
  Title,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Doughnut, Line, PolarArea } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
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
      "rgba(37, 99, 235, 0.78)",
      "rgba(14, 165, 233, 0.78)",
      "rgba(249, 115, 22, 0.78)",
      "rgba(234, 88, 12, 0.78)",
      "rgba(22, 163, 74, 0.78)",
      "rgba(16, 185, 129, 0.78)",
      "rgba(139, 92, 246, 0.78)"
    ],
    meetingStatus: [
      "rgba(59, 130, 246, 0.78)",
      "rgba(16, 185, 129, 0.78)",
      "rgba(239, 68, 68, 0.78)",
      "rgba(245, 158, 11, 0.78)"
    ],
    meetingType: [
      "rgba(14, 165, 233, 0.78)",
      "rgba(37, 99, 235, 0.78)",
      "rgba(249, 115, 22, 0.78)"
    ],
    sdrPerformance: {
      meetings: "rgba(37, 99, 235, 0.8)",
      conversions: "rgba(22, 163, 74, 0.8)"
    }
  };
  const CHART_CONFIG = {
    maintainAspectRatio: false,
    responsive: true,
    height: 320
  };
  const chartPaperSx = {
    p: 2.5,
    borderRadius: 3,
    border: "1px solid rgba(15, 23, 42, 0.08)",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
    background: "linear-gradient(180deg, #ffffff 0%, #fafcff 100%)"
  };
  const metricCardSx = {
    borderRadius: 2.5,
    border: "1px solid rgba(15, 23, 42, 0.08)",
    boxShadow: "0 6px 16px rgba(15, 23, 42, 0.05)"
  };
  const meetingStats = safeReportData.meetingStats || DEFAULT_REPORT_DATA.meetingStats;
  const pipelineStats = safeReportData.pipelineStats || DEFAULT_REPORT_DATA.pipelineStats;
  const pipelineStatusData = {
    labels: (pipelineStats.currentPipelineCount || []).map((item) => item.status || "-"),
    datasets: [{
      label: "Empresas por Status",
      data: (pipelineStats.currentPipelineCount || []).map((item) => Number(item.count) || 0),
      backgroundColor: COLOR_PALETTE.pipelineStatus,
      borderColor: "#fff",
      borderWidth: 2,
      hoverOffset: 8
    }]
  };
  const meetingsByStatusData = {
    labels: (meetingStats.meetingsByStatus || []).map((item) => item.status || "-"),
    datasets: [{
      label: "Reuni\xF5es por Status",
      data: (meetingStats.meetingsByStatus || []).map((item) => Number(item.count) || 0),
      borderColor: "rgba(37, 99, 235, 1)",
      backgroundColor: "rgba(37, 99, 235, 0.14)",
      fill: true,
      tension: 0.35,
      pointRadius: 4,
      pointHoverRadius: 5,
      pointBackgroundColor: "rgba(37, 99, 235, 1)"
    }]
  };
  const meetingsByTypeData = {
    labels: (meetingStats.meetingsByType || []).map((item) => item.type || "-"),
    datasets: [{
      label: "Reuni\xF5es por Tipo",
      data: (meetingStats.meetingsByType || []).map((item) => Number(item.count) || 0),
      backgroundColor: COLOR_PALETTE.meetingType,
      borderColor: "#fff",
      borderWidth: 2,
      hoverOffset: 8
    }]
  };
  const sdrPerformanceData = {
    labels: (pipelineStats.sdrPerformance || []).map((sdr) => sdr?.name || "-"),
    datasets: [
      {
        label: "Reuni\xF5es Agendadas",
        data: (pipelineStats.sdrPerformance || []).map((sdr) => Number(sdr?.meetingsScheduled) || 0),
        backgroundColor: COLOR_PALETTE.sdrPerformance.meetings,
        borderRadius: 999,
        borderSkipped: false,
        maxBarThickness: 14,
        categoryPercentage: 0.62,
        barPercentage: 0.65
      },
      {
        label: "Clientes Convertidos",
        data: (pipelineStats.sdrPerformance || []).map((sdr) => Number(sdr?.clientsConverted) || 0),
        backgroundColor: COLOR_PALETTE.sdrPerformance.conversions,
        borderRadius: 999,
        borderSkipped: false,
        maxBarThickness: 14,
        categoryPercentage: 0.62,
        barPercentage: 0.65
      }
    ]
  };
  const donutOptions = {
    maintainAspectRatio: false,
    responsive: true,
    cutout: "72%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, pointStyle: "circle", padding: 14, boxWidth: 8, boxHeight: 8 }
      }
    }
  };
  const barOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { usePointStyle: true, pointStyle: "circle", boxWidth: 8, boxHeight: 8 } }
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0, stepSize: 1 }, grid: { color: "rgba(15, 23, 42, 0.08)" } },
      x: { grid: { display: false } }
    }
  };
  const lineOptions = {
    ...barOptions,
    plugins: {
      ...barOptions.plugins,
      legend: { display: false }
    }
  };
  return /* @__PURE__ */ jsxDEV(Box, { children: /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 3, children: [
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 2, children: [
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(Card, { elevation: 0, sx: metricCardSx, children: /* @__PURE__ */ jsxDEV(CardContent, { children: [
        /* @__PURE__ */ jsxDEV(Typography, { color: "textSecondary", gutterBottom: true, variant: "body2", children: "Total de Reuni\xF5es" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 159,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", sx: { fontWeight: 700 }, children: meetingStats.totalMeetings || 0 }, void 0, false, {
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
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(Card, { elevation: 0, sx: metricCardSx, children: /* @__PURE__ */ jsxDEV(CardContent, { children: [
        /* @__PURE__ */ jsxDEV(Typography, { color: "textSecondary", gutterBottom: true, variant: "body2", children: "Novos Leads" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 171,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", sx: { fontWeight: 700 }, children: pipelineStats.newLeads || 0 }, void 0, false, {
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
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(Card, { elevation: 0, sx: metricCardSx, children: /* @__PURE__ */ jsxDEV(CardContent, { children: [
        /* @__PURE__ */ jsxDEV(Typography, { color: "textSecondary", gutterBottom: true, variant: "body2", children: "Clientes Operando" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 183,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", sx: { fontWeight: 700 }, children: pipelineStats.newClients || 0 }, void 0, false, {
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
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(Card, { elevation: 0, sx: metricCardSx, children: /* @__PURE__ */ jsxDEV(CardContent, { children: [
        /* @__PURE__ */ jsxDEV(Typography, { color: "textSecondary", gutterBottom: true, variant: "body2", children: "Taxa de Convers\xE3o" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 195,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", sx: { fontWeight: 700 }, children: pipelineStats.conversionRate !== void 0 ? `${pipelineStats.conversionRate}%` : "0%" }, void 0, false, {
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
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, lg: 5, children: /* @__PURE__ */ jsxDEV(Paper, { elevation: 0, sx: chartPaperSx, children: [
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
        PolarArea,
        {
          data: pipelineStatusData,
          options: {
            ...donutOptions,
            cutout: void 0
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
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, lg: 7, children: /* @__PURE__ */ jsxDEV(Paper, { elevation: 0, sx: chartPaperSx, children: [
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
            ...barOptions,
            indexAxis: "y",
            scales: {
              ...barOptions.scales,
              y: {
                ...barOptions.scales.x,
                grid: { display: false },
                title: { display: false }
              },
              x: {
                ...barOptions.scales.y,
                title: { display: true, text: "Quantidade" }
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
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, lg: 7, children: /* @__PURE__ */ jsxDEV(Paper, { elevation: 0, sx: chartPaperSx, children: [
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
        Line,
        {
          data: meetingsByStatusData,
          options: lineOptions
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
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, lg: 5, children: /* @__PURE__ */ jsxDEV(Paper, { elevation: 0, sx: chartPaperSx, children: [
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
        Doughnut,
        {
          data: meetingsByTypeData,
          options: donutOptions
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
