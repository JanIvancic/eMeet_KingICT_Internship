import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";
import SelectMui from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import ListItemText from "@mui/material/ListItemText";
import "./UserProfile.css";

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [isEditable, setIsEditable] = useState(false);
  const [oldPassword, setOldPassword] = useState("**********");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;

  const [originalProfileData, setOriginalProfileData] = useState(null);

  const [selectedGroups, setSelectedGroups] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  const alertStyle = {
    position: "fixed",
    top: "70px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    width: "20%",
    maxWidth: "600px",
  };

  const userPreferences = {
    1: "BA",
    2: "DEV",
    3: "QA",
  };

  const handleGroupsChange = (e) => {
    setSelectedGroups(e.target.value.map(String));
  };

  function MyAlert({ message, open, handleClose }) {
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

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setProfileData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleEditClick = () => {
    setShowPasswordPrompt(true);
    setIsEditable(true);
    setOldPassword("");
    setOldPasswordError("");
  };

  const handleCancelClick = () => {
    setValidationErrors({});
    setProfileData(originalProfileData);
    setIsEditable(false);
  };

  const handlePromptCancelClick = () => {
    setIsEditable(false);
    setValidationErrors({});
    setShowPasswordPrompt(false);
    setOldPasswordError("");
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handlePasswordConfirm = () => {
    if (!oldPassword) {
      setOldPasswordError("Lozinka ne može biti prazna.");
      return;
    }
    setOldPasswordError("");
    fetch(`${process.env.REACT_APP_API_BASE_URL}/User/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user.email, password: oldPassword }),
    })
      .then((response) => {
        if (response.status === 200) {
          setShowPasswordPrompt(false);
          setIsEditable(true);
          setOldPasswordError("");
        } else if (response.status === 400) {
          setOldPasswordError("Pogrešna lozinka.");
        }
      })
      .catch((error) => {
        setOldPasswordError("Lozinka je obavezna.");
      });
  };

  const handleSaveClick = async () => {
    let newPasswordToUse = newPassword;

    if (newPassword.length <= 0) {
      console.log("in if statement");
      newPasswordToUse = oldPassword;
    }

    console.log("newPassword - " + newPasswordToUse);
    console.log("oldPassword -" + oldPassword);

    const isValid = validateForm();

    if (!isValid) {
      return;
    }
    const dataToSave = {
      id: userId,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      oldPassword: oldPassword,
      newPassword: newPasswordToUse,
      phoneNumber: profileData.phoneNumber,
      userPreferenceIDs: selectedGroups.map(Number),
      description: "",
      pictureURL: "",
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/User/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSave),
        }
      );

      if (response.ok) {
        const savedData = await response.text();

        if (savedData === "User updated successfully!") {
          console.log(savedData);
          setShowAlert(true);
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setIsEditable(false);
        } else {
          console.error("Unexpected success response:", savedData);
        }
      } else {
        const errorData = await response.text();

        console.error("Error saving profile:", errorData);
      }
    } catch (error) {
      console.error("Error making API call:", error);
    }
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/User/GetUserProfileDetailsById?id=${userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setOriginalProfileData(data);
        setProfileData(data);
        if (data && data.userPreferenceIDs) {
          setSelectedGroups(data.userPreferenceIDs.map(String));
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/User/GetUserProfileDetailsById?id=${userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setOriginalProfileData(data);
        setProfileData(data);
        if (data && data.userPreferenceIDs) {
          setSelectedGroups(data.userPreferenceIDs.map(String));
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  

  const validateForm = () => {
    let errors = {};

    if (!profileData.firstName) {
      errors.firstName = "Ime je obavezno";
    }

    if (!profileData.lastName) {
      errors.lastName = "Prezime je obavezno";
    }

    if (profileData.phoneNumber && !profileData.phoneNumber.match(/^\d+$/)) {
      errors.phoneNumber = "Broj mobitela može sadržavati samo brojeve";
    }

    if (selectedGroups.length === 0) {
      errors.userPreferenceIDs =
        "Barem jedno područje interesa mora biti odabrano";
    }

    if (newPassword !== "" && confirmPassword !== "") {
      if (newPassword !== confirmPassword) {
        errors.confirmPassword = "Nove lozinke se moraju podudarati";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="user-profile-wrapper">
      <MyAlert
        open={showAlert}
        handleClose={handleAlertClose}
        message="Uspješno se promjenili osobne podatke!"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ textAlign: "left", margin: 0 }}>Moj profil</h1>
        <div style={{ alignItems: "right" }}>
          <button
            onClick={isEditable ? handleSaveClick : handleEditClick}
            className="user-edit-button"
          >
            {isEditable ? <SaveIcon /> : <EditIcon />}
          </button>
          <button onClick={handleCancelClick} className="user-edit-button">
            {isEditable ? <CancelIcon /> : ""}
          </button>
        </div>
      </div>
      <hr />
      {profileData ? (
        <div>
          <div className="user-profile-detail">
            <label>Ime</label>
            <input
              type="text"
              readOnly={!isEditable}
              value={profileData.firstName}
              onChange={(e) => handleInputChange(e, "firstName")}
            />
            {validationErrors.firstName && (
              <p className="error">{validationErrors.firstName}</p>
            )}
          </div>
          <div className="user-profile-detail">
            <label>Prezime</label>
            <input
              type="text"
              readOnly={!isEditable}
              value={profileData.lastName}
              onChange={(e) => handleInputChange(e, "lastName")}
            />
            {validationErrors.lastName && (
              <p className="error">{validationErrors.lastName}</p>
            )}
          </div>
          <div className="user-profile-detail">
            <label>Email</label>
            <input
              type="text"
              readOnly={!isEditable}
              disabled={isEditable}
              value={profileData.email}
              onChange={(e) => handleInputChange(e, "email")}
            />
          </div>
          <div className="user-profile-detail">
            <label>Broj telefona</label>
            <input
              type="text"
              readOnly={!isEditable}
              value={profileData.phoneNumber}
              onChange={(e) => handleInputChange(e, "phoneNumber")}
            />
            {validationErrors.phoneNumber && (
              <p className="error">{validationErrors.phoneNumber}</p>
            )}
          </div>
          <div className="user-profile-detail">
            <label>Nova Lozinka</label>
            <input
              type="password"
              value={newPassword}
              readOnly={!isEditable}
              disabled={!isEditable}
              placeholder={!isEditable ? "Promijeni klikom na" : ""}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {!isEditable && (
              <div
                style={{
                  marginLeft: "-135px",
                  marginTop: "10px",
                }}
              >
                <EditIcon fontSize="small" style={{ color: "gray" }} />
              </div>
            )}
          </div>
          <div className="user-profile-detail">
            <label>Potvrdi Novu Lozinku</label>
            <input
              type="password"
              value={confirmPassword}
              readOnly={!isEditable}
              disabled={!isEditable}
              placeholder={!isEditable ? "Promijeni klikom na" : ""}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {!isEditable && (
              <div
                style={{
                  marginLeft: "-135px",
                  marginTop: "10px",
                }}
              >
                <EditIcon fontSize="small" style={{ color: "gray" }} />
              </div>
            )}
            {validationErrors.confirmPassword && (
              <p className="error">{validationErrors.confirmPassword}</p>
            )}
          </div>

          {isEditable ? (
            <>
              <div className="user-profile-detail">
                <label>Područje interesa</label>
                <SelectMui
                  className={`user-input-look-alike no-outline custom-font-size`}
                  labelId="grupa-dogadjaja-label"
                  id="grupa-dogadjaja"
                  multiple
                  value={selectedGroups}
                  onChange={handleGroupsChange}
                  input={<OutlinedInput label="Grupa događaja" />}
                  renderValue={(selected) => (
                    <span style={{ fontSize: "calc(16px + 3px)" }}>
                      {" "}
                      {/* Add your styling here */}
                      {selected.map((id) => userPreferences[id]).join(", ")}
                    </span>
                  )}
                >
                  {Object.entries(userPreferences).map(([id, name]) => (
                    <MenuItem key={id} value={id}>
                      <Checkbox checked={selectedGroups.indexOf(id) > -1} />
                      <ListItemText
                        primary={
                          name === "DEV"
                            ? "DEV - Razvoj softvera"
                            : name === "QA"
                            ? "QA - Osiguravanje kvalitete"
                            : name === "BA"
                            ? "BA - Poslovna analiza"
                            : ""
                        }
                      />
                    </MenuItem>
                  ))}
                </SelectMui>
                {validationErrors.userPreferenceIDs && (
                  <p className="error">{validationErrors.userPreferenceIDs}</p>
                )}
              </div>
            </>
          ) : (
            <div className="user-profile-detail">
              <label>Područje interesa</label>
              <input
                type="text"
                readOnly
                value={profileData.userPreferenceIDs
                  .map((id) => userPreferences[id])
                  .join(", ")}
              />
            </div>
          )}
        </div>
      ) : (
        <p>Učitavanje...</p>
      )}
      <Dialog
        open={showPasswordPrompt}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        BackdropProps={{
          classes: {
            root: "transparent-backdrop",
          },
        }}
        PaperProps={{
          classes: {
            root: "shadowed-paper",
          },
        }}
      >
        <DialogTitle className="modern-dialog-title">
          Potvrda lozinke
        </DialogTitle>
        <DialogContent className="modern-dialog-content">
          <DialogContentText>
            Unesite svoju lozinku kako biste uredili profil
          </DialogContentText>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="modern-password-input"
          />
          {oldPasswordError && (
            <p className="error modern-error-text">{oldPasswordError}</p>
          )}
        </DialogContent>
        <DialogActions className="modern-dialog-actions">
          <Button
            onClick={handlePromptCancelClick}
            color="primary"
            className="modern-cancel-button"
          >
            Odustani
          </Button>
          <Button
            onClick={handlePasswordConfirm}
            color="primary"
            className="modern-confirm-button"
          >
            Potvrdi
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserProfile;
