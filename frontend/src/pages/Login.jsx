import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Link
} from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import { green, blue, grey } from "@mui/material/colors";
const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50"
      // Green color
    },
    secondary: {
      main: blue[700]
    },
    background: {
      default: "#f7f9fc"
    }
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif"
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          boxShadow: "none",
          padding: "12px 16px",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8
          }
        }
      }
    }
  }
});
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      } else {
        setError("Credenciais inv\xE1lidas");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
      console.error(err);
    }
  };
  if (isAuthenticated && !loading) {
    return /* @__PURE__ */ jsxDEV(Navigate, { to: "/" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 93,
      columnNumber: 12
    });
  }
  return /* @__PURE__ */ jsxDEV(ThemeProvider, { theme, children: [
    /* @__PURE__ */ jsxDEV(CssBaseline, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 98,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(Box, { sx: {
      minHeight: "100vh",
      display: "flex",
      backgroundColor: "#f7f9fc",
      overflow: "hidden",
      position: "relative"
    }, children: [
      !isMobile && /* @__PURE__ */ jsxDEV(Box, { sx: {
        flex: "0 0 50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
        color: "white",
        p: 5,
        overflow: "hidden"
      }, children: [
        /* @__PURE__ */ jsxDEV(Box, { sx: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.1 }, children: /* @__PURE__ */ jsxDEV("svg", { width: "100%", height: "100%", viewBox: "0 0 800 800", xmlns: "http://www.w3.org/2000/svg", children: [
          /* @__PURE__ */ jsxDEV("circle", { cx: "400", cy: "400", r: "200", fill: "white", opacity: "0.3" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 123,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("circle", { cx: "200", cy: "200", r: "100", fill: "white", opacity: "0.2" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 124,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("circle", { cx: "600", cy: "600", r: "150", fill: "white", opacity: "0.2" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 125,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("path", { d: "M0,0 L800,800", stroke: "white", strokeWidth: "20", opacity: "0.1" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 126,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("path", { d: "M800,0 L0,800", stroke: "white", strokeWidth: "20", opacity: "0.1" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 127,
            columnNumber: 17
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 122,
          columnNumber: 15
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 121,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(Box, { sx: {
          width: "120px",
          height: "120px",
          backgroundColor: "white",
          borderRadius: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          mb: 4
        }, children: /* @__PURE__ */ jsxDEV("svg", { width: "80", height: "80", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
          /* @__PURE__ */ jsxDEV("path", { d: "M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z", stroke: "#4caf50", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 144,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("path", { d: "M2 8H22", stroke: "#4caf50", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 145,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("path", { d: "M6 4V8", stroke: "#4caf50", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 146,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("path", { d: "M18 4V8", stroke: "#4caf50", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 147,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("path", { d: "M10 12H14", stroke: "#4caf50", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 148,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("path", { d: "M12 10V14", stroke: "#4caf50", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 149,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("path", { d: "M8 14H8.01", stroke: "#4caf50", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 150,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("path", { d: "M16 14H16.01", stroke: "#4caf50", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 151,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("path", { d: "M8 17H8.01", stroke: "#4caf50", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 152,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("path", { d: "M12 17H12.01", stroke: "#4caf50", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 153,
            columnNumber: 17
          }),
          /* @__PURE__ */ jsxDEV("path", { d: "M16 17H16.01", stroke: "#4caf50", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 154,
            columnNumber: 17
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 143,
          columnNumber: 15
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 132,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h3", component: "h1", sx: { fontWeight: 700, textAlign: "center", mb: 2 }, children: "CRM Gold Credit" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 159,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", sx: {
          textAlign: "center",
          maxWidth: "500px",
          mb: 5,
          opacity: 0.9,
          fontWeight: 400,
          lineHeight: 1.6
        }, children: "Gerencie seu pipeline, acompanhe leads e organize reuni\xF5es em uma \xFAnica plataforma integrada" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 163,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex", flexDirection: "column", gap: 2.5, maxWidth: "400px" }, children: [
          /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex", alignItems: "center", gap: 2 }, children: [
            /* @__PURE__ */ jsxDEV(Box, { sx: {
              width: 40,
              height: 40,
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }, children: /* @__PURE__ */ jsxDEV("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
              /* @__PURE__ */ jsxDEV("path", { d: "M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V14C20 15.1046 19.1046 16 18 16H16M8 16V17C8 18.1046 8.89543 19 10 19H14C15.1046 19 16 18.1046 16 17V16M8 16H16", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 187,
                columnNumber: 21
              }),
              /* @__PURE__ */ jsxDEV("path", { d: "M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 188,
                columnNumber: 21
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 186,
              columnNumber: 19
            }) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 177,
              columnNumber: 17
            }),
            /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", sx: { opacity: 0.9 }, children: "Gerencie leads e clientes em um \xFAnico local" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 191,
              columnNumber: 17
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 176,
            columnNumber: 15
          }),
          /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex", alignItems: "center", gap: 2 }, children: [
            /* @__PURE__ */ jsxDEV(Box, { sx: {
              width: 40,
              height: 40,
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }, children: /* @__PURE__ */ jsxDEV("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsxDEV("path", { d: "M16 4V8M8 4V8M4 12H20M4 8H20C21.1046 8 22 8.89543 22 10V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V10C2 8.89543 2.89543 8 4 8Z", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 207,
              columnNumber: 21
            }) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 206,
              columnNumber: 19
            }) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 197,
              columnNumber: 17
            }),
            /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", sx: { opacity: 0.9 }, children: "Agende e gerencie reuni\xF5es com notifica\xE7\xF5es" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 210,
              columnNumber: 17
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 196,
            columnNumber: 15
          }),
          /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex", alignItems: "center", gap: 2 }, children: [
            /* @__PURE__ */ jsxDEV(Box, { sx: {
              width: 40,
              height: 40,
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }, children: /* @__PURE__ */ jsxDEV("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
              /* @__PURE__ */ jsxDEV("path", { d: "M7 16C9.20914 16 11 14.2091 11 12C11 9.79086 9.20914 8 7 8C4.79086 8 3 9.79086 3 12C3 14.2091 4.79086 16 7 16Z", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 226,
                columnNumber: 21
              }),
              /* @__PURE__ */ jsxDEV("path", { d: "M14 16L17 19L21 15", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 227,
                columnNumber: 21
              }),
              /* @__PURE__ */ jsxDEV("path", { d: "M17 11V5C17 4.46957 16.7893 3.96086 16.4142 3.58579C16.0391 3.21071 15.5304 3 15 3H13", stroke: "white", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 228,
                columnNumber: 21
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 225,
              columnNumber: 19
            }) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 216,
              columnNumber: 17
            }),
            /* @__PURE__ */ jsxDEV(Typography, { variant: "body1", sx: { opacity: 0.9 }, children: "Acompanhe e visualize seu pipeline" }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 231,
              columnNumber: 17
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 215,
            columnNumber: 15
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 175,
          columnNumber: 13
        })
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 108,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(Box, { sx: {
        flex: isMobile ? "1" : "0 0 50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 3
      }, children: /* @__PURE__ */ jsxDEV(Container, { maxWidth: "sm", children: /* @__PURE__ */ jsxDEV(Box, { sx: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
        p: 4,
        borderRadius: 4,
        boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.12)",
        width: "100%",
        maxWidth: "450px",
        mx: "auto"
      }, children: [
        /* @__PURE__ */ jsxDEV(Box, { sx: { width: "100%", mb: 4, textAlign: "center" }, children: [
          /* @__PURE__ */ jsxDEV(
            Avatar,
            {
              sx: {
                m: "0 auto",
                bgcolor: "#4caf50",
                width: 56,
                height: 56,
                boxShadow: "0 4px 14px rgba(76, 175, 80, 0.4)"
              },
              children: /* @__PURE__ */ jsxDEV(LockOutlinedIcon, { fontSize: "large" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 272,
                columnNumber: 19
              })
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 263,
              columnNumber: 17
            }
          ),
          /* @__PURE__ */ jsxDEV(
            Typography,
            {
              variant: "h4",
              sx: {
                mt: 2,
                mb: 0.5,
                fontWeight: 700,
                color: grey[800]
              },
              children: "Bem-vindo(a)"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 275,
              columnNumber: 17
            }
          ),
          /* @__PURE__ */ jsxDEV(
            Typography,
            {
              variant: "body1",
              color: "text.secondary",
              sx: { mb: 3 },
              children: "Acesse sua conta para continuar"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 287,
              columnNumber: 17
            }
          ),
          error && /* @__PURE__ */ jsxDEV(
            Alert,
            {
              severity: "error",
              sx: {
                mb: 3,
                borderRadius: 2,
                "& .MuiAlert-icon": { alignItems: "center" }
              },
              children: error
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 296,
              columnNumber: 19
            }
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 262,
          columnNumber: 15
        }),
        /* @__PURE__ */ jsxDEV(
          Box,
          {
            component: "form",
            onSubmit: handleSubmit,
            sx: { width: "100%" },
            children: [
              /* @__PURE__ */ jsxDEV(
                TextField,
                {
                  variant: "outlined",
                  margin: "normal",
                  required: true,
                  fullWidth: true,
                  id: "email",
                  label: "E-mail",
                  name: "email",
                  autoComplete: "email",
                  autoFocus: true,
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  sx: { mb: 2 }
                },
                void 0,
                false,
                {
                  fileName: "<stdin>",
                  lineNumber: 315,
                  columnNumber: 17
                }
              ),
              /* @__PURE__ */ jsxDEV(
                TextField,
                {
                  variant: "outlined",
                  margin: "normal",
                  required: true,
                  fullWidth: true,
                  name: "password",
                  label: "Senha",
                  type: "password",
                  id: "password",
                  autoComplete: "current-password",
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  sx: { mb: 2 }
                },
                void 0,
                false,
                {
                  fileName: "<stdin>",
                  lineNumber: 330,
                  columnNumber: 17
                }
              ),
              /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }, children: /* @__PURE__ */ jsxDEV(
                Link,
                {
                  href: "#",
                  variant: "body2",
                  sx: {
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" }
                  },
                  onClick: (e) => e.preventDefault(),
                  children: "Esqueceu a senha?"
                },
                void 0,
                false,
                {
                  fileName: "<stdin>",
                  lineNumber: 346,
                  columnNumber: 19
                }
              ) }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 345,
                columnNumber: 17
              }),
              /* @__PURE__ */ jsxDEV(
                Button,
                {
                  type: "submit",
                  fullWidth: true,
                  variant: "contained",
                  sx: {
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    background: "linear-gradient(45deg, #4caf50 30%, #81c784 90%)",
                    boxShadow: "0 3px 12px rgba(76, 175, 80, 0.3)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 6px 15px rgba(76, 175, 80, 0.4)",
                      transform: "translateY(-2px)"
                    }
                  },
                  children: "Entrar"
                },
                void 0,
                false,
                {
                  fileName: "<stdin>",
                  lineNumber: 360,
                  columnNumber: 17
                }
              ),
              /* @__PURE__ */ jsxDEV(Box, { sx: { mt: 3, textAlign: "center" }, children: /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "text.secondary", children: [
                (/* @__PURE__ */ new Date()).getFullYear(),
                " CRM Gold Credit"
              ] }, void 0, true, {
                fileName: "<stdin>",
                lineNumber: 381,
                columnNumber: 19
              }) }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 380,
                columnNumber: 17
              })
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 310,
            columnNumber: 15
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 249,
        columnNumber: 13
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 248,
        columnNumber: 11
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 240,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 99,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 97,
    columnNumber: 5
  });
};
var stdin_default = Login;
export {
  stdin_default as default
};
