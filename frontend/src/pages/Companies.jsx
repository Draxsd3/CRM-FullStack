import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Tabs, Tab, Button, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import CompanyList from "../components/companies/CompanyList";
import CompanyForm from "../components/companies/CompanyForm";
import companyService from "../services/companyService";
import pipelineService from "../services/pipelineService";
import { AuthContext } from "../contexts/AuthContext";
const Companies = () => {
  const LIST_CONFIG = {
    /** Maximum number of companies to display per page */
    MAX_COMPANIES_PER_PAGE: 100,
    /** Enable detailed logging for company fetching */
    ENABLE_DETAILED_LOGGING: process.env.NODE_ENV === "development",
    /** Default sorting option */
    DEFAULT_SORT: "createdAt:DESC",
    /** Tabs configuration */
    TABS: {
      ALL_COMPANIES: 0,
      DISQUALIFIED: 1,
      CREATE_COMPANY: 2
    }
  };
  const [tabValue, setTabValue] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [disqualifiedCompanies, setDisqualifiedCompanies] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { user, hasAccess } = useContext(AuthContext);
  useEffect(() => {
    fetchCompanies();
  }, []);
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      console.log("Fetching companies...");
      const systemCompanies = await companyService.getAllCompaniesInSystem();
      console.log("Fetched companies from API:", systemCompanies);
      const qualified = Array.isArray(systemCompanies) ? systemCompanies.filter((c) => c.qualificationStatus !== "Lead Desqualificado") : [];
      const disqualified = Array.isArray(systemCompanies) ? systemCompanies.filter((c) => c.qualificationStatus === "Lead Desqualificado") : [];
      setCompanies(qualified);
      setDisqualifiedCompanies(disqualified);
      setAllCompanies(systemCompanies);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
      toast.error("Erro ao carregar empresas");
    } finally {
      setLoading(false);
    }
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue !== LIST_CONFIG.TABS.CREATE_COMPANY) {
      setShowForm(false);
    }
  };
  const handleSubmit = async (companyData) => {
    try {
      setSubmitting(true);
      companyData.pipelineStatus = "Lead";
      console.log("Submitting company with data:", companyData);
      const newCompany = await companyService.createCompany(companyData);
      console.log("Company created successfully:", newCompany);
      toast.success("Empresa cadastrada com sucesso e adicionada ao pipeline como Lead");
      await fetchCompanies();
      window.dispatchEvent(new CustomEvent("refreshPipeline", { detail: { action: "companyCreated" } }));
      console.log("\u{1F504} refreshPipeline event dispatched");
      setShowForm(false);
      setTabValue(LIST_CONFIG.TABS.ALL_COMPANIES);
      setTimeout(() => {
        window.location.href = "/pipeline";
      }, 1500);
      return newCompany;
    } catch (error) {
      console.error("Erro ao cadastrar empresa:", error);
      toast.error(`Erro ao cadastrar empresa: ${error.message || "Erro desconhecido"}`);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };
  const handleNewCompany = () => {
    setShowForm(true);
    setTabValue(LIST_CONFIG.TABS.CREATE_COMPANY);
  };
  return /* @__PURE__ */ jsxDEV(Box, { children: [
    /* @__PURE__ */ jsxDEV(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", children: "Empresas" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 131,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          variant: "contained",
          color: "primary",
          startIcon: /* @__PURE__ */ jsxDEV(AddIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 135,
            columnNumber: 22
          }),
          onClick: handleNewCompany,
          children: "Nova Empresa"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 132,
          columnNumber: 9
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 130,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Box, { sx: { borderBottom: 1, borderColor: "divider", mb: 3 }, children: /* @__PURE__ */ jsxDEV(Tabs, { value: tabValue, onChange: handleTabChange, children: [
      /* @__PURE__ */ jsxDEV(Tab, { label: "Todas as Empresas" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 144,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(Tab, { label: "Leads Desqualificados" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 145,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(Tab, { label: "Cadastrar Empresa" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 146,
        columnNumber: 11
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 143,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 142,
      columnNumber: 7
    }),
    loading && !showForm ? /* @__PURE__ */ jsxDEV(Box, { display: "flex", justifyContent: "center", my: 4, children: /* @__PURE__ */ jsxDEV(CircularProgress, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 152,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 151,
      columnNumber: 9
    }) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
      tabValue === LIST_CONFIG.TABS.ALL_COMPANIES && /* @__PURE__ */ jsxDEV(
        CompanyList,
        {
          companies,
          showAssignedUser: true,
          title: "Todas as Empresas"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 157,
          columnNumber: 13
        }
      ),
      tabValue === LIST_CONFIG.TABS.DISQUALIFIED && /* @__PURE__ */ jsxDEV(
        CompanyList,
        {
          companies: disqualifiedCompanies,
          title: "Leads Desqualificados"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 165,
          columnNumber: 13
        }
      ),
      (tabValue === LIST_CONFIG.TABS.CREATE_COMPANY || showForm) && /* @__PURE__ */ jsxDEV(
        CompanyForm,
        {
          onSubmit: handleSubmit,
          isSubmitting: submitting
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 172,
          columnNumber: 13
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 155,
      columnNumber: 9
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 129,
    columnNumber: 5
  });
};
var stdin_default = Companies;
export {
  stdin_default as default
};
