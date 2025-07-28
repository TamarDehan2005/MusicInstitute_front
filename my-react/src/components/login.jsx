import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import { Person, Lock, Visibility, VisibilityOff, MusicNote } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useNavigate, Link } from "react-router-dom";

const schema = yup.object({
  username: yup.string().required("שם משתמש חובה"),
  password: yup.string().min(6, "לפחות 6 תווים").required("סיסמה חובה"),
});

export default function LoginPage() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { username: "", password: "" },
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ username, password }) => {
    setLoading(true);
    const [firstNameInput, ...rest] = username.trim().split(" ");
    const lastNameInput = rest.join(" ");
    try {
      const res = await fetch("https://localhost:7108/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FirstName: firstNameInput,
          LastName: lastNameInput,
          StudentPassword: password,
        }),
      });
      if (res.ok) {
        const raw = await res.json();
        const student = {
          studentId: Number(raw.studentId ?? raw.StudentId ?? raw.id ?? 0),
          firstName: raw.firstName ?? raw.FirstName ?? firstNameInput,
          lastName: raw.lastName ?? raw.LastName ?? lastNameInput,
          ...raw,
        };
        if (!student.studentId) {
          enqueueSnackbar("השרת לא החזיר StudentId תקין.", { variant: "error" });
          setLoading(false);
          return;
        }
        localStorage.setItem("student", JSON.stringify(student));
        enqueueSnackbar("התחברת בהצלחה!", { variant: "success" });
        navigate("/dashboard");
        setLoading(false);
        return;
      }
      const err = await res.text();
      enqueueSnackbar(err || "שגיאת התחברות", {
        variant: res.status === 401 ? "warning" : "error",
      });
    } catch (e) {
      enqueueSnackbar("שגיאת רשת – ודא שהשרת פועל.", { variant: "error" });
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
            כניסת תלמידים
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }} noValidate>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="שם משתמש"
                  placeholder="שם פרטי ושם משפחה"
                  fullWidth
                  margin="normal"
                  error={!!errors.username}
                  helperText={errors.username?.message}
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
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type={showPwd ? "text" : "password"}
                  label="סיסמה"
                  placeholder="הכנס סיסמה"
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
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
            >
              {loading ? "טוען..." : "התחבר"}
            </Button>
          </form>
          <Typography mt={3} sx={{ color: "#222", fontSize: "0.98rem", textAlign: "center" }}>
            אין לך חשבון?{" "}
            <MuiLink component={Link} to="/register" underline="hover" fontWeight={600} sx={{ color: "#111" }}>
              הרשמה
            </MuiLink>
          </Typography>
          <Typography mt={2} sx={{ color: "#222", fontSize: "0.98rem", textAlign: "center" }}>
            שכחת את הסיסמה?{" "}
            <MuiLink component={Link} to="/reset-password" underline="hover" fontWeight={600} sx={{ color: "#111" }}>
              אפס סיסמה
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}