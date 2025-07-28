import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  CircularProgress,
} from "@mui/material";
import { Person, Mail, PhoneAndroid, Lock, Visibility, VisibilityOff, MusicNote } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useNavigate, Link } from "react-router-dom";

const schema = yup.object({
  FirstName: yup.string().required("שם פרטי חובה"),
  LastName: yup.string().required("שם משפחה חובה"),
  Phone: yup.string().required("טלפון חובה").matches(/^[0-9+]{7,15}$/, "מספר טלפון לא תקין"),
  Email: yup.string().email("אימייל לא תקין").required("אימייל חובה"),
  StudentPassword: yup.string().min(6, "סיסמה לפחות 6 תווים").required("סיסמה חובה"),
});

export default function RegisterPage() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      FirstName: "",
      LastName: "",
      Phone: "",
      Email: "",
      StudentPassword: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("https://localhost:7108/api/student/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          Instrument: "",
          Level: 0,
        }),
      });

      const text = await res.text();
      if (!res.ok) throw new Error(text || "שגיאה ברישום");

      enqueueSnackbar("הרישום הושלם בהצלחה!", { variant: "success" });
      navigate("/login");
    } catch (e) {
      enqueueSnackbar(e.message || "שגיאה ברישום", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fff",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
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

      {/* מרכז הטופס */}
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          direction: "rtl",
        }}
      >
        <Box
          sx={{
            width: 300,
            maxWidth: "95vw",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "transparent",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: "#111",
              textAlign: "center",
              fontFamily: "Varela Round, Assistant, Arial, sans-serif",
              fontSize: "1.15rem",
              letterSpacing: 0.5,
            }}
          >
            רישום תלמיד חדש
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }} noValidate>
            <Controller
              name="FirstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="שם פרטי"
                  fullWidth
                  margin="normal"
                  error={!!errors.FirstName}
                  helperText={errors.FirstName?.message}
                  variant="outlined"
                  dir="rtl"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#111" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 4,
                    fontSize: "0.95rem",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      "& fieldset": { borderColor: "#111" },
                      "&:hover fieldset": { borderColor: "#111" },
                      "&.Mui-focused fieldset": { borderColor: "#111" },
                    },
                    mb: 2,
                  }}
                  InputLabelProps={{
                    sx: {
                      color: "#111",
                      right: 0,
                      left: "unset",
                      textAlign: "right",
                      fontSize: "1.05rem",
                      background: "#fff",
                      px: 0.5,
                      mt: "-2px",
                    }
                  }}
                  FormHelperTextProps={{
                    sx: {
                      color: "#111",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      textAlign: "right",
                      mr: 0,
                    }
                  }}
                />
              )}
            />
            <Controller
              name="LastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="שם משפחה"
                  fullWidth
                  margin="normal"
                  error={!!errors.LastName}
                  helperText={errors.LastName?.message}
                  variant="outlined"
                  dir="rtl"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#111" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 4,
                    fontSize: "0.95rem",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      "& fieldset": { borderColor: "#111" },
                      "&:hover fieldset": { borderColor: "#111" },
                      "&.Mui-focused fieldset": { borderColor: "#111" },
                    },
                    mb: 2,
                  }}
                  InputLabelProps={{
                    sx: {
                      color: "#111",
                      right: 0,
                      left: "unset",
                      textAlign: "right",
                      fontSize: "1.05rem",
                      background: "#fff",
                      px: 0.5,
                      mt: "-2px",
                    }
                  }}
                  FormHelperTextProps={{
                    sx: {
                      color: "#111",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      textAlign: "right",
                      mr: 0,
                    }
                  }}
                />
              )}
            />
            <Controller
              name="Phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="טלפון"
                  fullWidth
                  margin="normal"
                  error={!!errors.Phone}
                  helperText={errors.Phone?.message}
                  variant="outlined"
                  dir="rtl"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneAndroid sx={{ color: "#111" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 4,
                    fontSize: "0.95rem",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      "& fieldset": { borderColor: "#111" },
                      "&:hover fieldset": { borderColor: "#111" },
                      "&.Mui-focused fieldset": { borderColor: "#111" },
                    },
                    mb: 2,
                  }}
                  InputLabelProps={{
                    sx: {
                      color: "#111",
                      right: 0,
                      left: "unset",
                      textAlign: "right",
                      fontSize: "1.05rem",
                      background: "#fff",
                      px: 0.5,
                      mt: "-2px",
                    }
                  }}
                  FormHelperTextProps={{
                    sx: {
                      color: "#111",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      textAlign: "right",
                      mr: 0,
                    }
                  }}
                />
              )}
            />
            <Controller
              name="Email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="email"
                  label="אימייל"
                  fullWidth
                  margin="normal"
                  error={!!errors.Email}
                  helperText={errors.Email?.message}
                  variant="outlined"
                  dir="rtl"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail sx={{ color: "#111" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 4,
                    fontSize: "0.95rem",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      "& fieldset": { borderColor: "#111" },
                      "&:hover fieldset": { borderColor: "#111" },
                      "&.Mui-focused fieldset": { borderColor: "#111" },
                    },
                    mb: 2,
                  }}
                  InputLabelProps={{
                    sx: {
                      color: "#111",
                      right: 0,
                      left: "unset",
                      textAlign: "right",
                      fontSize: "1.05rem",
                      background: "#fff",
                      px: 0.5,
                      mt: "-2px",
                    }
                  }}
                  FormHelperTextProps={{
                    sx: {
                      color: "#111",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      textAlign: "right",
                      mr: 0,
                    }
                  }}
                />
              )}
            />
            <Controller
              name="StudentPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type={showPwd ? "text" : "password"}
                  label="סיסמה"
                  fullWidth
                  margin="normal"
                  error={!!errors.StudentPassword}
                  helperText={errors.StudentPassword?.message}
                  variant="outlined"
                  dir="rtl"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#111" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPwd((p) => !p)}
                          aria-label={showPwd ? "הסתר סיסמה" : "הצג סיסמה"}
                          tabIndex={-1}
                          sx={{ color: "#111" }}
                        >
                          {showPwd ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: 4,
                    fontSize: "0.95rem",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 4,
                      "& fieldset": { borderColor: "#111" },
                      "&:hover fieldset": { borderColor: "#111" },
                      "&.Mui-focused fieldset": { borderColor: "#111" },
                    },
                    mb: 2,
                  }}
                  InputLabelProps={{
                    sx: {
                      color: "#111",
                      right: 0,
                      left: "unset",
                      textAlign: "right",
                      fontSize: "1.05rem",
                      background: "#fff",
                      px: 0.5,
                      mt: "-2px",
                    }
                  }}
                  FormHelperTextProps={{
                    sx: {
                      color: "#111",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      textAlign: "right",
                      mr: 0,
                    }
                  }}
                />
              )}
            />
            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 2,
                py: 1.2,
                fontWeight: "bold",
                color: "#fff",
                bgcolor: "#111",
                borderRadius: 99,
                fontSize: "1rem",
                boxShadow: "none",
                textTransform: "none",
                transition: "0.2s",
                "&:hover": {
                  bgcolor: "#222",
                  color: "#fff",
                },
              }}
              disabled={loading}
              endIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? "נרשם..." : "הרשם"}
            </Button>
          </form>
          <Typography mt={3} sx={{ color: "#222", fontSize: "0.98rem", textAlign: "center" }}>
            כבר רשום?{" "}
            <MuiLink component={Link} to="/login" underline="hover" fontWeight={600} sx={{ color: "#111" }}>
              להתחברות
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}