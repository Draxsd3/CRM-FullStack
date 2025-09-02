import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import UserForm from "./UserForm";
import userService from "../../services/userService";
const OperatorsManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao carregar usu\xE1rios:", error);
      toast.error("Erro ao carregar usu\xE1rios");
    } finally {
      setLoading(false);
    }
  };
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setOpenUserDialog(true);
  };
  const handleNewUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    setOpenUserDialog(true);
  };
  const handleUserSubmit = async (userData) => {
    try {
      if (isEditing) {
        await userService.updateUser(selectedUser.id, userData);
      } else {
        await userService.createUser(userData);
      }
      setOpenUserDialog(false);
      fetchUsers();
    } catch (error) {
      console.error("Erro ao salvar usu\xE1rio:", error);
      throw error;
    }
  };
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Tem certeza que deseja excluir este usu\xE1rio?")) {
      try {
        await userService.deleteUser(userId);
        toast.success("Usu\xE1rio exclu\xEDdo com sucesso");
        fetchUsers();
      } catch (error) {
        console.error("Erro ao excluir usu\xE1rio:", error);
        toast.error("Erro ao excluir usu\xE1rio");
      }
    }
  };
  const getRoleName = (role) => {
    switch (role) {
      case "ADM":
        return "Administrador";
      case "Supervisor":
        return "Supervisor";
      case "SDR":
        return "SDR";
      default:
        return role;
    }
  };
  if (loading && users.length === 0) {
    return /* @__PURE__ */ jsxDEV(Typography, { children: "Carregando usu\xE1rios..." }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 109,
      columnNumber: 12
    });
  }
  return /* @__PURE__ */ jsxDEV(Box, { children: [
    /* @__PURE__ */ jsxDEV(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, children: [
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h5", children: "Operadores do Sistema" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 115,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(
        Button,
        {
          variant: "contained",
          color: "primary",
          startIcon: /* @__PURE__ */ jsxDEV(AddIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 119,
            columnNumber: 22
          }),
          onClick: handleNewUser,
          children: "Novo Usu\xE1rio"
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 116,
          columnNumber: 9
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 114,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Paper, { elevation: 3, children: /* @__PURE__ */ jsxDEV(TableContainer, { children: /* @__PURE__ */ jsxDEV(Table, { children: [
      /* @__PURE__ */ jsxDEV(TableHead, { children: /* @__PURE__ */ jsxDEV(TableRow, { children: [
        /* @__PURE__ */ jsxDEV(TableCell, { children: "Nome" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 131,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV(TableCell, { children: "E-mail" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 132,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV(TableCell, { children: "Perfil" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 133,
          columnNumber: 17
        }),
        /* @__PURE__ */ jsxDEV(TableCell, { align: "right", children: "A\xE7\xF5es" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 134,
          columnNumber: 17
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 130,
        columnNumber: 15
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 129,
        columnNumber: 13
      }),
      /* @__PURE__ */ jsxDEV(TableBody, { children: users.map((user) => /* @__PURE__ */ jsxDEV(TableRow, { children: [
        /* @__PURE__ */ jsxDEV(TableCell, { children: user.name }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 140,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(TableCell, { children: user.email }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 141,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(TableCell, { children: getRoleName(user.role) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 142,
          columnNumber: 19
        }),
        /* @__PURE__ */ jsxDEV(TableCell, { align: "right", children: [
          /* @__PURE__ */ jsxDEV(
            IconButton,
            {
              color: "primary",
              onClick: () => handleEditUser(user),
              children: /* @__PURE__ */ jsxDEV(EditIcon, {}, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 148,
                columnNumber: 23
              })
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 144,
              columnNumber: 21
            }
          ),
          /* @__PURE__ */ jsxDEV(
            IconButton,
            {
              color: "error",
              onClick: () => handleDeleteUser(user.id),
              children: /* @__PURE__ */ jsxDEV(DeleteIcon, {}, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 154,
                columnNumber: 23
              })
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 150,
              columnNumber: 21
            }
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 143,
          columnNumber: 19
        })
      ] }, user.id, true, {
        fileName: "<stdin>",
        lineNumber: 139,
        columnNumber: 17
      })) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 137,
        columnNumber: 13
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 128,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 127,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 126,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(
      Dialog,
      {
        open: openUserDialog,
        onClose: () => setOpenUserDialog(false),
        maxWidth: "sm",
        fullWidth: true,
        children: /* @__PURE__ */ jsxDEV(
          UserForm,
          {
            initialValues: selectedUser,
            onSubmit: handleUserSubmit,
            onCancel: () => setOpenUserDialog(false),
            isEditing
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 171,
            columnNumber: 9
          }
        )
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 165,
        columnNumber: 7
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 113,
    columnNumber: 5
  });
};
var stdin_default = OperatorsManagement;
export {
  stdin_default as default
};
