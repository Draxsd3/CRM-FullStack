import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  CircularProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/dateUtils";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";
const kycService = {
  getReports: async (companyId) => {
    try {
      const response = await api.get(`/companies/${companyId}/kyc-reports`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching KYC reports:", error);
      toast.error("Erro ao carregar relat\xF3rios KYC");
      return [];
    }
  },
  addReport: async (reportData) => {
    try {
      const response = await api.post("/companies/kyc-reports", reportData);
      return response.data.data;
    } catch (error) {
      console.error("Error adding KYC report:", error);
      toast.error("Erro ao adicionar relat\xF3rio KYC");
      throw error;
    }
  },
  generatePDF: async (reportId) => {
    try {
      const response = await api.get(`/companies/kyc-reports/${reportId}/pdf`, {
        responseType: "blob"
      });
      return response.data;
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erro ao gerar PDF");
      throw error;
    }
  }
};
const CompanyKYC = ({ company }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newReport, setNewReport] = useState({
    content: "",
    reportType: "Initial Impression"
  });
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (company?.id) {
      fetchReports();
    }
  }, [company]);
  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await kycService.getReports(company.id);
      setReports(data);
    } catch (error) {
      console.error("Error fetching KYC reports:", error);
      toast.error("Erro ao carregar relat\xF3rios KYC");
    } finally {
      setLoading(false);
    }
  };
  const handleAddReport = async () => {
    try {
      if (!newReport.content.trim()) {
        toast.error("O conte\xFAdo do relat\xF3rio \xE9 obrigat\xF3rio");
        return;
      }
      setLoading(true);
      const reportData = {
        ...newReport,
        companyId: company.id,
        userId: user.id
      };
      await kycService.addReport(reportData);
      toast.success("Relat\xF3rio KYC adicionado com sucesso");
      setOpenAddDialog(false);
      setNewReport({
        content: "",
        reportType: "Initial Impression"
      });
      await fetchReports();
    } catch (error) {
      console.error("Error adding KYC report:", error);
      toast.error("Erro ao adicionar relat\xF3rio KYC");
    } finally {
      setLoading(false);
    }
  };
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setOpenViewDialog(true);
  };
  const handleGeneratePDF = async (reportId) => {
    try {
      setLoading(true);
      const pdfBlob = await kycService.generatePDF(reportId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kyc-report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("PDF gerado com sucesso");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erro ao gerar PDF");
    } finally {
      setLoading(false);
    }
  };
  const renderPreviewPanel = () => {
    if (loading && reports.length === 0) {
      return /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex", justifyContent: "center", p: 2 }, children: /* @__PURE__ */ jsxDEV(CircularProgress, { size: 24 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 165,
        columnNumber: 11
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 164,
        columnNumber: 9
      });
    }
    if (reports.length === 0) {
      return /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "text.secondary", sx: { p: 2, textAlign: "center" }, children: "Nenhum relat\xF3rio KYC registrado" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 172,
        columnNumber: 9
      });
    }
    const latestReport = reports[0];
    return /* @__PURE__ */ jsxDEV(Box, { sx: { p: 2 }, children: [
      /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "subtitle2", children: [
          "\xDAltimo relat\xF3rio (",
          formatDate(latestReport.createdAt),
          ")"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 183,
          columnNumber: 11
        }),
        /* @__PURE__ */ jsxDEV(Chip, { size: "small", label: latestReport.reportType, color: "primary", variant: "outlined" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 186,
          columnNumber: 11
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 182,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "text.secondary", sx: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineHeight: 1.2,
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical"
      }, children: latestReport.content }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 188,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 181,
      columnNumber: 7
    });
  };
  return /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, sx: { mt: 2 }, children: [
    /* @__PURE__ */ jsxDEV(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", children: "KYC & Impress\xF5es" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 205,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(Box, { children: [
        /* @__PURE__ */ jsxDEV(
          Button,
          {
            variant: "contained",
            color: "primary",
            startIcon: /* @__PURE__ */ jsxDEV(AddIcon, {}, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 210,
              columnNumber: 24
            }),
            size: "small",
            onClick: () => setOpenAddDialog(true),
            children: "Adicionar"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 207,
            columnNumber: 11
          }
        ),
        /* @__PURE__ */ jsxDEV(
          Button,
          {
            variant: "outlined",
            color: "primary",
            sx: { ml: 1 },
            size: "small",
            onClick: () => setOpenViewDialog(true),
            disabled: reports.length === 0,
            children: "Ver Todos"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 216,
            columnNumber: 11
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 206,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 204,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Divider, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 229,
      columnNumber: 7
    }),
    renderPreviewPanel(),
    /* @__PURE__ */ jsxDEV(Dialog, { open: openAddDialog, onClose: () => setOpenAddDialog(false), fullWidth: true, maxWidth: "md", children: [
      /* @__PURE__ */ jsxDEV(DialogTitle, { children: "Adicionar Relat\xF3rio KYC" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 235,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(DialogContent, { children: [
        /* @__PURE__ */ jsxDEV(Box, { sx: { mb: 2, mt: 1 }, children: /* @__PURE__ */ jsxDEV(
          TextField,
          {
            select: true,
            label: "Tipo de Relat\xF3rio",
            value: newReport.reportType,
            onChange: (e) => setNewReport({ ...newReport, reportType: e.target.value }),
            fullWidth: true,
            SelectProps: { native: true },
            children: [
              /* @__PURE__ */ jsxDEV("option", { value: "Initial Impression", children: "Impress\xE3o Inicial" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 246,
                columnNumber: 15
              }),
              /* @__PURE__ */ jsxDEV("option", { value: "Follow-up", children: "Follow-up" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 247,
                columnNumber: 15
              }),
              /* @__PURE__ */ jsxDEV("option", { value: "Credit Analysis", children: "An\xE1lise de Cr\xE9dito" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 248,
                columnNumber: 15
              }),
              /* @__PURE__ */ jsxDEV("option", { value: "Compliance Check", children: "Verifica\xE7\xE3o de Compliance" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 249,
                columnNumber: 15
              }),
              /* @__PURE__ */ jsxDEV("option", { value: "Financial Assessment", children: "Avalia\xE7\xE3o Financeira" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 250,
                columnNumber: 15
              })
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 238,
            columnNumber: 13
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 237,
          columnNumber: 11
        }),
        /* @__PURE__ */ jsxDEV(
          TextField,
          {
            label: "Conte\xFAdo do Relat\xF3rio",
            multiline: true,
            rows: 8,
            value: newReport.content,
            onChange: (e) => setNewReport({ ...newReport, content: e.target.value }),
            fullWidth: true,
            placeholder: "Descreva suas impress\xF5es, an\xE1lises ou informa\xE7\xF5es importantes sobre o cliente...",
            required: true
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 253,
            columnNumber: 11
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 236,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(DialogActions, { children: [
        /* @__PURE__ */ jsxDEV(Button, { onClick: () => setOpenAddDialog(false), children: "Cancelar" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 265,
          columnNumber: 11
        }),
        /* @__PURE__ */ jsxDEV(
          Button,
          {
            onClick: handleAddReport,
            variant: "contained",
            color: "primary",
            disabled: loading || !newReport.content.trim(),
            children: loading ? "Salvando..." : "Salvar"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 266,
            columnNumber: 11
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 264,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 234,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Dialog, { open: openViewDialog, onClose: () => setOpenViewDialog(false), fullWidth: true, maxWidth: "md", children: reports.length === 0 ? /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", sx: { textAlign: "center", py: 3 }, children: "Nenhum relat\xF3rio encontrado para esta empresa." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 280,
      columnNumber: 11
    }) : /* @__PURE__ */ jsxDEV(List, { children: reports.map((report) => /* @__PURE__ */ jsxDEV(Paper, { sx: { mb: 2, p: 2 }, children: [
      /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "subtitle1", fontWeight: "bold", children: report.reportType }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 288,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(
          IconButton,
          {
            color: "primary",
            onClick: () => handleGeneratePDF(report.id),
            size: "small",
            children: /* @__PURE__ */ jsxDEV(PictureAsPdfIcon, {}, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 296,
              columnNumber: 21
            })
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 291,
            columnNumber: 19
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 287,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", sx: { mb: 2, whiteSpace: "pre-line" }, children: report.content }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 299,
        columnNumber: 17
      }),
      /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "caption", color: "text.secondary", children: [
          "Criado por: ",
          report.userName
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 303,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "caption", color: "text.secondary", children: formatDate(report.createdAt) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 306,
          columnNumber: 19
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 302,
        columnNumber: 17
      })
    ] }, report.id, true, {
      fileName: "<stdin>",
      lineNumber: 286,
      columnNumber: 15
    })) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 284,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 278,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(
      Dialog,
      {
        open: openViewDialog && selectedReport !== null,
        onClose: () => setSelectedReport(null),
        fullWidth: true,
        maxWidth: "md",
        children: selectedReport && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(DialogTitle, { children: selectedReport.reportType }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 325,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV(DialogContent, { children: [
            /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", sx: { mb: 3, whiteSpace: "pre-line" }, children: selectedReport.content }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 327,
              columnNumber: 15
            }),
            /* @__PURE__ */ jsxDEV(Divider, { sx: { mb: 2 } }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 330,
              columnNumber: 15
            }),
            /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
              /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "text.secondary", children: [
                "Criado por: ",
                selectedReport.userName
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 332,
                columnNumber: 17
              }),
              /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "text.secondary", children: formatDate(selectedReport.createdAt) }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 335,
                columnNumber: 17
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 331,
              columnNumber: 15
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 326,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV(DialogActions, { children: [
            /* @__PURE__ */ jsxDEV(
              Button,
              {
                startIcon: /* @__PURE__ */ jsxDEV(PictureAsPdfIcon, {}, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 342,
                  columnNumber: 28
                }),
                onClick: () => handleGeneratePDF(selectedReport.id),
                color: "primary",
                children: "Gerar PDF"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 341,
                columnNumber: 15
              }
            ),
            /* @__PURE__ */ jsxDEV(Button, { onClick: () => setSelectedReport(null), children: "Fechar" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 348,
              columnNumber: 15
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 340,
            columnNumber: 13
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 324,
          columnNumber: 11
        })
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 317,
        columnNumber: 7
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 203,
    columnNumber: 5
  });
};
var stdin_default = CompanyKYC;
export {
  stdin_default as default
};
