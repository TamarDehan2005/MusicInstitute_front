import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Mail, MusicNote } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { useNavigate, Link } from "react-router-dom";

const emailSchema = yup.object({
  email: yup.string().email("כתובת אימייל לא תקינה").required("אנא הזן כתובת אימייל"),
});

const resetSchema = yup.object({
  code: yup.string().required("קוד אימות חובה"),
  newPassword: yup.string().min(6, "לפחות 6 תווים").required("סיסמה חדשה חובה"),
});

export default function PasswordReset() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // react-hook-form setups for each step
  const {
    control: controlEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const {
    control: controlReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: errorsReset },
  } = useForm({
    resolver: yupResolver(resetSchema),
    defaultValues: { code: "", newPassword: "" },
  });

  const onSendCode = async ({ email }) => {
    setLoading(true);
    try {
      const res = await fetch("https://localhost:7108/api/PasswordReset/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        enqueueSnackbar("קוד אימות נשלח למייל", { variant: "success" });
        setStep(2);
      } else {
        const err = await res.text();
        enqueueSnackbar(err || "האימייל לא נמצא", { variant: "error" });
      }
    } catch {
      enqueueSnackbar("שגיאת רשת – נסה שוב", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async ({ code, newPassword }) => {
    setLoading(true);
    try {
      // לקבל את האימייל מהשלב הראשון (אפשר לשמור בסטייט בנפרד)
      // כאן נשמור את האימייל בסטייט לאחר שלב 1
      // לשם כך נוסיף state לאימייל:
      // לכן נוסיף למעלה: const [email, setEmail] = useState("");
      // ונעדכן אותו ב-onSendCode לפני setStep(2)
      // אז נוסיף את זה כאן:
      // כלומר, נשנה onSendCode:
      // setEmail(email); לפני setStep(2)

      // כך גם עכשיו נשתמש ב-email מהסטייט:
      if (!email) {
        enqueueSnackbar("אירעה שגיאה פנימית: אימייל לא קיים", { variant: "error" });
        setLoading(false);
        return;
      }

      const res = await fetch("https://localhost:7108/api/PasswordReset/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      if (res.ok) {
        enqueueSnackbar("הסיסמה אופסה בהצלחה", { variant: "success" });
        navigate("/login");
      } else {
        const err = await res.text();
        enqueueSnackbar(err || "שגיאה באיפוס הסיסמה", { variant: "error" });
      }
    } catch {
      enqueueSnackbar("שגיאת רשת – נסה שוב", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  // state לאחסון אימייל לאחר שלב 1
  const [email, setEmail] = useState("");

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
      {/* אלמנטי רקע דקורטיביים */}
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
          fontFamily:
            "'Rubik Rounded', 'Varela Round', 'Arial Rounded MT Bold', Arial, sans-serif",
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

      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          direction: "rtl",
          p: 2,
          zIndex: 1,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: 320,
            maxWidth: "95vw",
            p: 4,
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          {step === 1 && (
            <form onSubmit={handleSubmitEmail(async (data) => {
              setEmail(data.email);
              await onSendCode(data);
            })} noValidate>
              <Controller
                name="email"
                control={controlEmail}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="כתובת אימייל"
                    placeholder="example@example.com"
                    fullWidth
                    margin="normal"
                    error={!!errorsEmail.email}
                    helperText={errorsEmail.email?.message}
                    variant="outlined"
                    dir="rtl"
                    size="small"
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
                      },
                    }}
                    FormHelperTextProps={{
                      sx: {
                        color: "#111",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        textAlign: "right",
                        mr: 0,
                      },
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
                {loading ? <CircularProgress size={20} color="inherit" /> : "שלח קוד אימות"}
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmitReset(onResetPassword)} noValidate>
              <Controller
                name="code"
                control={controlReset}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="קוד אימות"
                    fullWidth
                    margin="normal"
                    error={!!errorsReset.code}
                    helperText={errorsReset.code?.message}
                    variant="outlined"
                    dir="rtl"
                    size="small"
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
                      },
                    }}
                    FormHelperTextProps={{
                      sx: {
                        color: "#111",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        textAlign: "right",
                        mr: 0,
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="newPassword"
                control={controlReset}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showPwd ? "text" : "password"}
                    label="סיסמה חדשה"
                    fullWidth
                    margin="normal"
                    error={!!errorsReset.newPassword}
                    helperText={errorsReset.newPassword?.message}
                    variant="outlined"
                    dir="rtl"
                    size="small"
                    InputProps={{
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
                      },
                    }}
                    FormHelperTextProps={{
                      sx: {
                        color: "#111",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        textAlign: "right",
                        mr: 0,
                      },
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
                {loading ? <CircularProgress size={20} color="inherit" /> : "אפס סיסמה"}
              </Button>
            </form>
          )}

          <Typography mt={3} sx={{ color: "#222", fontSize: "0.98rem", textAlign: "center" }}>
            נזכרת בסיסמה?{" "}
            <MuiLink component={Link} to="/login" underline="hover" fontWeight={600} sx={{ color: "#111" }}>
              חזור להתחברות
            </MuiLink>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
