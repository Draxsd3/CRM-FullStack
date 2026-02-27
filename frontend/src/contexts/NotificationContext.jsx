import { jsxDEV } from "react/jsx-dev-runtime";
import React, { createContext, useState, useCallback, useEffect, useRef, useContext } from "react";
import { toast } from "react-toastify";
import { Howl } from "howler";
import meetingService from "../services/meetingService";
import NotificationDialog from "../components/notifications/NotificationDialog";
import { AuthContext } from "./AuthContext";
const NotificationContext = createContext();
const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [currentMeetingNotification, setCurrentMeetingNotification] = useState(null);
  const originalTitle = useRef(document.title);
  const flashIntervalRef = useRef(null);
  const soundRef = useRef(null);
  const notificationCheckedRef = useRef({});
  const notificationTimeoutRef = useRef(null);
  const lastCheckTimeRef = useRef(0);
  const dialogZIndexRef = useRef(9999);
  const remindersRef = useRef([]);
  const reminderIntervalRef = useRef(null);
  const { isAuthenticated, loading } = useContext(AuthContext);
  useEffect(() => {
    soundRef.current = new Howl({
      src: ["https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"],
      // Lighter, prettier sound
      volume: 0.5,
      // Slightly lower volume for a gentler alert
      preload: true,
      html5: true,
      onload: () => console.log("Notification sound loaded successfully"),
      onloaderror: (id, error) => console.error("Failed to load notification sound:", error)
    });
    console.log("Notification sound initialized");
    const testSound = () => {
      console.log("Testing notification sound...");
      if (soundRef.current) {
        soundRef.current.play();
      }
    };
    setTimeout(testSound, 2e3);
    const savedCheckedState = localStorage.getItem("notificationChecked");
    if (savedCheckedState) {
      try {
        notificationCheckedRef.current = JSON.parse(savedCheckedState);
      } catch (e) {
        console.error("Error parsing saved notification state:", e);
        localStorage.removeItem("notificationChecked");
      }
    }
    reminderIntervalRef.current = setInterval(() => {
      checkReminders();
    }, 6e4);
    return () => {
      if (flashIntervalRef.current) {
        clearInterval(flashIntervalRef.current);
        document.title = originalTitle.current;
      }
      if (soundRef.current) {
        soundRef.current.unload();
      }
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      if (reminderIntervalRef.current) {
        clearInterval(reminderIntervalRef.current);
      }
    };
  }, []);
  const checkReminders = useCallback(() => {
    const now = Date.now();
    const remindersToShow = [];
    const updatedReminders = [];
    remindersRef.current.forEach((reminder) => {
      if (now >= reminder.remindTime) {
        remindersToShow.push(reminder.notification);
      } else {
        updatedReminders.push(reminder);
      }
    });
    remindersRef.current = updatedReminders;
    remindersToShow.forEach((notification) => {
      showUpcomingMeetingPopup(notification);
    });
  }, []);
  const addNotification = useCallback((notification) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      {
        id: Date.now(),
        read: false,
        timestamp: /* @__PURE__ */ new Date(),
        ...notification
      }
    ]);
    console.log("Playing notification sound...");
    if (soundRef.current) {
      try {
        soundRef.current.play();
        setTimeout(() => {
          soundRef.current.play();
        }, 2e3);
      } catch (err) {
        console.error("Error playing notification sound:", err);
        try {
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
          audio.volume = 0.5;
          audio.play();
        } catch (fallbackErr) {
          console.error("Fallback audio also failed:", fallbackErr);
        }
      }
    }
    const stopFlash = flashTitle(notification.title || "Nova Notifica\xE7\xE3o");
    return stopFlash;
  }, []);
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);
  const markAsRead = useCallback((id) => {
    setNotifications(
      (prev) => prev.map(
        (notification) => notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const flashTitle = useCallback((message) => {
    if (flashIntervalRef.current) {
      clearInterval(flashIntervalRef.current);
    }
    let isOriginal = true;
    const originalTitle2 = document.title;
    flashIntervalRef.current = setInterval(() => {
      document.title = isOriginal ? `\u{1F514} ${message}` : originalTitle2;
      isOriginal = !isOriginal;
    }, 1e3);
    console.log("Playing notification sound from flashTitle...");
    if (soundRef.current) {
      try {
        soundRef.current.play();
      } catch (err) {
        console.error("Error playing sound in flashTitle:", err);
      }
    }
    return () => {
      if (flashIntervalRef.current) {
        clearInterval(flashIntervalRef.current);
        document.title = originalTitle2;
      }
    };
  }, []);
  const stopFlashingTitle = useCallback(() => {
    if (flashIntervalRef.current) {
      clearInterval(flashIntervalRef.current);
      document.title = originalTitle.current;
    }
  }, []);
  const isNotificationChecked = useCallback((meetingId) => {
    return !!notificationCheckedRef.current[meetingId];
  }, []);
  const markMeetingNotificationChecked = useCallback((meetingId) => {
    notificationCheckedRef.current = {
      ...notificationCheckedRef.current,
      [meetingId]: true
    };
    localStorage.setItem("notificationChecked", JSON.stringify(notificationCheckedRef.current));
    if (currentMeetingNotification?.meetingId === meetingId) {
      setShowNotificationDialog(false);
      setCurrentMeetingNotification(null);
    }
    setNotifications(
      (prev) => prev.map(
        (notification) => notification.meetingId === meetingId ? { ...notification, read: true } : notification
      )
    );
    stopFlashingTitle();
  }, [currentMeetingNotification, stopFlashingTitle]);
  const dismissMeetingNotification = useCallback((acknowledged = true) => {
    if (currentMeetingNotification) {
      if (acknowledged) {
        markMeetingNotificationChecked(currentMeetingNotification.meetingId);
      } else {
        const reminderTime = Date.now() + 3 * 60 * 1e3;
        remindersRef.current.push({
          notification: currentMeetingNotification,
          remindTime: reminderTime
        });
        console.log(`Notification scheduled for reminder in 3 minutes at ${new Date(reminderTime).toLocaleTimeString()}`);
        toast.info("Voc\xEA ser\xE1 lembrado em 3 minutos");
      }
      setShowNotificationDialog(false);
      setCurrentMeetingNotification(null);
    }
  }, [currentMeetingNotification, markMeetingNotificationChecked]);
  const showUpcomingMeetingPopup = useCallback((meetingNotification) => {
    console.log("Showing popup for meeting notification:", meetingNotification);
    setShowNotificationDialog(false);
    setCurrentMeetingNotification(null);
    setTimeout(() => {
      setCurrentMeetingNotification(meetingNotification);
      setShowNotificationDialog(true);
      setTimeout(() => {
        const dialogElement = document.querySelector('[role="dialog"]');
        if (dialogElement) {
          dialogElement.focus();
          console.log("Dialog focused");
        }
        if (soundRef.current) {
          soundRef.current.play();
        }
      }, 100);
    }, 300);
  }, []);
  useEffect(() => {
    if (!isAuthenticated || loading) {
      return;
    }
    const checkUpcomingMeetings = async () => {
      try {
        const now = /* @__PURE__ */ new Date();
        if (now.getTime() - lastCheckTimeRef.current < 1e4) {
          return;
        }
        lastCheckTimeRef.current = now.getTime();
        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + 1);
        const meetings = await meetingService.getMeetingsByDateRange(
          now.toISOString().split("T")[0],
          endDate.toISOString().split("T")[0]
        );
        console.log("Checking for upcoming meetings, found:", meetings.length);
        const onlineMeetings = meetings.filter((meeting) => {
          const meetingTime = new Date(meeting.startTime);
          const timeDiff = (meetingTime - now) / (1e3 * 60);
          const isSoon = (meeting.meetingType === "Virtual" || meeting.location?.toLowerCase().includes("zoom") || meeting.location?.toLowerCase().includes("meet")) && timeDiff > 0 && timeDiff <= 20 && meeting.status === "Agendada" && meeting.enableNotification !== false && !isNotificationChecked(meeting.id);
          if (isSoon) {
            console.log(`Meeting "${meeting.title}" starts in ${timeDiff.toFixed(1)} minutes`);
          }
          return isSoon;
        });
        console.log("Found upcoming online meetings:", onlineMeetings.length);
        setUpcomingMeetings(onlineMeetings);
        for (const meeting of onlineMeetings) {
          const existingNotification = notifications.find(
            (n) => n.type === "upcoming-meeting" && n.meetingId === meeting.id
          );
          if (!existingNotification && !isNotificationChecked(meeting.id)) {
            const meetingStartTime = new Date(meeting.startTime);
            const minutesUntilMeeting = Math.round((meetingStartTime - now) / (1e3 * 60));
            console.log(`Creating notification for meeting "${meeting.title}" in ${minutesUntilMeeting} minutes`);
            const newNotification = {
              id: `meeting-${meeting.id}-${Date.now()}`,
              type: "upcoming-meeting",
              meetingId: meeting.id,
              title: "Reuni\xE3o em Breve",
              message: `A reuni\xE3o "${meeting.title}" come\xE7a em ${minutesUntilMeeting} minutos!`,
              meeting,
              priority: "high",
              minutesUntilMeeting
            };
            addNotification(newNotification);
            if ("Notification" in window) {
              if (Notification.permission === "granted") {
                new Notification("Reuni\xE3o em Breve", {
                  body: `A reuni\xE3o "${meeting.title}" come\xE7a em ${minutesUntilMeeting} minutos`,
                  icon: "/favicon.ico",
                  tag: `meeting-${meeting.id}`,
                  requireInteraction: true
                });
              } else if (Notification.permission !== "denied") {
                Notification.requestPermission();
              }
            }
            showUpcomingMeetingPopup(newNotification);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar pr\xF3ximas reuni\xF5es:", error);
      }
    };
    checkUpcomingMeetings();
    const interval = setInterval(checkUpcomingMeetings, 15e3);
    return () => {
      clearInterval(interval);
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      stopFlashingTitle();
    };
  }, [isAuthenticated, loading, addNotification, notifications, isNotificationChecked, stopFlashingTitle, showUpcomingMeetingPopup]);
  const dismissAllUpcomingMeetingNotifications = useCallback(() => {
    const upcomingMeetingNotifications = notifications.filter((n) => n.type === "upcoming-meeting");
    upcomingMeetingNotifications.forEach((notification) => {
      if (notification.meetingId) {
        markMeetingNotificationChecked(notification.meetingId);
      }
      removeNotification(notification.id);
    });
    stopFlashingTitle();
    setShowNotificationDialog(false);
    setCurrentMeetingNotification(null);
  }, [notifications, removeNotification, stopFlashingTitle, markMeetingNotificationChecked]);
  const contextValue = {
    notifications,
    upcomingMeetings,
    addNotification,
    removeNotification,
    markAsRead,
    unreadCount,
    flashTitle,
    stopFlashingTitle,
    dismissAllUpcomingMeetingNotifications,
    isNotificationChecked,
    markMeetingNotificationChecked,
    showNotificationDialog,
    currentMeetingNotification,
    dismissMeetingNotification
  };
  useEffect(() => {
    console.log("Dialog state:", {
      showNotificationDialog,
      hasCurrentMeeting: !!currentMeetingNotification
    });
    if (currentMeetingNotification) {
      console.log("Current meeting notification:", currentMeetingNotification);
    }
  }, [showNotificationDialog, currentMeetingNotification]);
  return /* @__PURE__ */ jsxDEV(NotificationContext.Provider, { value: contextValue, children: [
    children,
    /* @__PURE__ */ jsxDEV("div", { style: { position: "relative", zIndex: dialogZIndexRef.current }, children: showNotificationDialog && currentMeetingNotification && /* @__PURE__ */ jsxDEV(
      NotificationDialog,
      {
        open: showNotificationDialog,
        notification: currentMeetingNotification,
        onClose: () => dismissMeetingNotification(false),
        onConfirm: () => dismissMeetingNotification(true)
      },
      `notification-dialog-${currentMeetingNotification.id}`,
      false,
      {
        fileName: "<stdin>",
        lineNumber: 443,
        columnNumber: 11
      }
    ) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 441,
      columnNumber: 7
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 439,
    columnNumber: 5
  });
};
export {
  NotificationContext,
  NotificationProvider
};
