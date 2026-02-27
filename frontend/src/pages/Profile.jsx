import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  IconButton
} from "@mui/material";
import { toast } from "react-toastify";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { AuthContext } from "../contexts/AuthContext";
import userService from "../services/userService";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const Profile = () => {
  const { user, refreshUserData } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    phoneNumber: "",
    position: "",
    profilePhoto: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        bio: user.bio || "",
        phoneNumber: user.phoneNumber || "",
        position: user.position || "",
        profilePhoto: null
      });
      if (user.profilePhoto) {
        setPhotoPreview(`${API_BASE_URL}/uploads/${user.profilePhoto}`);
      }
    }
  }, [user]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePhoto: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("As senhas n\xE3o coincidem");
      return;
    }
    try {
      setLoading(true);
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      if (formData.password) {
        formPayload.append("password", formData.password);
      }
      formPayload.append("bio", formData.bio);
      formPayload.append("phoneNumber", formData.phoneNumber);
      formPayload.append("position", formData.position);
      if (formData.profilePhoto) {
        formPayload.append("profilePhoto", formData.profilePhoto);
      }
      await userService.updateProfile(formPayload);
      await refreshUserData();
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
        profilePhoto: null
      });
      toast.success("Perfil atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxDEV(Box, { children: [
    /* @__PURE__ */ jsxDEV(Typography, { variant: "h4", mb: 3, children: "Meu Perfil" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 112,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, sx: { p: 3 }, children: /* @__PURE__ */ jsxDEV(Box, { component: "form", onSubmit: handleSubmit, children: /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 3, alignItems: "flex-start", children: [
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 4, sx: { display: "flex", flexDirection: "column", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxDEV(
          Avatar,
          {
            src: photoPreview,
            sx: { width: 150, height: 150, mb: 2 }
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 118,
            columnNumber: 15
          }
        ),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            accept: "image/*",
            id: "profile-photo-input",
            type: "file",
            onChange: handlePhotoChange,
            style: { display: "none" }
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 122,
            columnNumber: 15
          }
        ),
        /* @__PURE__ */ jsxDEV("label", { htmlFor: "profile-photo-input", children: /* @__PURE__ */ jsxDEV(
          Button,
          {
            variant: "outlined",
            component: "span",
            startIcon: /* @__PURE__ */ jsxDEV(PhotoCameraIcon, {}, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 133,
              columnNumber: 30
            }),
            children: "Alterar Foto"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 130,
            columnNumber: 17
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 129,
          columnNumber: 15
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 117,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, md: 8, children: [
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", gutterBottom: true, children: "Informa\xE7\xF5es Pessoais" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 141,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(Divider, { sx: { mb: 2 } }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 142,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 2, children: [
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
            TextField,
            {
              fullWidth: true,
              label: "Nome",
              name: "name",
              value: formData.name,
              onChange: handleChange,
              required: true
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 146,
              columnNumber: 19
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 145,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
            TextField,
            {
              fullWidth: true,
              label: "E-mail",
              name: "email",
              value: formData.email,
              disabled: true,
              helperText: "O e-mail n\xE3o pode ser alterado"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 157,
              columnNumber: 19
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 156,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxDEV(
            TextField,
            {
              fullWidth: true,
              label: "Telefone",
              name: "phoneNumber",
              value: formData.phoneNumber,
              onChange: handleChange
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 168,
              columnNumber: 19
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 167,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxDEV(
            TextField,
            {
              fullWidth: true,
              label: "Cargo",
              name: "position",
              value: formData.position,
              onChange: handleChange
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 178,
              columnNumber: 19
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 177,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, children: /* @__PURE__ */ jsxDEV(
            TextField,
            {
              fullWidth: true,
              label: "Biografia",
              name: "bio",
              value: formData.bio,
              onChange: handleChange,
              multiline: true,
              rows: 3
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 188,
              columnNumber: 19
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 187,
            columnNumber: 17
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 144,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", gutterBottom: true, mt: 3, children: "Alterar Senha" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 200,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(Divider, { sx: { mb: 2 } }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 201,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(Grid, { container: true, spacing: 2, children: [
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxDEV(
            TextField,
            {
              fullWidth: true,
              label: "Nova Senha",
              name: "password",
              type: "password",
              value: formData.password,
              onChange: handleChange,
              helperText: "Deixe em branco para manter a senha atual"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 205,
              columnNumber: 19
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 204,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV(Grid, { item: true, xs: 12, sm: 6, children: /* @__PURE__ */ jsxDEV(
            TextField,
            {
              fullWidth: true,
              label: "Confirmar Nova Senha",
              name: "confirmPassword",
              type: "password",
              value: formData.confirmPassword,
              onChange: handleChange
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 217,
              columnNumber: 19
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 216,
            columnNumber: 17
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 203,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(Box, { mt: 3, display: "flex", justifyContent: "flex-end", children: /* @__PURE__ */ jsxDEV(
          Button,
          {
            type: "submit",
            variant: "contained",
            color: "primary",
            disabled: loading,
            children: loading ? "Salvando..." : "Salvar Altera\xE7\xF5es"
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 229,
            columnNumber: 17
          }
        ) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 228,
          columnNumber: 15
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 140,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 116,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 115,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 114,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 111,
    columnNumber: 5
  });
};
var stdin_default = Profile;
export {
  stdin_default as default
};
