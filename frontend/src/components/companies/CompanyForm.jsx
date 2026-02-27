import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress
} from "@mui/material";
import { toast } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import companyService from "../../services/companyService";
const CompanyForm = ({ initialValues, onSubmit, onCancel, isEditing, isSubmitting }) => {
  const VALIDATION_CONFIG = {
    /** Minimum name length */
    MIN_NAME_LENGTH: 2,
    /** Maximum name length */
    MAX_NAME_LENGTH: 100,
    /** Minimum password length */
    MIN_PASSWORD_LENGTH: 6,
    /** CNPJ validation strictness */
    CNPJ_VALIDATION_LEVEL: 2
    // 0: minimal, 1: basic, 2: strict
  };
  const ERROR_CONFIG = {
    /** Maximum number of validation errors to display */
    MAX_VALIDATION_ERRORS: 3,
    /** Enable detailed error logging */
    VERBOSE_ERROR_LOGGING: process.env.NODE_ENV === "development",
    /** Delay before showing error toast (ms) */
    ERROR_TOAST_DELAY: 300,
    /** Error message truncation length */
    MAX_ERROR_MESSAGE_LENGTH: 200
  };
  const [isLoadingCnpj, setIsLoadingCnpj] = React.useState(false);
  const CompanySchema = Yup.object().shape({
    name: Yup.string().min(VALIDATION_CONFIG.MIN_NAME_LENGTH, "Nome muito curto").max(VALIDATION_CONFIG.MAX_NAME_LENGTH, "Nome muito longo").required("Nome \xE9 obrigat\xF3rio"),
    cnpj: Yup.string().matches(/^\d{14}$/, "CNPJ deve conter exatamente 14 d\xEDgitos num\xE9ricos").test("valid-cnpj", "CNPJ inv\xE1lido", function(value) {
      if (!value) return false;
      const cleanedCnpj = value.replace(/\D/g, "");
      if (cleanedCnpj.length !== 14) return false;
      const invalidPatterns = [
        "00000000000000",
        "11111111111111",
        "22222222222222",
        "33333333333333",
        "44444444444444",
        "55555555555555",
        "66666666666666",
        "77777777777777",
        "88888888888888",
        "99999999999999"
      ];
      if (invalidPatterns.includes(cleanedCnpj)) return false;
      if (VALIDATION_CONFIG.CNPJ_VALIDATION_LEVEL === 2) {
        const calculateDigit = (baseNumber, weights) => {
          const sum = baseNumber.split("").map((digit, index) => parseInt(digit) * weights[index]).reduce((acc, curr) => acc + curr, 0);
          const remainder = sum % 11;
          return remainder < 2 ? 0 : 11 - remainder;
        };
        const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const baseFirstDigit = cleanedCnpj.slice(0, 12);
        const firstCheckDigit = calculateDigit(baseFirstDigit, firstWeights);
        if (parseInt(cleanedCnpj[12]) !== firstCheckDigit) return false;
        const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        const baseSecondDigit = cleanedCnpj.slice(0, 13);
        const secondCheckDigit = calculateDigit(baseSecondDigit, secondWeights);
        return parseInt(cleanedCnpj[13]) === secondCheckDigit;
      }
      return true;
    }).required("CNPJ \xE9 obrigat\xF3rio"),
    contactName: Yup.string().min(2, "Nome do contato muito curto").max(100, "Nome do contato muito longo").required("Nome do contato \xE9 obrigat\xF3rio"),
    contactPhone: Yup.string().matches(/^\d{10,11}$/, "Telefone deve ter 10 ou 11 d\xEDgitos").required("Telefone \xE9 obrigat\xF3rio"),
    email: Yup.string().email("E-mail inv\xE1lido").required("E-mail \xE9 obrigat\xF3rio"),
    address: Yup.string().max(255, "Endere\xE7o muito longo").optional(),
    city: Yup.string().max(100, "Cidade muito longa").optional(),
    state: Yup.string().max(2, "Use a sigla do estado").optional(),
    pipelineStatus: Yup.string().optional()
  });
  const defaultValues = {
    name: "",
    cnpj: "",
    contactName: "",
    contactPhone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pipelineStatus: "Lead"
    // Ensure this is always 'Lead'
  };
  const values = initialValues || defaultValues;
  const handleSubmit = async (values2, { setSubmitting, resetForm }) => {
    try {
      await CompanySchema.validate(values2, { abortEarly: false });
      const cleanedValues = {
        ...values2,
        cnpj: values2.cnpj.replace(/\D/g, ""),
        contactPhone: values2.contactPhone.replace(/\D/g, ""),
        pipelineStatus: "Lead"
        // CRITICAL: Always force status to 'Lead' for new companies
      };
      console.log("Submitting company form with values:", cleanedValues);
      const result = await onSubmit(cleanedValues);
      if (!isEditing) {
        resetForm();
        toast.success("Empresa cadastrada com sucesso e adicionada como Lead!");
        window.dispatchEvent(new CustomEvent("refreshPipeline"));
        console.log("\u26A1 Dispatched refreshPipeline event");
        setTimeout(() => {
          window.location.href = "/pipeline";
        }, 1500);
      } else {
        toast.success("Empresa atualizada com sucesso!");
      }
      return result;
    } catch (error) {
      console.error("Erro ao salvar empresa:", error);
      if (error.name === "ValidationError") {
        const errors = error.inner.slice(0, VALIDATION_CONFIG.MAX_VALIDATION_ERRORS).map((err) => err.message).join(", ");
        setTimeout(() => {
          toast.error(errors);
        }, 300);
      } else {
        const errorMessage = error.response?.data?.errors ? error.response.data.errors.map((e) => e.message).join(", ") : "Erro ao salvar empresa";
        toast.error(errorMessage);
      }
      throw error;
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, sx: { p: 3 }, children: [
    /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", gutterBottom: true, children: isEditing ? "Editar Empresa" : "Cadastrar Nova Empresa" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 200,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(
      Formik,
      {
        initialValues: values,
        validationSchema: CompanySchema,
        onSubmit: handleSubmit,
        enableReinitialize: true,
        children: ({ errors, touched, isSubmitting: formSubmitting, handleChange, values: values2, setFieldValue }) => {
          const handleCnpjLookup = async () => {
            const cleaned = (values2.cnpj || "").replace(/\D/g, "");
            if (cleaned.length !== 14) {
              toast.error("Informe um CNPJ valido com 14 digitos");
              return;
            }
            try {
              setIsLoadingCnpj(true);
              const data = await companyService.lookupCompanyByCnpj(cleaned);
              setFieldValue("cnpj", data.cnpj || cleaned);
              if (data.name) setFieldValue("name", data.name);
              if (data.contactName) setFieldValue("contactName", data.contactName);
              if (data.contactPhone) setFieldValue("contactPhone", data.contactPhone);
              if (data.email) setFieldValue("email", data.email);
              if (data.address) setFieldValue("address", data.address);
              if (data.city) setFieldValue("city", data.city);
              if (data.state) setFieldValue("state", data.state);
              toast.success("Dados importados da Receita com sucesso");
            } catch (error) {
              toast.error(error?.response?.data?.error || "Nao foi possivel buscar dados no CNPJ");
            } finally {
              setIsLoadingCnpj(false);
            }
          };

          return /* @__PURE__ */ jsxDEV(Form, { children: /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 2, children: [
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 6, children: /* @__PURE__ */ jsxDEV(
            Field,
            {
              as: TextField,
              name: "name",
              label: "Nome da Empresa",
              fullWidth: true,
              required: true,
              error: touched.name && Boolean(errors.name),
              helperText: touched.name && errors.name,
              onChange: handleChange,
              value: values2.name
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 214,
              columnNumber: 17
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 213,
            columnNumber: 15
          }),
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 6, children: /* @__PURE__ */ jsxDEV(
            Field,
            {
              as: TextField,
              name: "cnpj",
              label: "CNPJ (apenas n\xFAmeros)",
              fullWidth: true,
              required: true,
              error: touched.cnpj && Boolean(errors.cnpj),
              helperText: touched.cnpj && errors.cnpj,
              onChange: handleChange,
              value: values2.cnpj,
              disabled: isEditing,
              InputProps: {
                endAdornment: !isEditing ? /* @__PURE__ */ jsxDEV(InputAdornment, { position: "end", children: /* @__PURE__ */ jsxDEV(Tooltip, { title: "Buscar dados na Receita Federal", children: /* @__PURE__ */ jsxDEV(
                  IconButton,
                  {
                    onClick: handleCnpjLookup,
                    edge: "end",
                    disabled: isLoadingCnpj,
                    children: isLoadingCnpj ? /* @__PURE__ */ jsxDEV(CircularProgress, { size: 18 }, void 0, false, {
                      fileName: "<stdin>",
                      lineNumber: 227,
                      columnNumber: 17
                    }) : /* @__PURE__ */ jsxDEV(SearchIcon, {}, void 0, false, {
                      fileName: "<stdin>",
                      lineNumber: 227,
                      columnNumber: 17
                    })
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 227,
                    columnNumber: 17
                  }
                ) }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 227,
                  columnNumber: 17
                }) }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 227,
                  columnNumber: 17
                }) : null
              }
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 227,
              columnNumber: 17
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 226,
            columnNumber: 15
          }),
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 6, children: /* @__PURE__ */ jsxDEV(
            Field,
            {
              as: TextField,
              name: "contactName",
              label: "Nome do Contato",
              fullWidth: true,
              required: true,
              error: touched.contactName && Boolean(errors.contactName),
              helperText: touched.contactName && errors.contactName,
              onChange: handleChange,
              value: values2.contactName
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 241,
              columnNumber: 17
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 240,
            columnNumber: 15
          }),
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 6, children: /* @__PURE__ */ jsxDEV(
            Field,
            {
              as: TextField,
              name: "contactPhone",
              label: "Telefone",
              fullWidth: true,
              required: true,
              error: touched.contactPhone && Boolean(errors.contactPhone),
              helperText: touched.contactPhone && errors.contactPhone,
              onChange: handleChange,
              value: values2.contactPhone
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 254,
              columnNumber: 17
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 253,
            columnNumber: 15
          }),
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
            Field,
            {
              as: TextField,
              name: "email",
              label: "E-mail",
              fullWidth: true,
              required: true,
              error: touched.email && Boolean(errors.email),
              helperText: touched.email && errors.email,
              onChange: handleChange,
              value: values2.email
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 267,
              columnNumber: 17
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 266,
            columnNumber: 15
          }),
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
            Field,
            {
              as: TextField,
              name: "address",
              label: "Endere\xE7o",
              fullWidth: true,
              error: touched.address && Boolean(errors.address),
              helperText: touched.address && errors.address,
              onChange: handleChange,
              value: values2.address
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 280,
              columnNumber: 17
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 279,
            columnNumber: 15
          }),
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 8, children: /* @__PURE__ */ jsxDEV(
            Field,
            {
              as: TextField,
              name: "city",
              label: "Cidade",
              fullWidth: true,
              error: touched.city && Boolean(errors.city),
              helperText: touched.city && errors.city,
              onChange: handleChange,
              value: values2.city
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 292,
              columnNumber: 17
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 291,
            columnNumber: 15
          }),
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 4, children: /* @__PURE__ */ jsxDEV(
            Field,
            {
              as: TextField,
              name: "state",
              label: "Estado",
              select: true,
              fullWidth: true,
              error: touched.state && Boolean(errors.state),
              helperText: touched.state && errors.state,
              onChange: handleChange,
              value: values2.state,
              children: [
                /* @__PURE__ */ jsxDEV(MenuItem, { value: "", children: "Selecione" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 315,
                  columnNumber: 19
                }),
                [
                  { value: "AC", label: "Acre" },
                  { value: "AL", label: "Alagoas" },
                  { value: "AP", label: "Amap\xE1" },
                  { value: "AM", label: "Amazonas" },
                  { value: "BA", label: "Bahia" },
                  { value: "CE", label: "Cear\xE1" },
                  { value: "DF", label: "Distrito Federal" },
                  { value: "ES", label: "Esp\xEDrito Santo" },
                  { value: "GO", label: "Goi\xE1s" },
                  { value: "MA", label: "Maranh\xE3o" },
                  { value: "MT", label: "Mato Grosso" },
                  { value: "MS", label: "Mato Grosso do Sul" },
                  { value: "MG", label: "Minas Gerais" },
                  { value: "PA", label: "Par\xE1" },
                  { value: "PB", label: "Para\xEDba" },
                  { value: "PR", label: "Paran\xE1" },
                  { value: "PE", label: "Pernambuco" },
                  { value: "PI", label: "Piau\xED" },
                  { value: "RJ", label: "Rio de Janeiro" },
                  { value: "RN", label: "Rio Grande do Norte" },
                  { value: "RS", label: "Rio Grande do Sul" },
                  { value: "RO", label: "Rond\xF4nia" },
                  { value: "RR", label: "Roraima" },
                  { value: "SC", label: "Santa Catarina" },
                  { value: "SP", label: "S\xE3o Paulo" },
                  { value: "SE", label: "Sergipe" },
                  { value: "TO", label: "Tocantins" }
                ].map((option) => /* @__PURE__ */ jsxDEV(MenuItem, { value: option.value, children: option.label }, option.value, false, {
                  fileName: "<stdin>",
                  lineNumber: 345,
                  columnNumber: 21
                }))
              ]
            },
            void 0,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 304,
              columnNumber: 17
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 303,
            columnNumber: 15
          }),
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
            Field,
            {
              as: TextField,
              name: "pipelineStatus",
              label: "Status no Pipeline",
              value: "Lead",
              fullWidth: true,
              disabled: true
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 352,
              columnNumber: 17
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 351,
            columnNumber: 15
          }),
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
            Button,
            {
              type: "submit",
              variant: "contained",
              color: "primary",
              disabled: formSubmitting || isSubmitting,
              sx: { mt: 2 },
              children: formSubmitting || isSubmitting ? "Salvando..." : isEditing ? "Atualizar" : "Cadastrar"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 362,
              columnNumber: 17
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 361,
            columnNumber: 15
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 212,
          columnNumber: 13
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 211,
          columnNumber: 11
        });
        }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 204,
        columnNumber: 7
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 199,
    columnNumber: 5
  });
};
var stdin_default = CompanyForm;
export {
  stdin_default as default
};
