import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState } from "react";
import {
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
const ReportFilters = ({ onFilter, onExport }) => {
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));
  const [reportType, setReportType] = useState("all");
  const [exportFormat, setExportFormat] = useState("pdf");
  const handleFilter = () => {
    onFilter({
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      reportType
    });
  };
  const handleExport = () => {
    onExport({
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      reportType,
      format: exportFormat
    });
  };
  return /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, sx: { p: 2, mb: 3 }, children: /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 2, alignItems: "center", children: [
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(
      DatePicker,
      {
        label: "Data Inicial",
        value: startDate,
        onChange: (newValue) => setStartDate(newValue),
        slotProps: {
          textField: {
            fullWidth: true
          }
        }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 44,
        columnNumber: 11
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 43,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(
      DatePicker,
      {
        label: "Data Final",
        value: endDate,
        onChange: (newValue) => setEndDate(newValue),
        slotProps: {
          textField: {
            fullWidth: true
          }
        }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 56,
        columnNumber: 11
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 55,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(FormControl, { fullWidth: true, children: [
      /* @__PURE__ */ jsxDEV(InputLabel, { children: "Tipo de Relat\xF3rio" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 69,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(
        Select,
        {
          value: reportType,
          label: "Tipo de Relat\xF3rio",
          onChange: (e) => setReportType(e.target.value),
          children: [
            /* @__PURE__ */ jsxDEV(MenuItem, { value: "all", children: "Relat\xF3rio Completo" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 75,
              columnNumber: 15
            }),
            /* @__PURE__ */ jsxDEV(MenuItem, { value: "meetings", children: "Reuni\xF5es" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 76,
              columnNumber: 15
            }),
            /* @__PURE__ */ jsxDEV(MenuItem, { value: "pipeline", children: "Convers\xE3o no Pipeline" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 77,
              columnNumber: 15
            })
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 70,
          columnNumber: 13
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 68,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 67,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, md: 3, children: /* @__PURE__ */ jsxDEV(Box, { display: "flex", gap: 1, children: /* @__PURE__ */ jsxDEV(
      Button,
      {
        variant: "contained",
        color: "primary",
        fullWidth: true,
        startIcon: /* @__PURE__ */ jsxDEV(SearchIcon, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 87,
          columnNumber: 26
        }),
        onClick: handleFilter,
        children: "Filtrar"
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 83,
        columnNumber: 13
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 82,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 81,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(Box, { display: "flex", alignItems: "center", gap: 2, children: [
      /* @__PURE__ */ jsxDEV(FormControl, { sx: { minWidth: 120 }, children: [
        /* @__PURE__ */ jsxDEV(InputLabel, { children: "Formato" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 97,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(
          Select,
          {
            value: exportFormat,
            label: "Formato",
            onChange: (e) => setExportFormat(e.target.value),
            size: "small",
            children: [
              /* @__PURE__ */ jsxDEV(MenuItem, { value: "pdf", children: "PDF" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 104,
                columnNumber: 17
              }),
              /* @__PURE__ */ jsxDEV(MenuItem, { value: "excel", children: "Excel" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 105,
                columnNumber: 17
              })
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 98,
            columnNumber: 15
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 96,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          variant: "outlined",
          startIcon: /* @__PURE__ */ jsxDEV(FileDownloadIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 110,
            columnNumber: 26
          }),
          onClick: handleExport,
          children: "Exportar Relat\xF3rio"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 108,
          columnNumber: 13
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 95,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 94,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 42,
    columnNumber: 7
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 41,
    columnNumber: 5
  });
};
var stdin_default = ReportFilters;
export {
  stdin_default as default
};
