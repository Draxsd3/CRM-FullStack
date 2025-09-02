import { jsxDEV } from "react/jsx-dev-runtime";
import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Dialog,
  CircularProgress,
  Tooltip,
  Chip,
  Typography
} from "@mui/material";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast } from "react-toastify";
import meetingService from "../../services/meetingService";
import MeetingForm from "./MeetingForm";
import companyService from "../../services/companyService";
moment.locale("pt-br");
const localizer = momentLocalizer(moment);
const STATUS_COLORS = {
  "Agendada": {
    backgroundColor: "#2196f3",
    // Blue
    color: "white"
  },
  "Realizada": {
    backgroundColor: "#4caf50",
    // Green
    color: "white"
  },
  "Cancelada": {
    backgroundColor: "#f44336",
    // Red
    color: "white"
  },
  "Reagendada": {
    backgroundColor: "#ff9800",
    // Orange 
    color: "white"
  }
};
const Calendar = () => {
  const [meetings, setMeetings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [openMeetingForm, setOpenMeetingForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchMeetings();
    fetchCompanies();
  }, []);
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const now = /* @__PURE__ */ new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      const data = await meetingService.getMeetingsByDateRange(
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );
      const formattedMeetings = data.map((meeting) => ({
        id: meeting.id,
        title: meeting.title,
        start: new Date(meeting.startTime),
        end: new Date(meeting.endTime),
        companyId: meeting.companyId,
        companyName: meeting.Company?.name || "Empresa",
        description: meeting.description,
        location: meeting.location,
        meetingType: meeting.meetingType,
        status: meeting.status
      }));
      setMeetings(formattedMeetings);
    } catch (error) {
      console.error("Erro ao carregar reuni\xF5es:", error);
      toast.error("Erro ao carregar reuni\xF5es");
    } finally {
      setLoading(false);
    }
  };
  const fetchCompanies = async () => {
    try {
      const data = await companyService.getAllCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
    }
  };
  const handleSelectSlot = useCallback(({ start, end }) => {
    setSelectedDate({ start, end });
    setSelectedEvent(null);
    setEditMode(false);
    setOpenMeetingForm(true);
  }, []);
  const handleSelectEvent = useCallback((event) => {
    console.log("Selected event for editing:", event);
    setSelectedEvent(event);
    setSelectedDate(null);
    setEditMode(true);
    setOpenMeetingForm(true);
  }, []);
  const handleMeetingSubmit = async (meetingData) => {
    try {
      setLoading(true);
      if (editMode && selectedEvent) {
        console.log("Updating meeting with ID:", selectedEvent.id, "and data:", meetingData);
        await meetingService.updateMeeting(selectedEvent.id, meetingData);
        toast.success("Reuni\xE3o atualizada com sucesso");
      } else {
        await meetingService.createMeeting(meetingData);
        toast.success("Reuni\xE3o agendada com sucesso");
      }
      setOpenMeetingForm(false);
      fetchMeetings();
    } catch (error) {
      console.error("Erro ao salvar reuni\xE3o:", error);
      toast.error("Erro ao salvar reuni\xE3o");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteMeeting = async (meetingId) => {
    try {
      setLoading(true);
      console.log("Attempting to delete meeting with ID:", meetingId);
      if (typeof meetingId !== "number") {
        if (meetingId && typeof meetingId === "object" && meetingId.id) {
          meetingId = meetingId.id;
        } else if (typeof meetingId === "string") {
          meetingId = parseInt(meetingId, 10);
        }
      }
      if (isNaN(meetingId) || !meetingId) {
        toast.error("ID de reuni\xE3o inv\xE1lido");
        return;
      }
      const numericId = Number(meetingId);
      console.log("Sending delete request with numeric ID:", numericId);
      await meetingService.deleteMeeting(numericId);
      toast.success("Reuni\xE3o exclu\xEDda com sucesso");
      setOpenMeetingForm(false);
      fetchMeetings();
    } catch (error) {
      console.error("Erro ao excluir reuni\xE3o:", error);
      toast.error("Erro ao excluir reuni\xE3o");
    } finally {
      setLoading(false);
    }
  };
  const EventComponent = ({ event }) => {
    return /* @__PURE__ */ jsxDEV(
      Tooltip,
      {
        title: /* @__PURE__ */ jsxDEV(Box, { children: [
          /* @__PURE__ */ jsxDEV(Typography, { variant: "body2", fontWeight: "bold", children: event.title }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 194,
            columnNumber: 13
          }),
          /* @__PURE__ */ jsxDEV(Typography, { variant: "caption", children: [
            "Empresa: ",
            event.companyName
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 195,
            columnNumber: 13
          }),
          event.location && /* @__PURE__ */ jsxDEV(Typography, { variant: "caption", display: "block", children: [
            "Local: ",
            event.location
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 197,
            columnNumber: 15
          }),
          event.description && /* @__PURE__ */ jsxDEV(Typography, { variant: "caption", display: "block", children: event.description }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 202,
            columnNumber: 15
          }),
          /* @__PURE__ */ jsxDEV(Box, { mt: 1, children: /* @__PURE__ */ jsxDEV(
            Chip,
            {
              label: event.status,
              size: "small",
              color: event.status === "Realizada" ? "success" : event.status === "Cancelada" ? "error" : event.status === "Reagendada" ? "warning" : "primary"
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 207,
              columnNumber: 15
            }
          ) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 206,
            columnNumber: 13
          })
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 193,
          columnNumber: 11
        }),
        arrow: true,
        children: /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: "rbc-event-content",
            style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
            children: event.title
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 221,
            columnNumber: 9
          }
        )
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 191,
        columnNumber: 7
      }
    );
  };
  const eventStyleGetter = (event) => {
    const statusConfig = STATUS_COLORS[event.status] || STATUS_COLORS["Agendada"];
    return {
      style: {
        backgroundColor: statusConfig.backgroundColor,
        color: statusConfig.color,
        borderRadius: "4px",
        opacity: 0.9,
        border: "0px",
        display: "block",
        overflow: "hidden"
      }
    };
  };
  return /* @__PURE__ */ jsxDEV(Box, { sx: { height: "calc(100vh - 180px)" }, children: [
    loading && /* @__PURE__ */ jsxDEV(Box, { sx: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 1e3
    }, children: /* @__PURE__ */ jsxDEV(CircularProgress, {}, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 259,
      columnNumber: 11
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 252,
      columnNumber: 9
    }),
    /* @__PURE__ */ jsxDEV(
      BigCalendar,
      {
        localizer,
        events: meetings,
        startAccessor: "start",
        endAccessor: "end",
        style: { height: "100%" },
        selectable: true,
        onSelectEvent: handleSelectEvent,
        onSelectSlot: handleSelectSlot,
        views: ["month", "week", "day", "agenda"],
        eventPropGetter: eventStyleGetter,
        components: {
          event: EventComponent
        },
        formats: {
          dateFormat: "D",
          dayFormat: "ddd DD/MM",
          monthHeaderFormat: "MMMM YYYY",
          dayHeaderFormat: "dddd, D MMMM YYYY",
          dayRangeHeaderFormat: ({ start, end }) => `${moment(start).format("D MMMM YYYY")} - ${moment(end).format("D MMMM YYYY")}`
        },
        messages: {
          today: "Hoje",
          previous: "Anterior",
          next: "Pr\xF3ximo",
          month: "M\xEAs",
          week: "Semana",
          day: "Dia",
          agenda: "Agenda",
          date: "Data",
          time: "Hora",
          event: "Evento",
          noEventsInRange: "N\xE3o h\xE1 reuni\xF5es neste per\xEDodo."
        }
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 263,
        columnNumber: 7
      }
    ),
    /* @__PURE__ */ jsxDEV(
      Dialog,
      {
        open: openMeetingForm,
        onClose: () => setOpenMeetingForm(false),
        maxWidth: "md",
        fullWidth: true,
        children: /* @__PURE__ */ jsxDEV(
          MeetingForm,
          {
            companies,
            initialValues: editMode && selectedEvent ? {
              id: selectedEvent.id,
              title: selectedEvent.title,
              description: selectedEvent.description,
              startTime: selectedEvent.start,
              endTime: selectedEvent.end,
              location: selectedEvent.location,
              meetingType: selectedEvent.meetingType,
              status: selectedEvent.status,
              companyId: selectedEvent.companyId
            } : {
              startTime: selectedDate?.start,
              endTime: selectedDate?.end
            },
            onSubmit: handleMeetingSubmit,
            onCancel: () => setOpenMeetingForm(false),
            onDelete: handleDeleteMeeting,
            isEditing: editMode
          },
          void 0,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 307,
            columnNumber: 9
          }
        )
      },
      void 0,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 301,
        columnNumber: 7
      }
    )
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 250,
    columnNumber: 5
  });
};
var stdin_default = Calendar;
export {
  stdin_default as default
};
