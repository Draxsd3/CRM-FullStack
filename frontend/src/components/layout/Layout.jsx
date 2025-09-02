import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import {
  Box,
  CssBaseline,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  styled,
  Button,
  Badge,
  Menu,
  MenuItem,
  ListItemButton,
  Tooltip
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import InputBase from "@mui/material/InputBase";
import { alpha } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { NotificationContext } from "../../contexts/NotificationContext";
const drawerWidth = 240;
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `-${drawerWidth}px`,
    ...open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    }
  })
);
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  }
}));
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end"
}));
const menuItems = [
  { text: "Dashboard", icon: /* @__PURE__ */ jsxDEV(DashboardIcon, {}, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 91,
    columnNumber: 30
  }), path: "/" },
  { text: "Empresas", icon: /* @__PURE__ */ jsxDEV(BusinessIcon, {}, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 92,
    columnNumber: 29
  }), path: "/companies" },
  { text: "Pipeline", icon: /* @__PURE__ */ jsxDEV(AssignmentIcon, {}, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 93,
    columnNumber: 29
  }), path: "/pipeline" },
  { text: "Agenda", icon: /* @__PURE__ */ jsxDEV(CalendarTodayIcon, {}, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 94,
    columnNumber: 27
  }), path: "/calendar" },
  { text: "Relat\xF3rios", icon: /* @__PURE__ */ jsxDEV(BarChartIcon, {}, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 95,
    columnNumber: 31
  }), path: "/reports" },
  { text: "Configura\xE7\xF5es", icon: /* @__PURE__ */ jsxDEV(SettingsIcon, {}, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 96,
    columnNumber: 34
  }), path: "/settings" }
];
const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const {
    notifications,
    markAsRead,
    unreadCount,
    dismissAllUpcomingMeetingNotifications,
    stopFlashingTitle
  } = useContext(NotificationContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const openMenu = Boolean(anchorEl);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const searchEvent = new CustomEvent("pageSearch", {
      detail: { query: e.target.value }
    });
    window.dispatchEvent(searchEvent);
  };
  const handleNotificationsClick = (event) => {
    setAnchorEl(event.currentTarget);
    stopFlashingTitle();
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.type === "upcoming-meeting") {
      navigate("/calendar");
    }
    handleCloseMenu();
  };
  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem("notificationSoundEnabled", newState.toString());
  };
  useEffect(() => {
    const savedSoundPreference = localStorage.getItem("notificationSoundEnabled");
    if (savedSoundPreference !== null) {
      setSoundEnabled(savedSoundPreference === "true");
    }
  }, []);
  return /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex" }, children: [
    /* @__PURE__ */ jsxDEV(CssBaseline, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 172,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(AppBar, { position: "fixed", open, children: /* @__PURE__ */ jsxDEV(Toolbar, { children: [
      /* @__PURE__ */ jsxDEV(
        IconButton,
        {
          color: "inherit",
          "aria-label": "open drawer",
          onClick: handleDrawerOpen,
          edge: "start",
          sx: { mr: 2, ...open && { display: "none" } },
          children: /* @__PURE__ */ jsxDEV(MenuIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 182,
            columnNumber: 13
          })
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 175,
          columnNumber: 11
        }
      ),
      /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", noWrap: true, component: "div", sx: { display: { xs: "none", sm: "block" } }, children: "CRM Gold Credit" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 184,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(Box, { sx: { flexGrow: 1 } }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 188,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(Box, { sx: {
        position: "relative",
        borderRadius: 20,
        backgroundColor: alpha("#fff", 0.15),
        "&:hover": { backgroundColor: alpha("#fff", 0.25) },
        marginLeft: "auto",
        width: 250,
        marginRight: 2
      }, children: [
        /* @__PURE__ */ jsxDEV(Box, { sx: {
          padding: "0 8px",
          height: "100%",
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }, children: /* @__PURE__ */ jsxDEV(SearchIcon, {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 207,
          columnNumber: 15
        }) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 199,
          columnNumber: 13
        }),
        /* @__PURE__ */ jsxDEV(
          InputBase,
          {
            placeholder: "Buscar na p\xE1gina...",
            value: searchQuery,
            onChange: handleSearch,
            sx: {
              color: "inherit",
              padding: "8px 8px 8px 36px",
              width: "100%",
              "& input": { transition: "width 0.2s" }
            }
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 209,
            columnNumber: 13
          }
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 190,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(Tooltip, { title: soundEnabled ? "Desativar som de notifica\xE7\xF5es" : "Ativar som de notifica\xE7\xF5es", children: /* @__PURE__ */ jsxDEV(
        IconButton,
        {
          color: "inherit",
          onClick: toggleSound,
          sx: { mr: 1 },
          children: soundEnabled ? /* @__PURE__ */ jsxDEV(VolumeUpIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 228,
            columnNumber: 31
          }) : /* @__PURE__ */ jsxDEV(VolumeOffIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 228,
            columnNumber: 50
          })
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 223,
          columnNumber: 13
        }
      ) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 222,
        columnNumber: 11
      }),
      /* @__PURE__ */ jsxDEV(
        IconButton,
        {
          color: "inherit",
          onClick: handleNotificationsClick,
          sx: { mr: 2 },
          children: /* @__PURE__ */ jsxDEV(Badge, { badgeContent: unreadCount, color: "error", children: /* @__PURE__ */ jsxDEV(NotificationsIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 238,
            columnNumber: 15
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 237,
            columnNumber: 13
          })
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 232,
          columnNumber: 11
        }
      ),
      /* @__PURE__ */ jsxDEV(
        Menu,
        {
          anchorEl,
          open: openMenu,
          onClose: handleCloseMenu,
          PaperProps: {
            style: {
              maxHeight: 48 * 5.5,
              width: "350px"
            }
          },
          children: notifications.length === 0 ? /* @__PURE__ */ jsxDEV(MenuItem, { children: "Nenhuma notifica\xE7\xE3o" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 254,
            columnNumber: 15
          }) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
            unreadCount > 0 && /* @__PURE__ */ jsxDEV(
              MenuItem,
              {
                onClick: dismissAllUpcomingMeetingNotifications,
                sx: {
                  justifyContent: "center",
                  borderBottom: "1px solid #eee"
                },
                children: /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "primary", children: "Marcar todas como lidas" }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 265,
                  columnNumber: 21
                })
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 258,
                columnNumber: 19
              }
            ),
            notifications.map((notification) => /* @__PURE__ */ jsxDEV(
              MenuItem,
              {
                onClick: () => handleNotificationClick(notification),
                sx: {
                  opacity: notification.read ? 0.6 : 1,
                  bgcolor: notification.read ? "transparent" : "action.hover",
                  borderLeft: notification.read ? "none" : "4px solid",
                  borderColor: "primary.main"
                },
                children: /* @__PURE__ */ jsxDEV(
                  ListItemText,
                  {
                    primary: notification.title,
                    secondary: notification.message,
                    primaryTypographyProps: {
                      fontWeight: notification.read ? "normal" : "bold"
                    }
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 282,
                    columnNumber: 21
                  }
                )
              },
              notification.id,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 272,
                columnNumber: 19
              }
            ))
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 256,
            columnNumber: 15
          })
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 242,
          columnNumber: 11
        }
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 174,
      columnNumber: 9
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 173,
      columnNumber: 7
    }),
    /* @__PURE__ */ jsxDEV(
      Drawer,
      {
        sx: {
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box"
          }
        },
        variant: "persistent",
        anchor: "left",
        open,
        children: [
          /* @__PURE__ */ jsxDEV(DrawerHeader, { children: /* @__PURE__ */ jsxDEV(IconButton, { onClick: handleDrawerClose, children: /* @__PURE__ */ jsxDEV(ChevronLeftIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 312,
            columnNumber: 13
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 311,
            columnNumber: 11
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 310,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV(Divider, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 315,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV(List, { children: menuItems.map((item) => /* @__PURE__ */ jsxDEV(
            ListItem,
            {
              button: true,
              onClick: () => navigate(item.path),
              selected: location.pathname === item.path,
              children: [
                /* @__PURE__ */ jsxDEV(ListItemIcon, { children: item.icon }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 324,
                  columnNumber: 15
                }),
                /* @__PURE__ */ jsxDEV(ListItemText, { primary: item.text }, void 0, false, {
                  fileName: "<stdin>",
                  lineNumber: 327,
                  columnNumber: 15
                })
              ]
            },
            item.text,
            true,
            {
              fileName: "<stdin>",
              lineNumber: 318,
              columnNumber: 13
            }
          )) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 316,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV(Box, { sx: { flexGrow: 1 } }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 331,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV(Divider, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 332,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV(List, { children: [
            /* @__PURE__ */ jsxDEV(
              ListItem,
              {
                button: true,
                onClick: () => navigate("/profile"),
                selected: location.pathname === "/profile",
                children: [
                  /* @__PURE__ */ jsxDEV(ListItemIcon, { children: /* @__PURE__ */ jsxDEV(AccountCircleIcon, {}, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 340,
                    columnNumber: 15
                  }) }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 339,
                    columnNumber: 13
                  }),
                  /* @__PURE__ */ jsxDEV(ListItemText, { primary: "Meu Perfil" }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 342,
                    columnNumber: 13
                  })
                ]
              },
              void 0,
              true,
              {
                fileName: "<stdin>",
                lineNumber: 334,
                columnNumber: 11
              }
            ),
            /* @__PURE__ */ jsxDEV(ListItem, { button: true, onClick: handleLogout, children: [
              /* @__PURE__ */ jsxDEV(ListItemIcon, { children: /* @__PURE__ */ jsxDEV(LogoutIcon, {}, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 346,
                columnNumber: 15
              }) }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 345,
                columnNumber: 13
              }),
              /* @__PURE__ */ jsxDEV(ListItemText, { primary: "Sair" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 348,
                columnNumber: 13
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 344,
              columnNumber: 11
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 333,
            columnNumber: 9
          })
        ]
      },
      void 0,
      true,
      {
        fileName: "<stdin>",
        lineNumber: 297,
        columnNumber: 7
      }
    ),
    /* @__PURE__ */ jsxDEV(Main, { open, children: [
      /* @__PURE__ */ jsxDEV(DrawerHeader, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 353,
        columnNumber: 9
      }),
      /* @__PURE__ */ jsxDEV(Outlet, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 354,
        columnNumber: 9
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 352,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 171,
    columnNumber: 5
  });
};
var stdin_default = Layout;
export {
  stdin_default as default
};
