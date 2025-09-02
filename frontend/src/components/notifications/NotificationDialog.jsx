import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import EventIcon from "@mui/icons-material/Event";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
const NotificationDialog = ({ open, notification, onClose, onConfirm }) => {
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const dialogRef = useRef(null);
  useEffect(() => {
    if (open) {
      console.log("Notification dialog opened, playing sound...");
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const playBeep = () => {
          try {
            const oscillator = audioContextRef.current.createOscillator();
            const gainNode = audioContextRef.current.createGain();
            oscillator.type = "sine";
            oscillator.frequency.value = 660;
            gainNode.gain.value = 0.2;
            oscillator.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);
            oscillator.start();
            setTimeout(() => {
              oscillator.stop();
            }, 300);
            console.log("Beep played successfully");
          } catch (err) {
            console.error("Error playing beep:", err);
          }
        };
        playBeep();
        try {
          if (!audioRef.current) {
            audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
            audioRef.current.volume = 0.5;
          }
          audioRef.current.play().then(() => console.log("Audio played successfully")).catch((err) => console.error("Error playing audio element:", err));
        } catch (audioErr) {
          console.error("Audio element setup failed:", audioErr);
        }
        const beepInterval = setInterval(playBeep, 5e3);
        return () => {
          clearInterval(beepInterval);
        };
      } catch (error) {
        console.error("Error playing notification sound:", error);
      }
    }
  }, [open]);
  useEffect(() => {
    if (open) {
      console.log("Dialog opened, attempting to focus dialog");
      const focusDialog = () => {
        const dialogElement = document.querySelector('[role="dialog"]');
        if (dialogElement) {
          try {
            dialogElement.focus();
            console.log("Dialog focused successfully");
            dialogElement.style.zIndex = "9999";
            if (dialogRef.current) {
              dialogRef.current.style.zIndex = "9999";
            }
          } catch (err) {
            console.error("Error focusing dialog:", err);
          }
        } else {
          console.log("Dialog element not found");
        }
      };
      setTimeout(focusDialog, 100);
      setTimeout(focusDialog, 300);
      setTimeout(focusDialog, 1e3);
    }
  }, [open]);
  if (!notification) return null;
  const formatMeetingTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };
  const meetingTime = notification.meeting?.startTime ? formatMeetingTime(notification.meeting.startTime) : "";
  return /* @__PURE__ */ jsxDEV(
    Dialog,
    {
      open,
      onClose,
      ref: dialogRef,
      PaperProps: {
        sx: {
          borderTop: "4px solid #4caf50",
          minWidth: { xs: "90%", sm: 400 },
          maxWidth: 450,
          zIndex: 9999,
          position: "relative",
          boxShadow: "0 0 24px rgba(0,0,0,0.4)"
        }
      },
      BackdropProps: {
        sx: { zIndex: 9998 }
      },
      sx: {
        zIndex: 9999,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      children: [
        /* @__PURE__ */ jsxDEV(DialogTitle, { sx: { display: "flex", alignItems: "center", gap: 1.5 }, children: [
          /* @__PURE__ */ jsxDEV(Avatar, { sx: { bgcolor: "#4caf50" }, children: /* @__PURE__ */ jsxDEV(NotificationsActiveIcon, {}, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 167,
            columnNumber: 11
          }) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 166,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV(Typography, { variant: "h6", sx: { fontWeight: "bold", color: "#4caf50" }, children: notification.title }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 169,
            columnNumber: 9
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 165,
          columnNumber: 7
        }),
        /* @__PURE__ */ jsxDEV(DialogContent, { children: [
          /* @__PURE__ */ jsxDEV(DialogContentText, { gutterBottom: true, children: notification.message }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 175,
            columnNumber: 9
          }),
          notification.meeting && /* @__PURE__ */ jsxDEV(Box, { sx: { mt: 2, bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }, children: [
            /* @__PURE__ */ jsxDEV(Typography, { variant: "subtitle1", gutterBottom: true, sx: { fontWeight: "bold" }, children: notification.meeting.title }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 181,
              columnNumber: 13
            }),
            /* @__PURE__ */ jsxDEV(Box, { sx: { display: "flex", alignItems: "center", gap: 1, mb: 1 }, children: [
              /* @__PURE__ */ jsxDEV(EventIcon, { fontSize: "small", color: "primary" }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 186,
                columnNumber: 15
              }),
              /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", children: meetingTime }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 187,
                columnNumber: 15
              })
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 185,
              columnNumber: 13
            }),
            /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", children: [
              notification.meeting.meetingType,
              " - ",
              notification.meeting.location || "Sem localiza\xE7\xE3o"
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 192,
              columnNumber: 13
            }),
            notification.meeting.description && /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", color: "text.secondary", sx: { mt: 1 }, children: notification.meeting.description.length > 100 ? `${notification.meeting.description.slice(0, 100)}...` : notification.meeting.description }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 197,
              columnNumber: 15
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 180,
            columnNumber: 11
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 174,
          columnNumber: 7
        }),
        /* @__PURE__ */ jsxDEV(DialogActions, { children: [
          /* @__PURE__ */ jsxDEV(Button, { onClick: onClose, color: "inherit", children: "Lembrar depois" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 208,
            columnNumber: 9
          }),
          /* @__PURE__ */ jsxDEV(
            Button,
            {
              onClick: onConfirm,
              variant: "contained",
              color: "primary",
              autoFocus: true,
              sx: { fontWeight: "bold" },
              children: "Estou ciente"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 211,
              columnNumber: 9
            }
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 207,
          columnNumber: 7
        })
      ]
    },
    void 0,
    true,
    {
      fileName: "<stdin>",
      lineNumber: 139,
      columnNumber: 5
    }
  );
};
var stdin_default = NotificationDialog;
export {
  stdin_default as default
};
