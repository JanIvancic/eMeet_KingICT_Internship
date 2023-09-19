import React from "react";
import "./PublicContent.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo_vikend_radionice.png";
import { Box, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function PublicContent() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/registracija");
  };

  return (
    <div className="background-container">
      <img src={logo} alt="Overlay" className="overlay-image" />

      <div className="text-content">
        KING ICT predstavlja vikend radionice za sve ljude koji žele steći nova
        znanja i iskustvau IT svijetu. <br /> Radionice će predstavljati
        područja Poslovne analize, Razvoj softvera i Osiguranje kvalitete.
      </div>

      <Box
        sx={{
          position: "absolute",
          right: 100,
          bottom: 100,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          "&:hover": {
            opacity: 0.7,
          },
        }}
        onClick={handleButtonClick}
      >
        <ArrowForwardIcon
          color="action"
          fontSize="inherit"
          style={{ fontSize: "4rem", color: "#ffffff", fontWeight: "bolder" }}
        />
      </Box>
    </div>
  );
}

export default PublicContent;
