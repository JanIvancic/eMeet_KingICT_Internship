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
import { MenuItem } from "@mui/material";
import { Checkbox } from "@mui/material";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import king_workshop_banner from "../../assets/vertical_logo.png";
import king_logo from "../../assets/king_logo.png";

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

const Registration = () => {
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showPasswordFirst, setShowPasswordFirst] = useState(false);
  const [showPasswordSecond, setShowPasswordSecond] = useState(false);
  const [dropdownError, setDropdownError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const phoneRegex = /^\d{8,15}$/;
  const forbiddenSymbolsRegex = /[-(){}[\]|`¬¦ "£:<>;~_+=,^]/;
  const passwordRegex =
    /^(?=.*[0-9])(?=.*[@$!%*#?&.])(?=.*[A-Z])(?=.*[a-z])(?!.*[-(){}[\]|`¬¦ "£:<;~_+=,^]).{8,200}$/;

  const firstNameAndLastNameRegex =
    /^(?! )([A-Za-zčćžšđČĆŽŠĐ0-9.'-]+[ ]?)*[A-Za-zčćžšđČĆŽŠĐ0-9.'-]+$/;
  const forbiddenSymbolsInEmailRegex = /[^a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~@<>]/;
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*[^-]$/;

  const multipleSpacesRegex = /\s{2,}/;

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
    if (!event.target.value) {
      setFirstNameError("Ime je obavezno");
    } else if (multipleSpacesRegex.test(event.target.value)) {
      setFirstNameError("Ime je u pogrešnom formatu");
    } else if (!firstNameAndLastNameRegex.test(event.target.value)) {
      setFirstNameError("Ime sadrži nedozvoljene znakove");
    } else if (event.target.value.length > 200) {
      setFirstNameError("Dužina imena mora biti između 0 i 200");
    } else {
      setFirstNameError("");
    }
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
    if (!event.target.value) {
      setLastNameError("Prezime je obavezno");
    } else if (multipleSpacesRegex.test(event.target.value)) {
      setLastNameError("Prezime je u pogrešnom formatu");
    } else if (!firstNameAndLastNameRegex.test(event.target.value)) {
      setLastNameError("Prezime sadrži nedozvoljene znakove");
    } else if (event.target.value.length > 50) {
      setLastNameError("Dužina prezimena mora biti između 0 i 51");
    } else {
      setLastNameError("");
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    if (!event.target.value) {
      setEmailError("E-mail je obavezan");
    } else if (
      !emailRegex.test(event.target.value) ||
      forbiddenSymbolsInEmailRegex.test(event.target.value) ||
      event.target.value.length > 320 ||
      event.target.value.length < 3
    ) {
      setEmailError("Neispravna e-mail adresa");
    } else {
      setEmailError("");
    }
  };
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
    if (event.target.value && !phoneRegex.test(event.target.value)) {
      setPhoneError("Mobitel mora biti između 8 i 15 brojeva");
    } else {
      setPhoneError("");
    }
  };

  const handlePasswordChange = (event) => {
    const newPass = event.target.value;
    setPassword(newPass);
    setPassword(event.target.value);
    const passwordValue = event.target.value;

    if (confirmPassword && newPass !== confirmPassword) {
      setConfirmPasswordError("Lozinke se ne podudaraju");
    } else {
      setConfirmPasswordError("");
    }

    if (!passwordValue) {
      setPasswordError("Lozinka je obavezna");
    } else if (forbiddenSymbolsRegex.test(passwordValue)) {
      setPasswordError(
        "Lozinka sadrži nedozvoljene simbole. Dozvoljeni simboli su: @$!%*#?&"
      );
    } else if (passwordValue.length > 200) {
      setPasswordError("Dužina lozinke mora biti manja od 200 znaka");
    } else if (!passwordRegex.test(passwordValue)) {
      setPasswordError(
        "Lozinka mora imati najmanje 8 znakova, jedan broj, jedno veliko i malo slovo i jedan simbol"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (event) => {
    const newConfirmPass = event.target.value;
  setConfirmPassword(newConfirmPass);

  if (!newConfirmPass) {
    setConfirmPasswordError("Potvrda lozinke je obavezna");
  } else if (newConfirmPass !== password) {
    setConfirmPasswordError("Lozinke se ne podudaraju");
  } else {
    setConfirmPasswordError("");
  }
};

  const handleClickShowPasswordFirst = () => {
    setShowPasswordFirst((prev) => !prev);
  };
  const handleClickShowPasswordSecond = () => {
    setShowPasswordSecond((prev) => !prev);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;

    setSelectedOption(selectedValue);

    if (selectedValue) {
      setDropdownError("");
    }
  };
  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const alertStyle = {
    position: "fixed",
    top: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    width: "90%",
    maxWidth: "600px",
  };

  function RegAlert({ message, open, handleClose }) {
    return (
      <div style={alertStyle}>
        {open && (
          <Alert onClose={handleClose} severity="info">
            <AlertTitle>Info</AlertTitle>
            <strong>{message}</strong>
          </Alert>
        )}
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let hasError = false;

    if (!firstName) {
      setFirstNameError("Ime je obavezno");
      hasError = true;
    }

    if (!lastName) {
      setLastNameError("Prezime je obavezno");
      hasError = true;
    }

    if (!email) {
      setEmailError("Email je obavezan");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Lozinka je obavezna");
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Potvrda lozinke je obavezna");
      hasError = true;
    }

    if (password !== confirmPassword) {
      setPasswordError("Lozinke se ne podudaraju");
      setConfirmPasswordError("Lozinke se ne podudaraju");
      hasError = true;
    }

    if (!selectedOption) {
      setDropdownError("Preferenca je obavezna");
      hasError = true;
    }

    if (!acceptTerms) {
      setTermsError("Morate prihvatiti opće uvjete korištenja");
      hasError = true;
    }

    if (
      firstNameError ||
      lastNameError ||
      emailError ||
      phoneError ||
      passwordError ||
      confirmPasswordError
    ) {
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      PhoneNumber: phone,
      password,
      confirmPassword,
      comboboxPreference: selectedOption,
    };

    fetch(`${process.env.REACT_APP_API_BASE_URL}/User/Register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        console.log(userData);
        if (!response.ok) {
          return response.text().then((error) => {
            console.error("Server error:", error);
            if (error.includes("User with the same email already exists")) {
              setEmailError("Email se već koristi!");
            }
            throw new Error(error);
          });
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("Uspješna registracija", responseData);
        setShowAlert(true);
      })
      .catch((error) => {
        console.error("Greška ", error);
      });
  };

  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/Preference`)
      .then((response) => response.json())
      .then((data) => {
        setOptions(data);
      })
      .catch((error) => console.error("Greška: ", error));
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <RegAlert
        open={showAlert}
        handleClose={handleAlertClose}
        message="Poslan Vam je mail za potvrdu email adrese."
      />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 3,
              mx: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                mt: 5,
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
              <p style={{ fontWeight: "bold" }}>REGISTRACIJA</p>
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Grid
                container
                spacing={1}
                sx={{ width: "50%", justifyContent: "center" }}
              >
                <Grid item xs={12}>
                  <TextField
                    error={!!firstNameError}
                    helperText={firstNameError}
                    autoComplete="firstName"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="Ime"
                    value={firstName}
                    onChange={handleFirstNameChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={!!lastNameError}
                    helperText={lastNameError}
                    autoComplete="lastName"
                    name="lastName"
                    required
                    fullWidth
                    id="lastName"
                    label="Prezime"
                    value={lastName}
                    onChange={handleLastNameChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={!!emailError}
                    helperText={emailError}
                    autoComplete="email"
                    name="email"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={!!phoneError}
                    helperText={phoneError}
                    autoComplete="phone"
                    name="phone"
                    fullWidth
                    id="phone"
                    label="Broj Mobitela"
                    value={phone}
                    onChange={handlePhoneChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={!!passwordError}
                    helperText={passwordError}
                    autoComplete="password"
                    name="password"
                    required
                    fullWidth
                    id="password"
                    label="Lozinka"
                    type={showPasswordFirst ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPasswordFirst}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPasswordFirst ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={!!confirmPasswordError}
                    helperText={confirmPasswordError}
                    autoComplete="confirmPassword"
                    name="confirmPassword"
                    required
                    fullWidth
                    id="confirmPassword"
                    label="Potvrdi Lozinku"
                    type={showPasswordSecond ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPasswordSecond}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPasswordSecond ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Odabir preference*"
                      value={selectedOption}
                      onChange={handleDropdownChange}
                      helperText={dropdownError}
                      error={Boolean(dropdownError)}
                    >
                      {options
                        .filter((_, index) => index !== 3)
                        .map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))}
                    </TextField>
                  </Grid>

                  <Grid>
                    <FormControlLabel
                      sx={{ mt: 1 }}
                      control={
                        <Checkbox
                          checked={acceptTerms}
                          onChange={(e) => {
                            setAcceptTerms(e.target.checked);
                            setTermsError("");
                          }}
                          name="acceptTerms"
                          color="primary"
                        />
                      }
                      label={
                        <span style={{ display: "flex", alignItems: "center" }}>
                          Prihvaćam
                          <Link
                            href="/uvjetikoristenja"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              marginLeft: "3px",
                              fontWeight: "bold",
                              whiteSpace: "nowrap",
                            }}
                          >
                            opće uvjete korištenja.
                          </Link>
                          <span>*</span>
                        </span>
                      }
                    />
                    {termsError && (
                      <Typography color="error" variant="body2">
                        {termsError}
                      </Typography>
                    )}
                  </Grid>

                  <p style={{ color: "gray" }}> *obavezno</p>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                mt={3}
                mb={3}
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
                    bgcolor: "#3f51b5",
                    color: "#ffffff",
                    "&:hover": {
                      bgcolor: "#303f9f",
                    },
                    mt: 2,
                    mb: 1,
                  }}
                >
                  REGISTRIRAJ SE
                </Button>
              </Grid>
              <Grid
                container
                sx={{
                  justifyContent: "center",
                }}
              >
                <Grid item>
                  <span>Imaš račun?</span>
                  <Link
                    component={RouterLink}
                    to="/prijava"
                    variant="body"
                    underline="always"
                    style={{ marginLeft: "5px" }}
                  >
                    {"Prijavi se."}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 2 }} />
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
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
      </Grid>
    </ThemeProvider>
  );
};

export default Registration;
