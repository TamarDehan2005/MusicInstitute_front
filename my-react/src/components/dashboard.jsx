import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { CalendarToday, ListAlt, MusicNote } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function StudentHome() {
  const navigate = useNavigate();

  const goToSchedule = () => {
    navigate("/makeAlesson");
  };

  const goToMyLessons = () => {
    navigate("/mylessons");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "#f7f7f7",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
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
      {/* כותרת בצד שמאל למעלה */}
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
          gap: 1,
        }}
      >
        <MusicNote sx={{ fontSize: "2.2rem", color: "#e53935", mr: 1 }} />
        <Box component="span" sx={{ fontSize: "2.1rem", fontWeight: 900, mr: 0 }}>
          Music
        </Box>
        <Box component="span" sx={{ fontSize: "1.25rem", fontWeight: 900, ml: 0 }}>
          Institute
        </Box>
      </Typography>
      {/* תוכן מרכזי */}
      <Box
        sx={{
          width: 370,
          maxWidth: "95vw",
          bgcolor: "#fff",
          borderRadius: 4,
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.07)",
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          position: "relative",
          zIndex: 1,
        }}
      >      <Box
        sx={{
          width: 370,
          maxWidth: "95vw",
          bgcolor: "#fff",
          borderRadius: 4,
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.07)",
          p: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* כותרת מרכזית בלי אייקון */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#111",
            textAlign: "center",
            fontFamily: "Varela Round, Assistant, Arial, sans-serif",
            fontSize: "1.25rem",
            letterSpacing: 0.5,
            mb: 1,
          }}
        >
          ברוכים הבאים
        </Typography>
   
        <Button
          variant="contained"
          size="large"
          startIcon={<CalendarToday />}
          onClick={goToSchedule}
          sx={{
            fontWeight: "bold",
            borderRadius: 99,
            fontSize: "1.05rem",
            px: 4,
            py: 1.5,
            bgcolor: "#111",
            color: "#fff",
            boxShadow: "none",
            textTransform: "none",
            transition: "0.2s",
            "&:hover": {
              bgcolor: "#222",
              color: "#fff",
            },
          }}
        >
          קבע שיעור
        </Button>
        <Button
          variant="outlined"
          size="large"
          startIcon={<ListAlt />}
          onClick={goToMyLessons}
          sx={{
            fontWeight: "bold",
            borderRadius: 99,
            fontSize: "1.05rem",
            px: 4,
            py: 1.5,
            color: "#111",
            borderColor: "#111",
            boxShadow: "none",
            textTransform: "none",
            transition: "0.2s",
            "&:hover": {
              borderColor: "#222",
              color: "#222",
              bgcolor: "#f7f7f7",
            },
          }}
        >
          הצג את השיעורים שלי
        </Button>
      </Box>
      </Box>
    </Box>
  );
}