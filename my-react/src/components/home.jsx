import React, { useEffect, useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { MusicNote, ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";

const colors = {
  black: "#121212",
  white: "#ffffff",
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const recommendations = [
  {
    image: "/images/6.jpg",
    quote: "הטיפול כאן עשה מה שלא הצלחנו במשך שנים!",
    name: "יעל, אמא של שירה",
  },
  {
    image: "/images/6.jpg",
    quote: "הילד שלי פורח – צוות מקצועי, רגיש, מדויק.",
    name: "משפחת לוי",
  },
  {
    image: "/images/6.jpg",
    quote: "לא האמנתי כמה מוזיקה יכולה לרפא.",
    name: "דפנה מ.",
  },
  {
    image: "/images/6.jpg",
    quote: "כל שבוע זו חוויה אחרת, מלאה רגש ודיוק.",
    name: "נועם, בן 15",
  },
];

export default function TherapyHome() {
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [ref2, inView2] = useInView({ triggerOnce: false, threshold: 0.2 });
  const navigate = useNavigate();

  const controls1 = useAnimation();
  const controls2 = useAnimation();

  useEffect(() => {
    if (inView1) controls1.start("visible");
  }, [inView1]);

  useEffect(() => {
    if (inView2) controls2.start("visible");
  }, [inView2]);

  const pageSize = 2;
  const [page, setPage] = useState(0);
  const maxPage = Math.ceil(recommendations.length / pageSize) - 1;

  const handlePrev = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : maxPage));
  };

  const handleNext = () => {
    setPage((prev) => (prev < maxPage ? prev + 1 : 0));
  };

  const currentRecs = recommendations.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <Box
      sx={{
        m: 0,
        p: 0,
        overflowX: "hidden",
        width: "100vw",
        bgcolor: colors.black,
        color: colors.white,
        fontFamily: "'Varela Round', Arial, sans-serif",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50px",
          width: "100%",
          zIndex: 3,
          direction: "rtl",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "80px",
            borderTop: "1px solid white",
            borderBottom: "1px solid white",
            bgcolor: "transparent",
            px: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", height: "100%", pl: 2 }}>
            <Box sx={{ px: 3, display: "flex", alignItems: "center", height: "100%" }}>
              <Typography sx={{ fontWeight: "bold", color: "white" }}>
                מכון לטיפול במוזיקה
              </Typography>
            </Box>
            <Box sx={{ height: "100%", width: "1px", backgroundColor: "white" }} />
            <Button
              onClick={() => navigate("/login")}
              sx={{
                height: "100%",
                color: "white",
                borderRadius: 0,
                px: 3,
                fontWeight: "bold",
              }}
            >
              התחברות
            </Button>
            <Button
              sx={{
                height: "100%",
                color: "white",
                borderRadius: 0,
                px: 3,
                fontWeight: "bold",
              }}
            >
              כניסת מנהל
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            <Box sx={{ height: "100%", width: "1px", backgroundColor: "white", mr: 1 }} />
            <Box sx={{ px: 2 }}>
              <MusicNote sx={{ color: "white", fontSize: 28 }} />
            </Box>
          </Box>
        </Box>
      </Box>


      {/* אזור פתיחה */}
      <Box
        ref={ref1}
        sx={{
          minHeight: "90vh",
          backgroundImage: "url('/images/13.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: 5,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.6)",
            zIndex: 1,
          }}
        />
        <motion.div
          initial="hidden"
          animate={controls1}
          variants={fadeUp}
          style={{ zIndex: 2, maxWidth: 600, textAlign: "right" }}
        >
          <Typography
            variant="h2"
            fontWeight={700}
            mb={2}
            sx={{
              color: colors.white,
              textShadow: "2px 2px 6px rgba(0,0,0,0.9)",
              lineHeight: 1.2,
            }}
          >
            מכון רפואה במוזיקה
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: colors.white,
              textShadow: "1px 1px 5px rgba(0,0,0,0.9)",
            }}
          >
            נוסד בשנת 2010 לקידום התרפיה במוזיקה בישראל ולמתן מענה רגשי באמצעות הצליל.
          </Typography>
        </motion.div>
      </Box>

      {/* סקשן המלצות עם דפדוף */}
      <Box
        ref={ref2}
        sx={{
          py: 8,
          px: { xs: 2, md: 8 },
          bgcolor: "transparent",
          position: "relative",
          textAlign: "center",
          maxWidth: 720,
          margin: "0 auto",
          overflow: "visible",
        }}
      >
        {/* תמונת רקע שקופה בצד ימין */}
        <Box
          component="img"
          src="/images/15.png"
          alt="רקע המלצות ימין"
          sx={{
            position: "absolute",
            top: "50%",
            right: -250,
            transform: "translateY(-60%)",
            width: 500,
            height: 500,
            opacity: 0.2,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
          }}
        />



        <Typography
          variant="h4"
          sx={{
            mb: 5,
            color: "white",
            fontWeight: 600,
            textShadow: "2px 2px 5px rgba(0,0,0,0.8)",
            position: "relative",
            zIndex: 1,
          }}
        >
          - לקוחות ממליצים -
        </Typography>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          {inView2 && (
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: -60,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "white",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                zIndex: 10,
                height: 50,
                width: 50,
                transition: "background-color 0.3s",
              }}
              aria-label="הקודם"
            >
              <ArrowBackIos />
            </IconButton>
          )}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 3,
              width: "100%",
              maxWidth: 640,
            }}
          >
            {currentRecs.map((rec, i) => (
              <Box
                key={i}
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                  border: "2px solid white",
                  height: 150,
                }}
              >
                <Box
                  component="img"
                  src={rec.image}
                  alt="recommendation"
                  sx={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.3,
                    zIndex: 1,
                  }}
                />

                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 2,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    color: "white",
                    textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
                  }}
                >
                  <Typography variant="body1" sx={{ fontStyle: "italic", fontSize: "0.9rem" }}>
                    “{rec.quote}”
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", mt: 1, opacity: 0.9 }}>
                    – {rec.name}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {inView2 && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: -60,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "white",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                zIndex: 10,
                height: 50,
                width: 50,
                transition: "background-color 0.3s",
              }}
              aria-label="הבא"
            >
              <ArrowForwardIos />
            </IconButton>
          )}
          
        </Box>
        </Box> 
