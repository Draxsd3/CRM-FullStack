import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Tabs,
  Tab,
  Dialog
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import companyService from "../services/companyService";
import meetingService from "../services/meetingService";
import CompanyInformation from "../components/companies/CompanyInformation";
import CompanyActions from "../components/companies/CompanyActions";
import CompanyMeetings from "../components/companies/CompanyMeetings";
import CompanyKYC from "../components/companies/CompanyKYC";
import HistoryLog from "../components/pipeline/HistoryLog";
import MeetingForm from "../components/calendar/MeetingForm";
import QualificationDialog from "../components/companies/dialogs/QualificationDialog";
import StatusDialog from "../components/companies/dialogs/StatusDialog";
const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [openMeetingDialog, setOpenMeetingDialog] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [openQualificationDialog, setOpenQualificationDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const companyData = await companyService.getCompanyById(id);
        setCompany(companyData);
        const allCompanies = await companyService.getAllCompanies();
        setCompanies(allCompanies);
        const meetingsData = await meetingService.getCompanyMeetings(id);
        setMeetings(meetingsData);
      } catch (error) {
        console.error("Erro ao carregar detalhes da empresa:", error);
        toast.error("Erro ao carregar detalhes da empresa");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleCompanyUpdate = async (companyData) => {
    try {
      const updatedCompany = await companyService.updateCompany(id, companyData);
      setCompany(updatedCompany);
      setIsEditing(false);
      return updatedCompany;
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
      throw error;
    }
  };
  const handleMeetingSubmit = async (meetingData) => {
    try {
      await meetingService.createMeeting(meetingData);
      const meetingsData = await meetingService.getCompanyMeetings(id);
      setMeetings(meetingsData);
      setOpenMeetingDialog(false);
      toast.success("Reuni\xE3o agendada com sucesso");
    } catch (error) {
      console.error("Erro ao agendar reuni\xE3o:", error);
      throw error;
    }
  };
  const handleQualificationChange = (newQualificationStatus) => {
    setCompany({
      ...company,
      qualificationStatus: newQualificationStatus
    });
  };
  const handleStatusChange = (newPipelineStatus) => {
    setCompany({
      ...company,
      pipelineStatus: newPipelineStatus
    });
  };
  if (loading) {
    return /* @__PURE__ */ jsxDEV(Typography, { children: "Carregando detalhes da empresa..." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 123,
      columnNumber: 12
    });
  }
  if (!company) {
    return /* @__PURE__ */ jsxDEV(Box, { textAlign: "center", mt: 5, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h5", children: "Empresa n\xE3o encontrada" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 129,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          startIcon: /* @__PURE__ */ jsxDEV(ArrowBackIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 131,
            columnNumber: 22
          }),
          onClick: () => navigate("/companies"),
          sx: { mt: 2 },
          children: "Voltar para Lista de Empresas"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 130,
          columnNumber: 9
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 128,
      columnNumber: 7
    });
  }
  return /* @__PURE__ */ jsxDEV(Box, { children: [
    /* @__PURE__ */ jsxDEV(Box, { display: "flex", alignItems: "center", mb: 3, children: [
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          startIcon: /* @__PURE__ */ jsxDEV(ArrowBackIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 145,
            columnNumber: 22
          }),
          onClick: () => navigate("/companies"),
          sx: { mr: 2 },
          children: "Voltar"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 144,
          columnNumber: 9
        }
      ),
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", component: "h1", children: company.name }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 151,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 143,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 3, children: [
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 6, children: /* @__PURE__ */ jsxDEV(
        CompanyInformation,
        {
          company,
          isEditing,
          setIsEditing,
          handleCompanyUpdate
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 159,
          columnNumber: 11
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 158,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 6, children: [
        /* @__PURE__ */ jsxDEV(
          CompanyActions,
          {
            company,
            setOpenMeetingDialog,
            setOpenStatusDialog,
            setOpenQualificationDialog
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 169,
            columnNumber: 11
          }
        ),
        /* @__PURE__ */ jsxDEV(CompanyKYC, { company }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 175,
          columnNumber: 11
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 168,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, children: [
        /* @__PURE__ */ jsxDEV(Tabs, { value: tabValue, onChange: handleTabChange, children: [
          /* @__PURE__ */ jsxDEV(Tab, { label: "Reuni\xF5es" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 182,
            columnNumber: 15
          }),
          /* @__PURE__ */ jsxDEV(Tab, { label: "Hist\xF3rico no Pipeline" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 183,
            columnNumber: 15
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 181,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(Box, { p: 3, children: [
          tabValue === 0 && /* @__PURE__ */ jsxDEV(
            CompanyMeetings,
            {
              meetings,
              setOpenMeetingDialog
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 187,
              columnNumber: 17
            }
          ),
          tabValue === 1 && /* @__PURE__ */ jsxDEV(HistoryLog, { companyId: id }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 194,
            columnNumber: 17
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 185,
          columnNumber: 13
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 180,
        columnNumber: 11
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 179,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 156,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(
      Dialog,
      {
        open: openMeetingDialog,
        onClose: () => setOpenMeetingDialog(false),
        maxWidth: "md",
        fullWidth: true,
        children: /* @__PURE__ */ jsxDEV(
          MeetingForm,
          {
            companies,
            initialValues: { companyId: parseInt(id) },
            onSubmit: handleMeetingSubmit,
            onCancel: () => setOpenMeetingDialog(false),
            isEditing: false
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 208,
            columnNumber: 9
          }
        )
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 202,
        columnNumber: 7
      }
    ),
    /* @__PURE__ */ jsxDEV(
      QualificationDialog,
      {
        open: openQualificationDialog,
        onClose: () => setOpenQualificationDialog(false),
        company,
        onQualificationChange: handleQualificationChange
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 218,
        columnNumber: 7
      }
    ),
    /* @__PURE__ */ jsxDEV(
      StatusDialog,
      {
        open: openStatusDialog,
        onClose: () => setOpenStatusDialog(false),
        company,
        onStatusChange: handleStatusChange
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 226,
        columnNumber: 7
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 142,
    columnNumber: 5
  });
};
var stdin_default = CompanyDetails;
export {
  stdin_default as default
};
