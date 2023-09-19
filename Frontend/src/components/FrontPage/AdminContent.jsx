import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { Box, TextField, Typography, Divider, MenuItem } from "@mui/material";
import "./UserContent.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import EventTypeIcon from "@mui/icons-material/Event";
import GroupsIcon from "@mui/icons-material/Groups";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Button from "@mui/material/Button";
import { useLocation } from 'react-router-dom';
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

function AdminContent() {
  //const [value, onChange] = useState(new Date());
  const [userName, setUserName] = useState("");
  const [selectedValues, setSelectedValues] = useState({
    naziv: "",
    grupaDogađaja: "",
    nacinPredavanja: "",
    dostupnost: "",
    događaji: "",
    datumOd: "",
    datumDo: "",
  });
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const [infoMessage, setInfoMessage] = useState("");
  const [workshopDetailsList, setWorkshopDetailsList] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const userPreferenceIDs = userDetails ? userDetails.userPreferenceIDs : [];
  const [allWorkshops, setAllWorkshops] = useState([]);
  const [selectedWorkshops, setSelectedWorkshops] = useState([]);
  //const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [eventFilter, setEventFilter] = useState("Svi događaji");
  const [startIndex, setStartIndex] = useState(0);
  const [workshopIds, setWorkshopIds] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const location = useLocation();

  const alertStyle = {
    position: "fixed",
    top: "60px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    width: "400px",
    maxWidth: "600px",
  };

  useEffect(() => {
    if (location.state?.workshopDeleted) {
      setShowAlert(true);
      setInfoMessage("Radionica je uspješno obrisana.");
    }
    if (location.state?.workshopUpdated) {
      setShowAlert(true);
      setInfoMessage("Radionica je uspješno ažurirana.");
    }
    if (location.state?.workshopCreated) {
      setShowAlert(true);
      setInfoMessage("Radionica je uspješno kreirana.");
    }
  }, [location]);

  const handleClose = () => {
    setShowAlert(false);
  };
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function DeleteAlert({ message, open, handleClose, style }) {
    return (
      <div style={style}>
        {open && (
          <Alert onClose={handleClose} severity="info">
            <AlertTitle>Info</AlertTitle>
            <strong>{message}</strong>
          </Alert>
        )}
      </div>
    );
  }
  

  const combinedWorkshops = Array.from(
    new Set([...workshopDetailsList, ...allWorkshops].map((w) => w.id))
  ).map((id) => {
    return [...workshopDetailsList, ...allWorkshops].find((w) => w.id === id);
  });

  const sortedWorkshops = combinedWorkshops.sort(
    (a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)
  );

  const getFilteredWorkshops = () => {
    const initialFilteredWorkshops = sortedWorkshops.filter((workshop) => {
      const workshopDate = new Date(workshop.startDateTime);
      workshopDate.setHours(0, 0, 0, 0);

      if (selectedDate) {
        return (
          workshopDate.getFullYear() === selectedDate.getFullYear() &&
          workshopDate.getMonth() === selectedDate.getMonth() &&
          workshopDate.getDate() === selectedDate.getDate()
        );
      } else {
        return workshopDate >= today;
      }
    });

    if (eventFilter === "Moji događaji") {
      return initialFilteredWorkshops.filter((workshop) =>
        workshop.attendees.some((attendee) => attendee.id === userData.id)
      );
    } else if (eventFilter === "Prošli događaji") {
      return initialFilteredWorkshops.filter(
        (workshop) => new Date(workshop.startDateTime) < new Date()
      );
    } else {
      return initialFilteredWorkshops;
    }
  };
  const filteredWorkshops = getFilteredWorkshops();

  function handleDateChange(date) {
    if (selectedDate && date.getTime() === selectedDate.getTime()) {
      setIsDateSelected(false);
      setSelectedDate(null);
      setSelectedWorkshops(sortedWorkshops);
    } else {
      setIsDateSelected(true);
      setSelectedDate(date);

      const filtered = sortedWorkshops.filter((workshop) => {
        const workshopDate = new Date(workshop.startDateTime);
        return (
          workshopDate.getFullYear() === date.getFullYear() &&
          workshopDate.getMonth() === date.getMonth() &&
          workshopDate.getDate() === date.getDate()
        );
      });

      setSelectedWorkshops(filtered);
    }
  }

  const isUserAttending = (workshop, userData) => {
    if (!workshop.attendees || !userData) return false;
    return workshop.attendees.some(
      (attendee) => attendee.userId === userData.id
    );
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const getAvailableSpots = (workshop) => {
    const onlineAttendees = workshop.attendees
      ? workshop.attendees.filter((attendee) => attendee.attendanceType === 1)
          .length
      : 0;
    const offlineAttendees = workshop.attendees
      ? workshop.attendees.filter((attendee) => attendee.attendanceType === 2)
          .length
      : 0;

    let availableSpots = 0;

    if (workshop.eventType === 1) {
      availableSpots = workshop.maxAttendeesOnline - onlineAttendees;
    } else if (workshop.eventType === 2) {
      availableSpots = workshop.maxAttendeesOffline - offlineAttendees;
    } else if (workshop.eventType === 3) {
      availableSpots =
        workshop.maxAttendeesOnline +
        workshop.maxAttendeesOffline -
        (onlineAttendees + offlineAttendees);
    }

    return availableSpots >= 0 ? availableSpots : 0;
  };

  const fetchUserDetails = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/User/GetUserDetailsByUserId?iduser=${id}`
      );
      const data = await response.json();
      console.log("Fetched user data: ", data);
      setUserName(data.firstName);
      return data;
    } catch (error) {
      console.error("Error fetching user details for ID:", id, error);
    }
  };

  const fetchWorkshopDetails = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/Workshop/Details?id=${id}`
      );
      const data = await response.json();
      console.log("Workshop details: ", data);
      return data;
    } catch (error) {
      console.error("Error fetching workshop details for ID:", id, error);
    }
  };

  const fetchAllWorkshopIdsByPreference = async (userPreferenceIDs) => {
    console.log("prefrencesIDS", userPreferenceIDs);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/Workshop/GetAllIdsByPreferenceId?preferenceId=${userPreferenceIDs}`
      );
      if (response.status !== 200) {
        console.error(
          `Failed to fetch workshop IDs, status code: ${response.status}`
        );
        return;
      }
      const data = await response.json();
      console.log("All workshop IDs by preference: ", data);
      return data;
    } catch (error) {
      console.error(
        `Error fetching workshop IDs by preference ID: ${userPreferenceIDs}`,
        error
      );
    }
  };

  const fetchUserAndWorkshopDetails = async () => {
    const userDetailsData = await fetchUserDetails();
    if (
      userDetailsData &&
      userDetailsData.signedUpWorkshopIDs &&
      userDetailsData.signedUpWorkshopIDs.length > 0
    ) {
      const allDetails = await Promise.all(
        userDetailsData.signedUpWorkshopIDs.map((id) =>
          fetchWorkshopDetails(id)
        )
      );
      setWorkshopDetailsList(allDetails);
    }
  };

  const fetchAllWorkshopsDetailsByPreference = async (userPreferenceIDs) => {
    const ids = await fetchAllWorkshopIdsByPreference(userPreferenceIDs);
    if (!ids) return;

    const allWorkshops = [];
    for (const id of ids) {
      const workshopDetails = await fetchWorkshopDetails(id);
      if (workshopDetails) {
        allWorkshops.push(workshopDetails);
      }
    }
    return allWorkshops;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetails = await fetchUserDetails(userData.id);
        if (!userDetails) {
          console.error("Failed to fetch user details.");
          return;
        }
        setUserDetails(userDetails);

        if (userDetails.signedUpWorkshopIDs) {
          const allWorkshopDetails = await Promise.all(
            userDetails.signedUpWorkshopIDs.map((id) =>
              fetchWorkshopDetails(id)
            )
          );
          setWorkshopDetailsList(allWorkshopDetails);
        }

        let uniqueWorkshopIds = [];
        if (userDetails.userPreferenceIDs) {
          const allWorkshopIdsByPreference = await Promise.all(
            userDetails.userPreferenceIDs.map((preferenceId) =>
              fetchAllWorkshopIdsByPreference(preferenceId)
            )
          );
          uniqueWorkshopIds = Array.from(
            new Set(allWorkshopIdsByPreference.flat())
          );
        }

        setWorkshopIds(uniqueWorkshopIds);

        const currentPageWorkshopIds = uniqueWorkshopIds.slice(
          startIndex,
          startIndex + 3
        );
        const currentPageWorkshops = await Promise.all(
          currentPageWorkshopIds.map((id) => fetchWorkshopDetails(id))
        );

        setAllWorkshops(currentPageWorkshops);

        setHasFetched(true);
      } catch (error) {
        console.error("Error in fetchData useEffect:", error);
      }
    };

    fetchData();
  }, [userData.id, startIndex]);

  const handleDropdownChange = (name, value) => {
    if (name === "Događaji") {
      setEventFilter(value);
    } else {
      setSelectedValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  function formatDateAndTimeRange(startDateTime, endDateTime) {
    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    const optionsDate = { day: "2-digit", month: "2-digit", year: "numeric" };
    const optionsTime = {
      hour: "2-digit",
      minute: "2-digit",
    };

    const formattedStartDate = startDate.toLocaleDateString(
      undefined,
      optionsDate
    );
    const formattedStartTime = startDate.toLocaleTimeString(
      undefined,
      optionsTime
    );
    const formattedEndTime = endDate.toLocaleTimeString(undefined, optionsTime);

    return `${formattedStartDate} ~ ${formattedStartTime} - ${formattedEndTime}`;
  }

  const handleButtonClick = (workshopId) => {
    navigate(`/admindetaljiradionice/${workshopId}`);
  };

  function Dropdown({ label, value, handleChange }) {
    const width = label.length * 8 + 25;

    const getMenuItems = () => {
      if (label === "Događaji") {
        return [
          <MenuItem key="1" value="Svi događaji">
            Svi događaji
          </MenuItem>,
          <MenuItem key="2" value="Moji događaji">
            Moji događaji
          </MenuItem>,
          <MenuItem key="3" value="Prošli događaji">
            Prošli događaji
          </MenuItem>,
        ];
      } else {
        return [
          <MenuItem key="10" value={10}>
            opcija
          </MenuItem>,
          <MenuItem key="20" value={20}>
            opcija
          </MenuItem>,
          <MenuItem key="30" value={30}>
            opcija
          </MenuItem>,
        ];
      }
    };

    return (
      <TextField
        variant="outlined"
        select
        value={value}
        onChange={(e) => handleChange(label, e.target.value)}
        label={<Typography style={{ fontSize: "0.8rem" }}>{label}</Typography>}
        sx={{
          padding: "0 8px",
          mb: 1,
          m: "1px",
          minWidth: `${width}px`,
        }}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          getContentAnchorEl: null,
        }}
      >
        {getMenuItems()}
      </TextField>
    );
  }

  function Workshop({
    workshopDetails,
    isAttending,
    userData,
    handleButtonClick,
    formatDateAndTimeRange,
    getAvailableSpots,
  }) {
    const renderPreferences = () => {
      if (
        workshopDetails.preferences &&
        workshopDetails.preferences.length > 0
      ) {
        const names = workshopDetails.preferences.map((p) => p.name);
        if (names.length > 1) {
          return names.join("...");
        }
        return names[0];
      }
      return "";
    };
    return (
      
      <Box
      
        sx={{
          width: "90%",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "12px",
          maxWidth: "77%",
          marginRight: "auto",
          position: "relative",
          mb: 2,
          backgroundColor: isAttending
            ? "rgb(248, 206, 204)"
            : "rgb(225, 213, 231)",
        }}
      >
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          {workshopDetails.name}
        </Typography>
        
        <Typography
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            border: "1px solid black",
            borderRadius: "50%",
            backgroundColor: "white",
            padding: "5px 10px",
          }}
        >
          {renderPreferences()}
        </Typography>

        <Typography style={{ fontWeight: "bold", marginTop: "12px" }}>
          {formatDateAndTimeRange(
            workshopDetails.startDateTime,
            workshopDetails.endDateTime
          )}
        </Typography>
        <Typography style={{ marginTop: "12px" }}>
          {workshopDetails.description}
        </Typography>

        <Typography style={{ marginTop: "12px", fontWeight: "bold" }}>
          <EventTypeIcon fontSize="small" />{" "}
          {workshopDetails.eventType === 1
            ? "Online"
            : workshopDetails.eventType === 2
            ? "Onsite"
            : "Hibridno"}
        </Typography>

        <Typography style={{ marginTop: "12px", fontWeight: "bold" }}>
          <GroupsIcon fontSize="medium" /> {getAvailableSpots(workshopDetails)}{" "}
          slobodnih mjesta
        </Typography>

        <Typography style={{ marginTop: "12px", fontWeight: "bold" }}>
          <LocationOnIcon fontSize="small" /> {workshopDetails.address.cityName}
        </Typography>
        <Box
          sx={{
            position: "absolute",
            right: 16,
            bottom: 16,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.7,
            },
          }}
          onClick={() => handleButtonClick(workshopDetails.id)}
        >
          <ArrowForwardIcon
            color="action"
            fontSize="inherit"
            style={{
              fontSize: "4rem",
              color: "grey",
              fontWeight: "bolder",
            }}
          />
        </Box>
        <Box>
          {isAttending && (
            <Typography
              style={{
                fontSize: "0.8rem",
                marginTop: "5px",
                position: "relative",
                backgroundColor: "white",
                color: "black",
                borderRadius: "50%",
                width: "80px",
                height: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "2px solid black",
              }}
            >
              Predavač ste
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  let lastDate = null;
  let renderedWorkshopIDs = new Set();

  if (!hasFetched) {
    return <p>Učitavanje...</p>;
  }

  return (
    <>
     <DeleteAlert 
      message={infoMessage} 
      open={showAlert} 
      handleClose={handleClose} 
      style={alertStyle} 
    />

    <Box sx={{ display: "flex", p: 4 }}>
     
      <Box sx={{ flex: "1", pr: 2 }}>
        <Typography variant="h3" style={{ fontWeight: "bold" }}>
          Dobro došli, {userName}!
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, mb: 3 }}>
          Prikaz događaja
        </Typography>
        {/* Kalendar */}
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          formatShortWeekday={(locale, date) =>
            date.toLocaleDateString(locale, { weekday: "long" })
          }
          tileContent={({ date, view }) => {
            const workshopsOnDate = sortedWorkshops.filter((workshop) => {
              const workshopDate = new Date(workshop.startDateTime);
              return (
                workshopDate.getFullYear() === date.getFullYear() &&
                workshopDate.getMonth() === date.getMonth() &&
                workshopDate.getDate() === date.getDate()
              );
            });

            if (workshopsOnDate.length > 0) {
              let isAttending = false;
              let otherWorkshops = false;

              workshopsOnDate.forEach((workshop) => {
                if (workshopDetailsList.some((w) => w.id === workshop.id)) {
                  isAttending = true;
                } else {
                  otherWorkshops = true;
                }
              });

              return (
                <div
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    right: "5px",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  {isAttending && (
                    <div
                      className="dot-indicator"
                      style={{ backgroundColor: "rgb(248, 206, 204)" }}
                    ></div>
                  )}
                  {otherWorkshops && (
                    <div
                      className="dot-indicator"
                      style={{
                        backgroundColor: "rgb(225, 213, 231)",
                        marginLeft: isAttending ? "4px" : "0px",
                      }}
                    ></div>
                  )}
                </div>
              );
            }
          }}
        />

        <Box mt={2}>
          <div className="circle moji-dog"></div>
          <span className="label">Moji događaji</span>
        </Box>
        <Box mt={1}>
          <div className="circle svi-dog"></div>
          <span className="label">Svi događaji</span>
        </Box>
      </Box>

      <Box sx={{ flex: "1", pl: 2, mt: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column-reverse",
            alignItems: "flex-end",
          }}
        >
          {/* Dropdowns */}
          <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
            {[
              "Naziv",
              "Grupa događaja",
              "Način predavanja",
              "Događaji",
              "Datum od",
              "Datum do",
            ].map((name) => (
              <Dropdown
                key={name}
                label={name}
                value={
                  name === "Događaji" ? eventFilter : selectedValues[name] || ""
                }
                handleChange={handleDropdownChange}
                options={
                  name === "Događaji"
                    ? ["Moji događaji", "Svi događaji", "Prošli događaji"]
                    : undefined
                }
              />
            ))}
          </Box>

          {/* Button */}
          <Button
            size="small"
            variant="contained"
            sx={{
              backgroundColor: "lightgrey",
              color: "Black",
              mb: 1,
              marginRight: 23,
            }}
            onClick={() => {
              setSelectedDate(null);
            }}
          >
            Resetiraj filtere
          </Button>
        </Box>

        <Divider sx={{ my: 2, maxWidth: "80%" }} />

        {/* Radionice */}
        {filteredWorkshops.length > 0 ? (
          <>
            {filteredWorkshops
              .slice(startIndex, startIndex + 3)
              .map((workshop, index) => {
                const startDate = new Date(workshop.startDateTime);
                let formattedDate = startDate.toLocaleDateString("hr-HR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                });
                formattedDate = capitalizeFirstLetter(formattedDate);
                const showDateDivider = lastDate !== formattedDate;
                lastDate = formattedDate;
                return (
                  <div key={workshop.id}>
                    {showDateDivider && (
                      <Box mt={2} mb={2}>
                        <Typography variant="h6">{formattedDate}</Typography>
                        <Divider sx={{ maxWidth: "80%" }} />
                      </Box>
                    )}
                    <Workshop
                      workshopDetails={workshop}
                      isAttending={workshopDetailsList.some(
                        (w) => w.id === workshop.id
                      )}
                      handleButtonClick={handleButtonClick}
                      formatDateAndTimeRange={formatDateAndTimeRange}
                      getAvailableSpots={getAvailableSpots}
                    />
                  </div>
                );
              })}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                mt: 4,
                ml: 40,
              }}
            >
              <ArrowForwardIcon
                color="action"
                fontSize="inherit"
                style={{
                  fontSize: "4rem",
                  color: "grey",
                  fontWeight: "bolder",
                  cursor: startIndex > 0 ? "pointer" : "not-allowed",
                  transform: "rotate(180deg)",
                }}
                onClick={() => setStartIndex(Math.max(0, startIndex - 3))}
              />
              <ArrowForwardIcon
                color="action"
                fontSize="inherit"
                style={{
                  fontSize: "4rem",
                  color: "grey",
                  fontWeight: "bolder",
                  cursor:
                    startIndex + 1 < filteredWorkshops.length
                      ? "pointer"
                      : "not-allowed",
                }}
                onClick={() =>
                  setStartIndex(
                    Math.min(filteredWorkshops.length - 1, startIndex + 3)
                  )
                }
              />
            </Box>
          </>
        ) : (
          <Typography variant="h6">
            {isDateSelected
              ? `Nema radionica za odabrani datum (${selectedDate.toLocaleDateString(
                  "hr-HR"
                )})`
              : "Nema budućih radionica"}
          </Typography>
        )}
      </Box>
    </Box>
    </>
  );
}
export default AdminContent;
