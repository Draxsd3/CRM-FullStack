import { jsxDEV } from "react/jsx-dev-runtime";
import React, { memo, useState, useEffect } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/dateUtils";
import meetingService from "../../services/meetingService";
import EventIcon from "@mui/icons-material/Event";
const CompanyCard = memo(({ company, index, onCardClick }) => {
  const navigate = useNavigate();
  const [upcomingMeeting, setUpcomingMeeting] = useState(null);
  const USER_COLOR_MAP = {
    /** Default color palette for different user roles */
    DEFAULT_PALETTE: {
      "ADM": "#2196f3",
      // Blue
      "Supervisor": "#ff9800",
      // Orange
      "SDR": "#4caf50",
      // Green
      "Closer": "#9c27b0",
      // Purple
      "default": "#607d8b"
      // Gray
    },
    /** Specific colors for individual users by ID */
    USER_SPECIFIC_COLORS: {
      1: "#e91e63",
      // Admin - Pink
      2: "#3f51b5",
      // User ID 2 - Indigo
      3: "#009688",
      // User ID 3 - Teal
      4: "#ff5722",
      // User ID 4 - Deep Orange
      5: "#795548"
      // User ID 5 - Brown
    },
    /** Color intensity for card border and background */
    COLOR_INTENSITY: {
      border: 0.7,
      // Opacity for border
      background: 0.1
      // Opacity for background highlight
    }
  };
  const getCardStyle = (company2, isDragging) => {
    const userId = company2.AssignedUser?.id;
    const userRole = company2.AssignedUser?.role || "default";
    const baseColor = userId && USER_COLOR_MAP.USER_SPECIFIC_COLORS[userId] || USER_COLOR_MAP.DEFAULT_PALETTE[userRole] || USER_COLOR_MAP.DEFAULT_PALETTE["default"];
    return {
      borderLeft: `4px solid ${baseColor}`,
      backgroundColor: `${baseColor}${Math.round(USER_COLOR_MAP.COLOR_INTENSITY.background * 255).toString(16).padStart(2, "0")}`,
      boxShadow: isDragging ? "0 5px 10px rgba(0,0,0,0.2)" : "0 1px 3px rgba(0,0,0,0.12)",
      transform: isDragging ? "rotate(3deg) scale(1.05)" : "none",
      zIndex: isDragging ? 100 : 1,
      transition: "box-shadow 0.2s ease, transform 0.2s ease"
    };
  };
  const handleClick = () => {
    if (onCardClick) {
      onCardClick(company);
    } else {
      navigate(`/companies/${company.id}`);
    }
  };
  useEffect(() => {
    const fetchUpcomingMeeting = async () => {
      try {
        const meetings = await meetingService.getCompanyMeetings(company.id);
        const now = /* @__PURE__ */ new Date();
        const upcoming = meetings.filter(
          (meeting) => meeting.status === "Agendada" && new Date(meeting.startTime) > now
        ).sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0];
        setUpcomingMeeting(upcoming);
      } catch (error) {
        console.error("Error fetching meetings for company:", company.id, error);
      }
    };
    fetchUpcomingMeeting();
  }, [company.id]);
  const getFirstName = (legalName) => {
    if (!legalName) return "";
    const [first, ..._] = legalName.trim().split(" ");
    return first || legalName;
  };
  return /* @__PURE__ */ jsxDEV(
    Draggable,
    {
      draggableId: company.id.toString(),
      index,
      children: (provided, snapshot) => /* @__PURE__ */ jsxDEV(
        Card,
        {
          ref: provided.innerRef,
          ...provided.draggableProps,
          ...provided.dragHandleProps,
          sx: {
            mb: 2,
            cursor: "grab",
            willChange: "transform",
            ...getCardStyle(company, snapshot.isDragging)
          },
          onClick: handleClick,
          children: /* @__PURE__ */ jsxDEV(CardContent, { sx: { pb: "16px !important" }, children: [
            /* @__PURE__ */ jsxDEV(
              Box,
              {
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                mb: 1,
                children: /* @__PURE__ */ jsxDEV(
                  Typography,
                  {
                    variant: "h5",
                    noWrap: true,
                    sx: {
                      flex: 1,
                      mr: 1,
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: "text.primary"
                    },
                    children: getFirstName(company.name)
                  },
                  void 0,
                  false,
                  {
                    fileName: "<stdin>",
                    lineNumber: 127,
                    columnNumber: 15
                  }
                )
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 120,
                columnNumber: 13
              }
            ),
            company.pipelineStatus === "Reuni\xE3o Agendada" && upcomingMeeting && /* @__PURE__ */ jsxDEV(
              Box,
              {
                sx: {
                  mt: 1,
                  mb: 2,
                  p: 1.5,
                  bgcolor: "rgba(33, 150, 243, 0.08)",
                  borderRadius: 2,
                  border: "1px solid rgba(33, 150, 243, 0.2)",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                },
                children: [
                  /* @__PURE__ */ jsxDEV(EventIcon, { fontSize: "small", color: "primary", sx: { minWidth: 22 } }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 159,
                    columnNumber: 17
                  }),
                  /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", fontWeight: "bold", color: "primary", sx: { mr: 1 }, children: formatDate(upcomingMeeting.startTime, "dd/MM/yyyy HH:mm") }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 160,
                    columnNumber: 17
                  }),
                  /* @__PURE__ */ jsxDEV(Typography, { variant: "caption", color: "text.secondary", sx: { flexGrow: 1 }, children: upcomingMeeting.title && `"${upcomingMeeting.title}"` }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 163,
                    columnNumber: 17
                  })
                ]
              },
              void 0,
              true,
              {
                fileName: "<stdin>",
                lineNumber: 144,
                columnNumber: 15
              }
            ),
            /* @__PURE__ */ jsxDEV(Box, { sx: { mt: 1 }, children: [
              /* @__PURE__ */ jsxDEV(
                Typography,
                {
                  variant: "body2",
                  color: "text.secondary",
                  sx: { fontSize: "0.875rem" },
                  children: [
                    "Respons\xE1vel: ",
                    company.AssignedUser?.name || "N\xE3o atribu\xEDdo"
                  ]
                },
                void 0,
                true,
                {
                  fileName: "<stdin>",
                  lineNumber: 170,
                  columnNumber: 15
                }
              ),
              /* @__PURE__ */ jsxDEV(
                Typography,
                {
                  variant: "body2",
                  color: "text.secondary",
                  sx: { mt: 0.5, fontSize: "0.875rem" },
                  children: [
                    "Tipo: ",
                    company.ownerType === "SDR" ? "SDR" : "Closer"
                  ]
                },
                void 0,
                true,
                {
                  fileName: "<stdin>",
                  lineNumber: 177,
                  columnNumber: 15
                }
              )
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 169,
              columnNumber: 13
            }),
            company.qualificationStatus && /* @__PURE__ */ jsxDEV(Box, { sx: { mt: 1 }, children: /* @__PURE__ */ jsxDEV(
              Chip,
              {
                label: company.qualificationStatus,
                color: company.qualificationStatus === "Lead Qualificado" ? "success" : "error",
                size: "small",
                variant: "outlined"
              },
              void 0,
              false,
              {
                fileName: "<stdin>",
                lineNumber: 188,
                columnNumber: 17
              }
            ) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 187,
              columnNumber: 15
            })
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 119,
            columnNumber: 11
          })
        },
        void 0,
        false,
        {
          fileName: "<stdin>",
          lineNumber: 107,
          columnNumber: 9
        }
      )
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 102,
      columnNumber: 5
    }
  );
});
var stdin_default = CompanyCard;
export {
  stdin_default as default
};
