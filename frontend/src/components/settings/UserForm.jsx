import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import {
  TextField,
  Button,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
const UserSchema = Yup.object().shape({
  name: Yup.string().required("Nome \xE9 obrigat\xF3rio").min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: Yup.string().email("E-mail inv\xE1lido").required("E-mail \xE9 obrigat\xF3rio"),
  password: Yup.string().min(6, "Senha deve ter pelo menos 6 caracteres").when("isEditing", {
    is: true,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.required("Senha \xE9 obrigat\xF3ria")
  }),
  role: Yup.string().required("Perfil \xE9 obrigat\xF3rio").oneOf(["ADM", "Supervisor", "SDR", "Closer"], "Perfil inv\xE1lido"),
  closerSpecialty: Yup.string().when("role", {
    is: "Closer",
    then: (schema) => schema.required("Especialidade \xE9 obrigat\xF3ria para Closer"),
    otherwise: (schema) => schema.optional()
  })
});
const UserForm = ({ initialValues, onSubmit, onCancel, isEditing }) => {
  const formik = useFormik({
    initialValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      password: "",
      role: initialValues?.role || "SDR",
      closerSpecialty: initialValues?.closerSpecialty || "",
      isEditing: Boolean(isEditing)
    },
    validationSchema: UserSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const { isEditing: isEditing2, ...userData } = values;
        if (!userData.password) {
          delete userData.password;
        }
        if (userData.role !== "Closer") {
          delete userData.closerSpecialty;
        }
        await onSubmit(userData);
        if (!isEditing2) {
          resetForm();
        }
        toast.success(`Usu\xE1rio ${isEditing2 ? "atualizado" : "cadastrado"} com sucesso`);
      } catch (error) {
        console.error("Erro ao salvar usu\xE1rio:", error);
        toast.error("Erro ao salvar usu\xE1rio");
      } finally {
        setSubmitting(false);
      }
    }
  });
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV(DialogTitle, { children: isEditing ? "Editar Usu\xE1rio" : "Novo Usu\xE1rio" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 86,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(DialogContent, { children: /* @__PURE__ */ jsxDEV("form", { onSubmit: formik.handleSubmit, children: /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 2, sx: { mt: 1 }, children: [
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
        TextField,
        {
          fullWidth: true,
          id: "name",
          name: "name",
          label: "Nome",
          value: formik.values.name,
          onChange: formik.handleChange,
          error: formik.touched.name && Boolean(formik.errors.name),
          helperText: formik.touched.name && formik.errors.name
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 93,
          columnNumber: 15
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 92,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
        TextField,
        {
          fullWidth: true,
          id: "email",
          name: "email",
          label: "E-mail",
          type: "email",
          value: formik.values.email,
          onChange: formik.handleChange,
          error: formik.touched.email && Boolean(formik.errors.email),
          helperText: formik.touched.email && formik.errors.email,
          disabled: isEditing
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 106,
          columnNumber: 15
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 105,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
        TextField,
        {
          fullWidth: true,
          id: "password",
          name: "password",
          label: isEditing ? "Nova Senha (deixe em branco para manter a atual)" : "Senha",
          type: "password",
          value: formik.values.password,
          onChange: formik.handleChange,
          error: formik.touched.password && Boolean(formik.errors.password),
          helperText: formik.touched.password && formik.errors.password
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 121,
          columnNumber: 15
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 120,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
        TextField,
        {
          fullWidth: true,
          id: "role",
          name: "role",
          select: true,
          label: "Perfil",
          value: formik.values.role,
          onChange: formik.handleChange,
          error: formik.touched.role && Boolean(formik.errors.role),
          helperText: formik.touched.role && formik.errors.role,
          children: [
            /* @__PURE__ */ jsxDEV(MenuItem, { value: "ADM", children: "Administrador" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 146,
              columnNumber: 17
            }),
            /* @__PURE__ */ jsxDEV(MenuItem, { value: "Supervisor", children: "Supervisor" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 147,
              columnNumber: 17
            }),
            /* @__PURE__ */ jsxDEV(MenuItem, { value: "SDR", children: "SDR" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 148,
              columnNumber: 17
            }),
            /* @__PURE__ */ jsxDEV(MenuItem, { value: "Closer", children: "Closer" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 149,
              columnNumber: 17
            })
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 135,
          columnNumber: 15
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 134,
        columnNumber: 13
      }),
      formik.values.role === "Closer" && /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
        TextField,
        {
          fullWidth: true,
          id: "closerSpecialty",
          name: "closerSpecialty",
          label: "Especialidade do Closer",
          value: formik.values.closerSpecialty,
          onChange: formik.handleChange,
          error: formik.touched.closerSpecialty && Boolean(formik.errors.closerSpecialty),
          helperText: formik.touched.closerSpecialty && formik.errors.closerSpecialty
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 155,
          columnNumber: 17
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 154,
        columnNumber: 15
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 91,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 90,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 89,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(DialogActions, { children: [
      /* @__PURE__ */ jsxDEV(Button, { onClick: onCancel, children: "Cancelar" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 171,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          onClick: formik.handleSubmit,
          variant: "contained",
          color: "primary",
          disabled: formik.isSubmitting,
          children: isEditing ? "Atualizar" : "Cadastrar"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 172,
          columnNumber: 9
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 170,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 85,
    columnNumber: 5
  });
};
var stdin_default = UserForm;
export {
  stdin_default as default
};
