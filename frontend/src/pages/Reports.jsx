import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Alert } from "@mui/material";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import ReportFilters from "../components/reports/ReportFilters";
import ReportCharts from "../components/reports/ReportCharts";
import LoadingScreen from "../components/ui/LoadingScreen";
import reportService from "../services/reportService";
const Reports = () => {
  const DEFAULT_REPORT_PARAMS = {
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().endOf("month").format("YYYY-MM-DD"),
    reportType: "all"
  };
  const ERROR_CONFIG = {
    maxRetries: 3,
    retryDelay: 1e3
    // ms
  };
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  useEffect(() => {
    fetchReportData(DEFAULT_REPORT_PARAMS);
  }, []);
  const fetchReportData = async (params, isRetry = false) => {
    try {
      setLoading(true);
      setError(null);
      let data;
      switch (params.reportType) {
        case "meetings":
          data = await reportService.getMeetingStats(params.startDate, params.endDate);
          break;
        case "pipeline":
          data = await reportService.getPipelineConversionStats(params.startDate, params.endDate);
          break;
        default:
          data = await reportService.getFullReport(params.startDate, params.endDate);
      }
      const safeData = data || {
        meetingStats: {},
        pipelineStats: {}
      };
      setReportData(safeData);
      setRetryCount(0);
    } catch (error2) {
      console.error("Report fetch error:", error2);
      if (!isRetry && retryCount < ERROR_CONFIG.maxRetries) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          fetchReportData(params, true);
        }, ERROR_CONFIG.retryDelay);
      } else {
        setError("N\xE3o foi poss\xEDvel carregar os dados do relat\xF3rio");
        toast.error("Erro ao carregar relat\xF3rio");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleExport = async (exportParams) => {
    try {
      setLoading(true);
      const { startDate, endDate, format } = exportParams;
      let data;
      if (format === "pdf") {
        data = await reportService.exportReportPDF(startDate, endDate);
      } else {
        data = await reportService.exportReportExcel(startDate, endDate);
      }
      const blob = new Blob([data], {
        type: format === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio_crm_leads_${startDate}_a_${endDate}.${format === "pdf" ? "pdf" : "xlsx"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Relat\xF3rio exportado com sucesso em formato ${format.toUpperCase()}`);
    } catch (error2) {
      console.error("Erro ao exportar relat\xF3rio:", error2);
      toast.error("Erro ao exportar relat\xF3rio");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxDEV(Box, { sx: { pb: 2 }, children: [
    /* @__PURE__ */ jsxDEV(Paper, { elevation: 0, sx: {
      p: 2.5,
      mb: 2.5,
      borderRadius: 3,
      border: "1px solid rgba(15, 23, 42, 0.08)",
      background: "linear-gradient(95deg, #f8fbff 0%, #ffffff 48%, #f9fcff 100%)"
    }, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", sx: { fontWeight: 700 }, children: "Relat\xF3rios" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 123,
        columnNumber: 7
      }),
      /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", color: "text.secondary", children: "Acompanhe indicadores com visual mais claro e comparativo." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 123,
        columnNumber: 7
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 123,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(
      ReportFilters,
      {
        onFilter: (params) => fetchReportData(params),
        onExport: handleExport
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 125,
        columnNumber: 7
      }
    ),
    loading && /* @__PURE__ */ jsxDEV(LoadingScreen, { message: "Carregando dados do relatorio..." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 131,
      columnNumber: 9
    }),
    error && /* @__PURE__ */ jsxDEV(Alert, { severity: "error", sx: { mb: 3 }, children: error }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 137,
      columnNumber: 9
    }),
    !loading && !error && reportData && /* @__PURE__ */ jsxDEV(ReportCharts, { reportData }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 143,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 122,
    columnNumber: 5
  });
};
var stdin_default = Reports;
export {
  stdin_default as default
};
