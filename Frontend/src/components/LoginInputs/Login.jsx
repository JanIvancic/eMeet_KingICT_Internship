import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authentication";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Modal from "@mui/material/Modal";
import Link from "@mui/material/Link";
import king_workshop_banner from "../../assets/vertical_logo.png";
import king_logo from "../../assets/king_logo.png";
import { useLocation } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Initialize state to false, meaning the password will be hidden initially

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://king-ict.eu/">
        King ICT
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

const LoginInputs = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showPasswordFirst, setShowPasswordFirst] = useState(false);

  const alertStyle = {
    position: "fixed",
    top: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    width: "90%",
    maxWidth: "600px",
  };

  function LoginAlert({ message, open, handleClose }) {
    return (
      <div style={alertStyle}>
        {open && (
          <Alert onClose={handleClose} severity="info">
            <AlertTitle>Obavijest</AlertTitle>
            <strong>{message}</strong>
          </Alert>
        )}
      </div>
    );
  }

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const messageParam = queryParams.get("message");

    if (messageParam === "EmailConfirmed") {
      setAlertMessage("Email je uspješno potvrđen.");
      setShowAlert(true);
    } else if (messageParam === "AlreadyVerified") {
      setAlertMessage("Email je već potvrđen.");
      setShowAlert(true);
    }
  }, [location.search]);

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();
  const { saveToken } = useAuth();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (!event.target.value) {
      setEmailError("Polje je obavezno");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (!event.target.value) {
      setPasswordError("Polje je obavezno");
    } else {
      setPasswordError("");
    }
  };

  const handleClickShowPasswordFirst = () => {
    setShowPasswordFirst((prev) => !prev);
  };
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email) {
      setEmailError("Polje je obavezno");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Polje je obavezno");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/User/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status.toString());
        }
        return response.json();
      })
      .then((data) => {
        saveToken(data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        var userRole = localStorage.getItem("userRole");
        console.log(userRole);
        if (userRole == "2") navigate("/adminpocetna");
        else navigate("/pocetna");
      })

      .catch((error) => {
        if (error.message === "400") {
          setAlertMessage("Pogrešni podaci.");
          setEmailError("Pogrešni podaci.");
        } else {
          setAlertMessage(
            "Došlo je do pogreške prilikom pokušaja povezivanja na poslužitelj. Provjerite vezu i pokušajte ponovo."
          );
          setEmailError(
            "Došlo je do pogreške prilikom pokušaja povezivanja na poslužitelj. Provjerite vezu i pokušajte ponovo."
          );
        }
        setAlertOpen(true);
        console.error("Error:", error);
      });
  };
  const handlePasswordReset = () => {
    const emailData = { email };

    fetch("", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(
          "Došlo je do pogreške prilikom pokušaja povezivanja na poslužitelj. Provjerite vezu i pokušajte ponovo.",
          error
        );
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ minHeight: "100vh" }}>
        <LoginAlert
          open={showAlert}
          handleClose={handleAlertClose}
          message={alertMessage}
        />

        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={12}
          md={8}
          sx={{
            backgroundImage: `url(${king_workshop_banner})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                mt: 10,
                mb: 1,
              }}
            >
              <img
                src={king_logo}
                style={{ width: "50px", height: "50px" }}
                alt="king ict logo"
              />
            </Box>
            <Typography component="h1" variant="h5">
              <p style={{ fontWeight: "bold" }}>PRIJAVA</p>
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                error={Boolean(emailError)}
                helperText={emailError}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email adresa"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleEmailChange}
              />
              <TextField
                error={Boolean(passwordError)}
                helperText={passwordError}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Lozinka"
                type={showPasswordFirst ? "text" : "password"} // Dynamically set the type
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handlePasswordChange}
                InputProps={{
                  // Add this prop to TextField
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPasswordFirst}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPasswordFirst ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 3,
                  mb: 2,
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: "50%",
                    bgcolor: "#3f51b5",
                    color: "#ffffff",
                    "&:hover": {
                      bgcolor: "#303f9f",
                    },
                    mt: 3,
                    mb: 2,
                  }}
                >
                  PRIJAVI SE
                </Button>
              </Box>

              <Grid container direction="column" spacing={2}>
                <Grid
                  item
                  xs
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 5,
                    mb: 1,
                  }}
                >
                  <Link
                    onClick={handleOpen}
                    variant="body"
                    style={{ cursor: "pointer" }}
                  >
                    Zaboravljena lozinka?
                  </Link>
                </Grid>
                <Grid
                  item
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <span>Nemaš račun?</span>
                  <Link
                    component={RouterLink}
                    to="/registracija"
                    variant="body"
                    style={{ marginLeft: "5px" }}
                  >
                    {"Registriraj se."}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Grid>
      </Grid>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              width: 400,
              padding: 3,
              bgcolor: "background.paper",
              margin: "auto",
              mt: "15vh",
              borderRadius: "5px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <b>Zaboravljena lozinka</b>
            </Typography>
            <Typography variant="body2">
              Upute za postavku lozinke će Vam biti poslane na email. Dolje
              upišite svoju email adresu.
            </Typography>
            <TextField
              fullWidth
              label="Email adresa"
              variant="outlined"
              sx={{ mt: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handlePasswordReset}
            >
              Pošalji
            </Button>
          </Box>
        </Modal>
      </div>
      {alertOpen && (
        <Alert
          severity="error"
          onClose={() => setAlertOpen(false)}
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            zIndex: 9999,
            mt: 2,
            mr: 2,
          }}
        >
          {alertMessage}
        </Alert>
      )}
    </ThemeProvider>
  );
};

export default LoginInputs;
