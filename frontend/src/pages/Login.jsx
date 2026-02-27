import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LoadingScreen from "../components/ui/LoadingScreen";
import { AuthContext } from "../contexts/AuthContext";
import logoMinimal from "../assets/logo-minimal.svg";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1f8f4a" },
    background: { default: "#e6ebe8" },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
  },
  shape: { borderRadius: 14 },
});

export default function Login() {
  const { login, isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreload, setShowPreload] = useState(false);
  const [preloadMessage, setPreloadMessage] = useState("Preparando seu painel...");

  useEffect(() => {
    const transition = sessionStorage.getItem("authTransition");
    if (transition === "logout") {
      setPreloadMessage("Saindo...");
      setShowPreload(true);
      const timer = setTimeout(() => {
        sessionStorage.removeItem("authTransition");
        setShowPreload(false);
      }, 900);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (result?.success) {
        setPreloadMessage("Preparando seu painel...");
        setShowPreload(true);
        setTimeout(() => navigate("/"), 1100);
        return;
      }
      setError(result?.message || "Credenciais invalidas");
    } catch (err) {
      console.error(err);
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showPreload) {
    return <LoadingScreen message={preloadMessage} fullScreen />;
  }

  if (isAuthenticated && !loading) {
    return <Navigate to="/" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          position: "relative",
          background: isMobile
            ? "#e6ebe8"
            : "linear-gradient(104deg, #34c46a 0%, #34c46a 47%, #e6ebe8 53%, #e6ebe8 100%)",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            position: "absolute",
            top: 18,
            left: { xs: 16, md: 24 },
            zIndex: 2,
          }}
        >
          <Box component="img" src={logoMinimal} alt="Logo" sx={{ width: 44, height: 44, display: "block" }} />
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#10351f" }}>
            CRM Leads
          </Typography>
        </Stack>

        {!isMobile && (
          <Box
            sx={{
              px: { md: 5, lg: 7 },
              py: 6,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              backgroundColor: "transparent",
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: { md: 40, lg: 46 }, lineHeight: 1.1, color: "#073521" }}>
              CRM para gestao de leads com foco em resultado
            </Typography>
            <Typography sx={{ mt: 2, fontWeight: 600, fontSize: 26, color: "#073521" }}>
              Mais controle, menos friccao
            </Typography>

            <Stack spacing={1.1} sx={{ mt: 4, width: "100%", maxWidth: 520 }}>
              <Typography sx={{ fontSize: 17, fontWeight: 500, color: "#083b24", textAlign: "center" }}>
                Pipeline organizado
              </Typography>
              <Typography sx={{ fontSize: 17, fontWeight: 500, color: "#083b24", textAlign: "center" }}>
                Reunioes e follow-up centralizados
              </Typography>
              <Typography sx={{ fontSize: 17, fontWeight: 500, color: "#083b24", textAlign: "center" }}>
                Conversao acompanhada em tempo real
              </Typography>
            </Stack>

            <Box
              sx={{
                mt: 4,
                px: 4,
                py: 1.3,
                bgcolor: "#0d5b2d",
                color: "#f8fafc",
                fontWeight: 700,
                borderRadius: 3,
                fontSize: 24,
              }}
            >
              Quero evoluir o time
            </Box>
          </Box>
        )}

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", px: 2.5, py: 3.5 }}>
            <Box sx={{ width: "100%", maxWidth: 420 }}>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.2} sx={{ mb: 2.8 }}>
              <Typography sx={{ color: "#1c3d2b", fontWeight: 500, fontSize: 14 }}>
                Ainda nao tem conta?
              </Typography>
              <Button
                size="small"
                sx={{
                  minWidth: "auto",
                  px: 1.8,
                  py: 0.8,
                  borderRadius: 2,
                  bgcolor: "#c8eacc",
                  color: "#1f6a31",
                  fontWeight: 700,
                  fontSize: 12,
                  "&:hover": { bgcolor: "#b6e2bc" },
                }}
              >
                Comece o teste gratis
              </Button>
            </Stack>

              <Box
                component="form"
                onSubmit={handleSubmit}
              sx={{
                bgcolor: "#f7f8fa",
                p: { xs: 3, sm: 4 },
                borderRadius: 3.2,
                boxShadow: "0 10px 28px rgba(15,23,42,0.12)",
                border: "1px solid rgba(15,23,42,0.08)",
              }}
            >
              <Typography sx={{ fontSize: 36, color: "#18452b", fontWeight: 800, mb: 1.2 }}>Ola!</Typography>

              {error && <Alert severity="error" sx={{ mb: 2.2 }}>{error}</Alert>}

              <Stack spacing={2}>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  disabled={isSubmitting}
                  autoComplete="email"
                  fullWidth
                />

                <TextField
                  label="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword((prev) => !prev)}
                          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                          disabled={isSubmitting}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>

              <Link
                href="#"
                underline="hover"
                sx={{ display: "inline-block", mt: 1.8, color: "#1f8f4a", fontWeight: 700, fontSize: 14 }}
              >
                Esqueceu sua senha?
              </Link>

              <FormControlLabel
                sx={{ mt: 1.8 }}
                control={
                  <Checkbox
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                  />
                }
                label={<Typography sx={{ color: "#30485d", fontSize: 14 }}>Lembrar deste dispositivo por 14 dias</Typography>}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                fullWidth
                sx={{
                  mt: 1.6,
                  py: 1.3,
                  borderRadius: 2.3,
                  bgcolor: "#1f8f4a",
                  fontSize: 18,
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#18743b" },
                }}
              >
                {isSubmitting ? "Entrando..." : "Avancar"}
              </Button>

                <Button
                  fullWidth
                sx={{
                  mt: 1,
                  color: "#1f8f4a",
                  fontWeight: 700,
                  fontSize: 17,
                  textTransform: "none",
                }}
                >
                  Entrar com SSO
                </Button>
              </Box>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 2.4, px: 0.5 }}
              >
                <Link
                  href="#"
                  underline="none"
                  sx={{ color: "#9ca3af", fontSize: 13, fontWeight: 600 }}
                >
                  Política de privacidade
                </Link>
                <Button
                  variant="text"
                  endIcon={<ArrowDropDownIcon />}
                  sx={{
                    minWidth: "auto",
                    px: 0,
                    color: "#0b6ea7",
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: 16,
                  }}
                >
                  Português
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
    </ThemeProvider>
  );
}
