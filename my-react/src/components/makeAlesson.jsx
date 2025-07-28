import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
  IconButton,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { he } from "date-fns/locale";
import { format, addDays } from "date-fns";
import { useSnackbar } from "notistack";

export default function StudentSchedule() {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [freeLessons, setFreeLessons] = useState({});
  const [loading, setLoading] = useState(true);
  const [allInstruments, setAllInstruments] = useState([]);
  const [searchDate, setSearchDate] = useState(null);
  const [searchInstrument, setSearchInstrument] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://localhost:7108/api/AvailableLessons/all");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const grouped = {};
        const instrumentsSet = new Set();
        data.forEach((lesson) => {
          const startDT =
            lesson.startDateTime ??
            (lesson.LessonDate && lesson.LessonTime
              ? `${lesson.LessonDate}T${lesson.LessonTime}`
              : null);
          if (!startDT) return;
          const start = new Date(startDT);
          if (isNaN(start)) return;
          if (!lesson.endDateTime && lesson.DurationMinutes) {
            const end = new Date(start);
            end.setMinutes(end.getMinutes() + lesson.DurationMinutes);
            lesson.endDateTime = end.toISOString();
          }
          lesson.startDateTime = startDT;
          const key = format(start, "yyyy-MM-dd");
          grouped[key] = grouped[key] ? [...grouped[key], lesson] : [lesson];
          instrumentsSet.add(lesson.Kind || lesson.Instrument || "לא ידוע");
        });
        setFreeLessons(grouped);
        setAllInstruments(Array.from(instrumentsSet));
      } catch (e) {
        enqueueSnackbar("שגיאה בטעינת שיעורים", { variant: "error" });
      } finally {
        setLoading(false);
      }
    })();
  }, [enqueueSnackbar]);

  const changeDay = (diff) => {
    setSelectedDate((prev) => addDays(prev, diff));
  };

  const handlePick = async (lessonId) => {
    const student = JSON.parse(localStorage.getItem("student") || "null");
    const studentId = Number(student?.studentId ?? 0);
    if (!studentId) {
      enqueueSnackbar("לא נמצא StudentId – התחבר מחדש.", { variant: "error" });
      return;
    }
    let selectedLesson;
    outer: for (const day in freeLessons) {
      for (const l of freeLessons[day]) {
        if (l.LessonId === lessonId) {
          selectedLesson = l;
          break outer;
        }
      }
    }
    if (!selectedLesson) {
      enqueueSnackbar("השיעור לא נמצא.", { variant: "error" });
      return;
    }
    const bodyData = {
      LessonId: lessonId,
      StudentIdLessons: studentId,
      Kind: selectedLesson.Kind || "לא ידוע",
      StudentFirstName: student.firstName || "לא ידוע",
      StudentLastName: student.lastName || "לא ידוע",
      TeacherFirstName: selectedLesson.TeacherFirstName || "לא ידוע",
      TeacherLastName: selectedLesson.TeacherLastName || "לא ידוע",
    };
    try {
      const res = await fetch("https://localhost:7108/api/Student/bookLesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      const text = await res.text();
      if (!res.ok) {
        enqueueSnackbar(text || "שגיאה בקביעת שיעור", { variant: "error" });
        return;
      }
      enqueueSnackbar(text || "השיעור נקבע!", { variant: "success" });
      setFreeLessons((prev) => {
        const copy = { ...prev };
        for (const k in copy) copy[k] = copy[k].filter((l) => l.LessonId !== lessonId);
        return copy;
      });
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
    }
  };

  const dayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  const actualDate = searchDate ? searchDate : selectedDate;
  const dateKey = format(actualDate, "yyyy-MM-dd");
  let slots = freeLessons[dateKey] || [];
  if (searchInstrument) {
    slots = slots.filter(
      (slot) =>
        (slot.Kind || slot.Instrument || "לא ידוע") === searchInstrument
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          bgcolor: "#f7f7f7",
          direction: "rtl",
          position: "relative",
        }}
      >
           {/* אלמנט רקע דקורטיבי */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -80,
                      left: -80,
                      width: 220,
                      height: 220,
                      bgcolor: "#e53935",
                      opacity: 0.08,
                      borderRadius: "50%",
                      zIndex: 0,
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -60,
                      right: -60,
                      width: 160,
                      height: 160,
                      bgcolor: "#111",
                      opacity: 0.07,
                      borderRadius: "50%",
                      zIndex: 0,
                    }}
                  />
        {/* כותרת בצד שמאל למעלה בדיוק כמו ב-login */}
        <Typography
          sx={{
            position: "absolute",
            top: 18,
            left: 24,
            fontWeight: 900,
            fontSize: "2.1rem",
            color: "#111",
            fontFamily: "'Rubik Rounded', 'Varela Round', 'Arial Rounded MT Bold', Arial, sans-serif",
            zIndex: 2,
            letterSpacing: 1.5,
            borderRadius: 2,
            px: 1,
            textShadow: "0 1px 0 #fff, 0 2px 8px #eee",
            lineHeight: 1.1,
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 0,
          }}
        >
          <Box component="span" sx={{ fontSize: "1.25rem", fontWeight: 900, mr: 0 }}>
             Institute
          </Box>
          <Box component="span" sx={{ fontSize: "2.1rem", fontWeight: 900, ml: 0 }}>
            Music
          </Box>
        </Typography>
        {/* חיפוש ממורכז מעל הכל, מחוץ לריבוע התאריכים */}
        <Box sx={{ width: "100%", maxWidth: 600, mt: 6, mb: 0, display: "flex", justifyContent: "center" }}>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", width: "100%" }}>
            <DatePicker
              label="חפש לפי תאריך"
              value={searchDate}
              onChange={(newValue) => setSearchDate(newValue)}
              slotProps={{
                textField: {
                  placeholder: "חפש לפי תאריך",
                  sx: {
                    minWidth: 160,
                    direction: "rtl",
                    background: "#fff",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& fieldset": { borderColor: "#111" },
                      "&:hover fieldset": { borderColor: "#111" },
                      "&.Mui-focused fieldset": { borderColor: "#111" },
                    },
                    "& .MuiOutlinedInput-root:hover": {
                      borderColor: "#111",
                      "& fieldset": { borderColor: "#111 !important" },
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      borderColor: "#111",
                      "& fieldset": { borderColor: "#111 !important" },
                    },
                    fontSize: "1rem",
                  },
                  size: "small",
                  InputLabelProps: {
                    shrink: true,
                    sx: {
                      color: "#aaa",
                      right: 0,
                      left: "unset",
                      textAlign: "right",
                      fontSize: "0.85rem",
                      background: "#fff",
                      px: 0.5,
                      mt: 0,
                      zIndex: 2,
                    }
                  }
                },
              }}
              format="dd/MM/yyyy"
              localeText={{ calendarWeekNumberHeaderText: "שבוע" }}
            />
            <TextField
              select
              label="חפש לפי כלי"
              placeholder="חפש לפי כלי"
              value={searchInstrument}
              onChange={(e) => setSearchInstrument(e.target.value)}
              sx={{
                minWidth: 160,
                direction: "rtl",
                background: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": { borderColor: "#111" },
                  "&:hover fieldset": { borderColor: "#111" },
                  "&.Mui-focused fieldset": { borderColor: "#111" },
                },
                "& .MuiOutlinedInput-root:hover": {
                  borderColor: "#111",
                  "& fieldset": { borderColor: "#111 !important" },
                },
                "& .MuiOutlinedInput-root.Mui-focused": {
                  borderColor: "#111",
                  "& fieldset": { borderColor: "#111 !important" },
                },
                fontSize: "1rem",
              }}
              size="small"
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: "#aaa",
                  right: 0,
                  left: "unset",
                  textAlign: "right",
                  fontSize: "0.85rem",
                  background: "#fff",
                  px: 0.5,
                  mt: 0,
                  zIndex: 2,
                }
              }}
            >
              <MenuItem value="">הכל</MenuItem>
              {allInstruments.map((inst) => (
                <MenuItem key={inst} value={inst}>{inst}</MenuItem>
              ))}
            </TextField>
            {(searchDate || searchInstrument) && (
              <Button
                variant="outlined"
                color="error"
                sx={{
                  height: 40,
                  alignSelf: "center",
                  borderColor: "#111",
                  color: "#111",
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": { borderColor: "#222", color: "#222" },
                  fontSize: "1rem",
                }}
                onClick={() => { setSearchDate(null); setSearchInstrument(""); }}
              >
                נקה חיפוש
              </Button>
            )}
          </Box>
        </Box>
        {/* קו מפריד בין החיפוש לתאריכים */}
        <Box sx={{ width: "100%", maxWidth: 600, borderBottom: "2px solid #111", mt: 2, mb: 2 }} />
        {/* ריבוע התאריכים והבחירה */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 600,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "#fff",
            borderRadius: 4,
            boxShadow: "0 2px 16px 0 rgba(0,0,0,0.07)",
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#2d2d2d",
              mb: 2,
              textAlign: "center",
              fontSize: "1.3rem",
              width: "100%",
              direction: "rtl",
            }}
          >
            בחר את מועד ושעת השיעור
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, width: "100%", justifyContent: "center" }}>
            <IconButton onClick={() => setSearchDate(null) || changeDay(-1)} aria-label="יום קודם" sx={{ color: "#e53935" }}>
              <ArrowBackIos />
            </IconButton>
            <Box sx={{ minWidth: 120, textAlign: "center" }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#e53935" }}>
                {dayNames[actualDate.getDay()]}
              </Typography>
              <Typography sx={{ fontSize: "1rem", color: "#222" }}>
                {format(actualDate, "dd/MM/yyyy")}
              </Typography>
            </Box>
            <IconButton onClick={() => setSearchDate(null) || changeDay(1)} aria-label="יום הבא" sx={{ color: "#e53935" }}>
              <ArrowForwardIos />
            </IconButton>
          </Box>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#e53935",
              fontSize: "1.1rem",
              mb: 1,
              alignSelf: "flex-end",
              direction: "rtl",
            }}
          >
            שיעורים פנויים
          </Typography>
          {loading ? (
            <CircularProgress sx={{ mt: 2 }} />
          ) : (
            <Stack spacing={2} sx={{ width: "100%", direction: "rtl" }}>
              {slots.length === 0 ? (
                <Typography color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
                  אין שיעורים פנויים בתאריך זה.
                </Typography>
              ) : (
                slots.map((slot) => {
                  const start = format(new Date(slot.startDateTime), "HH:mm");
                  const end = format(new Date(slot.endDateTime || slot.startDateTime), "HH:mm");
                  return (
                    <Paper
                      key={slot.LessonId}
                      elevation={1}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: "#f7f7f7",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        direction: "rtl",
                      }}
                    >
                      <Box sx={{ flex: 1, textAlign: "right" }}>
                        <Typography sx={{ fontWeight: 700, color: "#e53935", fontSize: "1.05rem" }}>
                          שעה: {start} - {end}
                        </Typography>
                        <Typography sx={{ color: "#222", fontSize: "0.98rem" }}>
                          כלי: {slot.Kind || slot.Instrument || "לא ידוע"}
                        </Typography>
                        <Typography sx={{ color: "#222", fontSize: "0.98rem" }}>
                          מורה: {slot.TeacherFirstName || ""} {slot.TeacherLastName || ""}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "#e53935",
                          color: "#fff",
                          borderRadius: 99,
                          px: 3,
                          py: 1,
                          fontWeight: "bold",
                          fontSize: "1rem",
                          boxShadow: "none",
                          textTransform: "none",
                          "&:hover": { bgcolor: "#b71c1c" },
                        }}
                        onClick={() => handlePick(slot.LessonId)}
                      >
                        הזמן
                      </Button>
                    </Paper>
                  );
                })
              )}
            </Stack>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
}