<Box
  sx={{
    py: 10,
    px: { xs: 2, md: 10 },
    display: "flex",
    flexDirection: "column",
    gap: 6,
  }}
>
  {/* פס לבן אופקי */}
  <Box
    sx={{
      height: "2px",
      width: "500px",
      backgroundColor: "white",
      mx: "auto",
      mb: 2,
    }}
  />

  <Typography
    variant="h4"
    sx={{
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      mb: 4,
      textShadow: "2px 2px 5px rgba(0,0,0,0.8)",
    }}
  >
   ?למה לבחור דווקא בנו 
  </Typography>

  {[ // שאר התוכן נשאר זהה
    {
      text: "מעל 15 שנות ניסיון בתרפיה רגשית במוזיקה עם מאות ילדים, בני נוער ומבוגרים",
      img: "/images/22.jpg",
    },
    {
      text: "צוות מוסמך, מקצועי וקשוב – שמותאם אישית לכל מטופל",
      img: "/images/21.jpg",
    },
    {
      text: "תוכנית טיפול ייחודית המתמקדת בהתפתחות רגשית דרך צלילים ויצירה",
      img: "/images/27.webp",
    },
    {
      text: "מכון באווירה ביתית ונעימה עם חדרי טיפול חדשניים ומצוידים",
      img: "/images/25.webp",
    },
    {
      text: "שילוב גישות מתקדמות מעולם הפסיכולוגיה והחינוך המוזיקלי ",
      img: "/images/26.webp",
    },
  ].map((item, index) => (
    <Box
      key={index}
      sx={{
        display: "flex",
        flexDirection: index % 2 === 0 ? "row" : "row-reverse",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Box sx={{ flex: 1 }}>
<Typography
  variant="h6"
  sx={{
    color: "white",
    fontSize: "2rem",
    fontWeight: 400,
    lineHeight: 1.8,
    textAlign: "right",
    textShadow: `
      1px 1px 2px rgba(221, 27, 27, 0.5),
      -1px -1px 2px rgba(59, 59, 59, 0.76)
    `,
    WebkitTextStroke: "0.4px rgba(94, 6, 6, 0.8)",
    fontFamily: "'Assistant', 'Varela Round', sans-serif",
    position: "relative",
    pb: 2, 
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      right: 0,
      width: "60%",
      height: "2px",
      backgroundColor: "white",
    },
  }}
>
  {item.text}
</Typography>


      </Box>

      <Box sx={{ flex: 1 }}>
        <Box
          component="img"
          src={item.img}
          alt="תמונה סיבה לבחור בנו"
          sx={{
            width: "100%",
            maxHeight: 220,
            objectFit: "cover",
            borderRadius: 3,
            boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
          }}
        />
      </Box>
    </Box>
  ))}




 

  {/* תוכן הסקשן */}
<Box
  sx={{
     minwidth: "1000px",
    width: "100vw",
    bgcolor: "#000",
    color: "#fff",
    py: { xs: 3, md: 4 },
    px: 0,
    m: 0,
    position: "relative",
    left: 0,
    right: 0,
    borderTop: "2px solid #fff",
    borderBottom: "2px solid #fff",
    fontFamily: "'Assistant', 'Varela Round', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflowX: "hidden",
  }}
>
  <Box
    sx={{
      gridtemplatecolumns: "70px 1fr 1fr 1fr 1fr  1fr 120px",

       minwidth: "1000px",
      width: "100%",
      maxWidth: 420,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <Typography
     
      variant="h3"
      sx={{
       minwidth: "1000px",
        fontWeight: 700,
        mb: 2,
        color: "#fff",
        letterSpacing: "2px",
        textAlign: "center",
        borderBottom: "2px solid #e53935",
        display: "inline-block",
        px: 3,
        pb: 1,
      }}
    >
      צור קשר
    </Typography>

    <Typography
      sx={{
        fontSize: "1.1rem",
        mb: 5,
        color: "#fff",
        textAlign: "center",
        maxWidth: 400,
        lineHeight: 1.7,
      }}
    >
      נשמח לשוחח, לייעץ ולהקשיב.
      <br />
      מוזמנים לפנות אלינו בטלפון, במייל או לבקר אותנו במכון – בתיאום מראש.
    </Typography>

    <Box
      sx={{
        minwidth: "1000px", // Adjusted to ensure the box is wide enough
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        mb: 0,
        border: "1px solid #fff",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "#111",
      }}
    >
      {/* טלפון */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          py: 2,
          px: 2,
          borderBottom: "1px solid #fff",
        }}
      >
        <span style={{ fontSize: 26, color: "#e53935", marginLeft: 10 }}>☎</span>
        <Typography sx={{ fontWeight: "bold", color: "#fff", mr: 1 }}>טלפון:</Typography>
        <Typography sx={{ color: "#fff", mr: 1 }}>03-1234567</Typography>
      </Box>

      {/* מייל */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          py: 2,
          px: 2,
          borderBottom: "1px solid #fff",
        }}
      >
        <span style={{ fontSize: 26, color: "#e53935", marginLeft: 10 }}>✉</span>
        <Typography sx={{ fontWeight: "bold", color: "#fff", mr: 1 }}>מייל:</Typography>
        <Typography sx={{ color: "#fff", mr: 1 }}>
          info@music-therapy.co.il
        </Typography>
      </Box>

      {/* כתובת */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          py: 2,
          px: 2,
        }}
      >
        <span style={{ fontSize: 26, color: "#e53935", marginLeft: 10 }}>📍</span>
        <Typography sx={{ fontWeight: "bold", color: "#fff", mr: 1 }}>כתובת:</Typography>
        <Typography sx={{ color: "#fff", mr: 1 }}>רח' הרמוניה 7, תל אביב</Typography>
      </Box>
    </Box>
  </Box>
</Box>

    </Box>
</Box>
    
  );
}
