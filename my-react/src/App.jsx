import React from "react";
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login";
import RegisterPage from "./components/signup";
import Dashboard from "./components/dashboard";
import MyLessons from "./components/mylessons";
import MakeALesson from "./components/makeAlesson";
import ResetPass from "./components/PasswordReset";
import Home from "./components/home";

export default function App() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={3000}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
           <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mylessons" element={<MyLessons />} />
          <Route path="/makeAlesson" element={<MakeALesson />} />
          <Route path="/reset-password" element={<ResetPass />} />
          {/* ... */}
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}
