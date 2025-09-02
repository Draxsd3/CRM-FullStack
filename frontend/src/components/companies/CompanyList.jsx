import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Box,
  Chip,
  TablePagination
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
const CompanyList = ({
  companies,
  showAssignedUser = false,
  title = "Empresas"
}) => {
  const LIST_CONFIG = {
    /** Maximum search term length */
    MAX_SEARCH_LENGTH: 100,
    /** Minimum search term length to trigger search */
    MIN_SEARCH_LENGTH: 2,
    /** Enable case-sensitive search */
    CASE_SENSITIVE_SEARCH: false,
    /** Default pagination settings */
    DEFAULT_ROWS_PER_PAGE: 10,
    MAX_ROWS_PER_PAGE: 50,
    /** @tweakable Company display visual settings */
    COLOR_MAP: {
      "Lead": "default",
      "Reuni\xE3o Agendada": "info",
      "Aguardando Documenta\xE7\xE3o": "warning",
      "Cadastro Efetivado": "success",
      "Cliente Operando": "primary",
      "Lead Desqualificado": "error"
    }
  };
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(LIST_CONFIG.DEFAULT_ROWS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState("");
  const formatCnpj = (cnpj) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };
  const handleViewCompany = (id) => {
    navigate(`/companies/${id}`);
  };
  const handleSearchChange = (event) => {
    const value = event.target.value;
    const sanitizedValue = value.slice(0, LIST_CONFIG.MAX_SEARCH_LENGTH);
    setSearchTerm(sanitizedValue);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(Math.min(newRowsPerPage, LIST_CONFIG.MAX_ROWS_PER_PAGE));
    setPage(0);
  };
  const filteredCompanies = companies.filter((company) => {
    const searchTermLower = LIST_CONFIG.CASE_SENSITIVE_SEARCH ? searchTerm : searchTerm.toLowerCase();
    return searchTerm.length >= LIST_CONFIG.MIN_SEARCH_LENGTH ? company.name.toLowerCase().includes(searchTermLower) || company.cnpj.includes(searchTermLower) || company.contactName.toLowerCase().includes(searchTermLower) || company.email.toLowerCase().includes(searchTermLower) : true;
  });
  const paginatedCompanies = filteredCompanies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, children: /* @__PURE__ */ jsxDEV(Box, { p: 2, children: [
    /* @__PURE__ */ jsxDEV(
      TextField,
      {
        fullWidth: true,
        variant: "outlined",
        placeholder: "Buscar empresa por nome, CNPJ, contato ou email",
        value: searchTerm,
        onChange: handleSearchChange,
        InputProps: {
          startAdornment: /* @__PURE__ */ jsxDEV(InputAdornment, { position: "start", children: /* @__PURE__ */ jsxDEV(SearchIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 131,
            columnNumber: 17
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 130,
            columnNumber: 15
          })
        },
        sx: { mb: 2 }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 122,
        columnNumber: 9
      }
    ),
    /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", sx: { mb: 2 }, children: [
      title,
      " (",
      filteredCompanies.length,
      ")"
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 138,
      columnNumber: 9
    }),
    filteredCompanies.length === 0 ? /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", sx: { textAlign: "center", py: 4 }, children: "Nenhuma empresa encontrada." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 143,
      columnNumber: 11
    }) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(TableContainer, { component: Paper, variant: "outlined", children: /* @__PURE__ */ jsxDEV(Table, { children: [
        /* @__PURE__ */ jsxDEV(TableHead, { children: /* @__PURE__ */ jsxDEV(TableRow, { children: [
          /* @__PURE__ */ jsxDEV(TableCell, { children: "Nome" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 152,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV(TableCell, { children: "CNPJ" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 153,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV(TableCell, { children: "Contato" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 154,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV(TableCell, { children: "Status" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 155,
            columnNumber: 21
          }),
          showAssignedUser && /* @__PURE__ */ jsxDEV(TableCell, { children: "Respons\xE1vel" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 156,
            columnNumber: 42
          }),
          /* @__PURE__ */ jsxDEV(TableCell, { children: "Tipo" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 157,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV(TableCell, { children: "Cadastro" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 158,
            columnNumber: 21
          }),
          /* @__PURE__ */ jsxDEV(TableCell, { children: "A\xE7\xF5es" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 159,
            columnNumber: 21
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 151,
          columnNumber: 19
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 150,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV(TableBody, { children: paginatedCompanies.map((company) => /* @__PURE__ */ jsxDEV(TableRow, { hover: true, children: [
          /* @__PURE__ */ jsxDEV(TableCell, { children: company.name }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 165,
            columnNumber: 23
          }),
          /* @__PURE__ */ jsxDEV(TableCell, { children: formatCnpj(company.cnpj) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 166,
            columnNumber: 23
          }),
          /* @__PURE__ */ jsxDEV(TableCell, { children: company.contactName }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 167,
            columnNumber: 23
          }),
          /* @__PURE__ */ jsxDEV(TableCell, { children: /* @__PURE__ */ jsxDEV(
            Chip,
            {
              label: company.pipelineStatus,
              color: LIST_CONFIG.COLOR_MAP[company.pipelineStatus] || "default",
              size: "small"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 169,
              columnNumber: 25
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 168,
            columnNumber: 23
          }),
          showAssignedUser && /* @__PURE__ */ jsxDEV(TableCell, { children: company.AssignedUser?.name || "N\xE3o atribu\xEDdo" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 176,
            columnNumber: 25
          }),
          /* @__PURE__ */ jsxDEV(TableCell, { children: /* @__PURE__ */ jsxDEV(
            Chip,
            {
              label: company.ownerType || "N/A",
              color: company.ownerType === "SDR" ? "primary" : "secondary",
              size: "small"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 181,
              columnNumber: 25
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 180,
            columnNumber: 23
          }),
          /* @__PURE__ */ jsxDEV(TableCell, { children: formatDate(company.createdAt) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 187,
            columnNumber: 23
          }),
          /* @__PURE__ */ jsxDEV(TableCell, { children: /* @__PURE__ */ jsxDEV(
            IconButton,
            {
              color: "primary",
              size: "small",
              onClick: () => handleViewCompany(company.id),
              children: /* @__PURE__ */ jsxDEV(VisibilityIcon, {}, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 194,
                columnNumber: 27
              })
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 189,
              columnNumber: 25
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 188,
            columnNumber: 23
          })
        ] }, company.id, true, {
          fileName: "<stdin>",
          lineNumber: 164,
          columnNumber: 21
        })) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 162,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 149,
        columnNumber: 15
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 148,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(
        TablePagination,
        {
          rowsPerPageOptions: [5, 10, 25, 50],
          component: "div",
          count: filteredCompanies.length,
          rowsPerPage,
          page,
          onPageChange: handleChangePage,
          onRowsPerPageChange: handleChangeRowsPerPage,
          labelRowsPerPage: "Itens por p\xE1gina:",
          labelDisplayedRows: ({ from, to, count }) => `${from}-${to} de ${count}`
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 203,
          columnNumber: 13
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 147,
      columnNumber: 11
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 121,
    columnNumber: 7
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 120,
    columnNumber: 5
  });
};
var stdin_default = CompanyList;
export {
  stdin_default as default
};
