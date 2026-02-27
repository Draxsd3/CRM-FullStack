import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import Pipeline from "./pages/Pipeline";
import Calendar from "./pages/Calendar";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Layout from "./components/layout/Layout";
import LoadingScreen from "./components/ui/LoadingScreen";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
const theme = createTheme({
  palette: {
    primary: {
      main: "#4caf50",
      // green
      light: "#80e27e",
      dark: "#087f23",
      contrastText: "#ffffff"
    },
    secondary: {
      main: "#2196f3",
      // azul
      light: "#64b5f6",
      dark: "#0d47a1",
      contrastText: "#ffffff"
    },
    error: {
      main: "#f44336"
    },
    background: {
      default: "#f5f5f5"
    }
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "2.2rem",
      fontWeight: 500
    },
    h2: {
      fontSize: "1.8rem",
      fontWeight: 500
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500
    },
    h4: {
      fontSize: "1.3rem",
      fontWeight: 500
    },
    h5: {
      fontSize: "1.1rem",
      fontWeight: 500
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)"
        }
      }
    }
  }
});
const ProtectedRoute = ({ children, requiredRoles = ["SDR", "Supervisor", "ADM", "Closer"] }) => {
  const { isAuthenticated, loading, hasAccess, user } = React.useContext(AuthContext);
  if (loading) {
    return /* @__PURE__ */ jsxDEV(LoadingScreen, { message: "Carregando sessao...", fullScreen: true }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 108,
      columnNumber: 12
    });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxDEV(Navigate, { to: "/login" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 112,
      columnNumber: 12
    });
  }
  if (!user || !user.role) {
    return /* @__PURE__ */ jsxDEV(Navigate, { to: "/login" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 117,
      columnNumber: 12
    });
  }
  if (!hasAccess(requiredRoles)) {
    return /* @__PURE__ */ jsxDEV(Navigate, { to: "/" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 122,
      columnNumber: 12
    });
  }
  return children;
};
function App() {
  return /* @__PURE__ */ jsxDEV(ThemeProvider, { theme, children: [
    /* @__PURE__ */ jsxDEV(CssBaseline, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 131,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(LocalizationProvider, { dateAdapter: AdapterDayjs, adapterLocale: "pt-br", children: /* @__PURE__ */ jsxDEV(AuthProvider, { children: /* @__PURE__ */ jsxDEV(NotificationProvider, { children: /* @__PURE__ */ jsxDEV(Routes, { children: [
      /* @__PURE__ */ jsxDEV(Route, { path: "/login", element: /* @__PURE__ */ jsxDEV(Login, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 136,
        columnNumber: 45
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 136,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDEV(Route, { path: "/", element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { children: /* @__PURE__ */ jsxDEV(Layout, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 140,
        columnNumber: 19
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 139,
        columnNumber: 17
      }, this), children: [
        /* @__PURE__ */ jsxDEV(Route, { index: true, element: /* @__PURE__ */ jsxDEV(Dashboard, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 143,
          columnNumber: 39
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 143,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "companies", element: /* @__PURE__ */ jsxDEV(Companies, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 144,
          columnNumber: 50
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 144,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "companies/:id", element: /* @__PURE__ */ jsxDEV(CompanyDetails, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 145,
          columnNumber: 54
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 145,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "pipeline", element: /* @__PURE__ */ jsxDEV(Pipeline, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 146,
          columnNumber: 49
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 146,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "calendar", element: /* @__PURE__ */ jsxDEV(Calendar, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 147,
          columnNumber: 49
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 147,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "profile", element: /* @__PURE__ */ jsxDEV(Profile, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 148,
          columnNumber: 48
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 148,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "reports", element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { requiredRoles: ["ADM", "Supervisor", "Closer"], children: /* @__PURE__ */ jsxDEV(Reports, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 151,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 150,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 149,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "settings", element: /* @__PURE__ */ jsxDEV(ProtectedRoute, { requiredRoles: ["ADM"], children: /* @__PURE__ */ jsxDEV(Settings, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 156,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 155,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 154,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV(Route, { path: "*", element: /* @__PURE__ */ jsxDEV(NotFound, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 159,
          columnNumber: 42
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 159,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 138,
        columnNumber: 15
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 135,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 134,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 133,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 132,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 130,
    columnNumber: 5
  }, this);
}
var stdin_default = App;
export {
  stdin_default as default
};
