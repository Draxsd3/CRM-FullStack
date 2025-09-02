import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Button,
  Chip,
  Paper
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BusinessIcon from "@mui/icons-material/Business";
import CompanyForm from "./CompanyForm";
import { formatCnpj } from "../../utils/formatters";
import { formatDate } from "../../utils/dateUtils";
const CompanyInformation = ({ company, isEditing, setIsEditing, handleCompanyUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Lead":
        return "default";
      case "Reuni\xE3o Agendada":
        return "info";
      case "Aguardando Documenta\xE7\xE3o":
        return "warning";
      case "Cadastro Efetivado":
        return "success";
      case "Cliente Operando":
        return "primary";
      default:
        return "default";
    }
  };
  return /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, sx: { p: 2 }, children: [
    /* @__PURE__ */ jsxDEV(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, children: [
      /* @__PURE__ */ jsxDEV(Box, { display: "flex", alignItems: "center", children: [
        /* @__PURE__ */ jsxDEV(BusinessIcon, { sx: { mr: 1 } }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 39,
          columnNumber: 11
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", children: "Informa\xE7\xF5es da Empresa" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 40,
          columnNumber: 11
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 38,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          variant: "outlined",
          startIcon: /* @__PURE__ */ jsxDEV(EditIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 44,
            columnNumber: 22
          }),
          onClick: () => setIsEditing(true),
          children: "Editar"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 42,
          columnNumber: 9
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 37,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Divider, { sx: { mb: 2 } }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 50,
      columnNumber: 7
    }),
    isEditing ? /* @__PURE__ */ jsxDEV(
      CompanyForm,
      {
        initialValues: company,
        onSubmit: handleCompanyUpdate,
        isEditing: true
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 53,
        columnNumber: 9
      }
    ) : /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 2, children: [
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", children: "CNPJ" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 61,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", children: formatCnpj(company.cnpj) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 62,
          columnNumber: 13
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 60,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", children: "Status no Pipeline" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 65,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(
          Chip,
          {
            label: company.pipelineStatus,
            color: getStatusColor(company.pipelineStatus),
            size: "small"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 66,
            columnNumber: 13
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 64,
        columnNumber: 11
      }),
      company.qualificationStatus && /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", children: "Qualifica\xE7\xE3o" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 74,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(
          Chip,
          {
            label: company.qualificationStatus,
            color: company.qualificationStatus === "Lead Qualificado" ? "success" : "error",
            size: "small"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 75,
            columnNumber: 15
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 73,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", children: "Contato" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 83,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", children: company.contactName }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 84,
          columnNumber: 13
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 82,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", children: "Telefone" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 87,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", children: company.contactPhone }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 88,
          columnNumber: 13
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 86,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", children: "E-mail" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 91,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", children: company.email }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 92,
          columnNumber: 13
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 90,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", children: "Endere\xE7o" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 95,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", children: [
          company.address && `${company.address}, `,
          company.city && `${company.city}`,
          company.state && ` - ${company.state}`
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 96,
          columnNumber: 13
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 94,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", children: "Data de Cadastro" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 103,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", children: formatDate(company.createdAt) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 104,
          columnNumber: 13
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 102,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "textSecondary", children: "\xDAltima Atualiza\xE7\xE3o" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 107,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", children: formatDate(company.updatedAt) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 108,
          columnNumber: 13
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 106,
        columnNumber: 11
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 59,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 36,
    columnNumber: 5
  });
};
var stdin_default = CompanyInformation;
export {
  stdin_default as default
};
