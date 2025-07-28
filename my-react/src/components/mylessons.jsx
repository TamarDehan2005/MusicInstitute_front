import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { format } from "date-fns";

export default function StudentAllLessons() {
  const { enqueueSnackbar } = useSnackbar();
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLessons = async () => {
    setLoading(true);
    const student = JSON.parse(localStorage.getItem("student") || "null");
    if (!student?.studentId) {
      enqueueSnackbar("לא נמצא Student ID – התחבר מחדש.", { variant: "error" });
      setLoading(false);
      return;
    }

    try {
      const [bookedRes, passedRes] = await Promise.all([
        fetch(`https://localhost:7108/api/Student/${student.studentId}/bookedLessons`),
        fetch(`https://localhost:7108/api/Student/${student.studentId}/passedLessons`),
      ]);
      if (!bookedRes.ok || !passedRes.ok) throw new Error("שגיאה בטעינת השיעורים");

      const [bookedData, passedData] = await Promise.all([
        bookedRes.json(),
        passedRes.json(),
      ]);

      const all = [...bookedData, ...passedData];
      const uniqueLessons = Array.from(
        new Map(
          all.map((lesson) => [
            `${lesson.LessonDate}_${lesson.LessonTime}_${lesson.Kind}_${lesson.TeacherFirstName}_${lesson.TeacherLastName}`,
            lesson,
          ])
        ).values()
      );

      uniqueLessons.sort((a, b) =>
        new Date(`${a.LessonDate}T${a.LessonTime}`) - new Date(`${b.LessonDate}T${b.LessonTime}`)
      );

      setAllLessons(uniqueLessons);
    } catch (e) {
      enqueueSnackbar(e.message, { variant: "error" });
      setAllLessons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f7f7f7",
          direction: "rtl",
        }}
      >
        
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "#f7f7f7",
        direction: "rtl",
        py: 6,
        px: 2,
        display: "flex",
        justifyContent: "center",
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
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 700,
          bgcolor: "#fff",
          borderRadius: 3,
          p: 4,
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color="#000000ff"
          mb={4}
          textAlign="center"
        >
          כל השיעורים שלי
        </Typography>

        {allLessons.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 4 }}
          >
            אין שיעורים להצגה.
          </Typography>
        ) : (
          <Stack spacing={3} sx={{ direction: "rtl" }}>
            {allLessons.map((l) => {
              const start = l.LessonDate && l.LessonTime
                ? new Date(`${l.LessonDate}T${l.LessonTime}`)
                : null;
              const end = start
                ? new Date(start.getTime() + (l.DurationMinutes || 0) * 60000)
                : null;
              const teacherName = [l.TeacherFirstName || "", l.TeacherLastName || ""]
                .join(" ")
                .trim() || "מורה לא ידוע";

              return (
                <Paper
                  key={`${l.LessonDate}_${l.LessonTime}_${l.Kind}`}
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: "#f7f7f7",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Typography
                      sx={{ fontWeight: 700, color: "#e53935", fontSize: "1.1rem" }}
                    >
                      {teacherName}
                    </Typography>
                    <Typography sx={{ fontSize: "0.95rem", color: "#222" }}>
                      תאריך: {start ? format(start, "dd/MM/yyyy") : "לא ידוע"}
                    </Typography>
                    <Typography sx={{ fontSize: "0.95rem", color: "#222" }}>
                      שעה: {start ? format(start, "HH:mm") : "??:??"} -{" "}
                      {end ? format(end, "HH:mm") : "??:??"}
                    </Typography>
                    <Typography sx={{ fontSize: "0.95rem", color: "#222" }}>
                      כלי: {l.Kind || "לא ידוע"}
                    </Typography>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
