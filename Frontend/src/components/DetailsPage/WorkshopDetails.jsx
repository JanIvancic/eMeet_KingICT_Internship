import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextareaAutosize from "@mui/material/TextareaAutosize";

const WorkshopDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [hostDetailsMap, setHostDetailsMap] = useState({});
  //const [details, setDetails] = useState({});
  const [hostDetails, setHostDetails] = useState({});
  const [eventType, setEventType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user"));

  const currentDateTime = new Date();
  const workshopEndDateTime = new Date(details?.endDateTime);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const attendee = details?.attendees?.find(
    (attendee) => attendee.id === userData.id
  );
  const isUserRegistered = attendee !== undefined;

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleStarClick = (newRating) => {
    setRating(newRating);
  };

  useEffect(() => {
    const fetchWorkshopDetails = async (id) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/Workshop/Details?id=${id}`
        );
        const data = await response.json();
        setDetails(data);

        if (data.hosts && data.hosts.length > 0) {
          data.hosts.forEach((host) => {
            fetchHostDetails(host.id);
          });
        }
        if (data.eventType === 3) {
          setEventType(3);
        }
      } catch (error) {
        console.error("Error fetching workshop details for ID:", id, error);
      }
    };

    const fetchHostDetails = async (hostId) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/User/GetUserProfileDetailsById?id=${hostId}`
        );
        const data = await response.json();
        setHostDetailsMap((prevHostDetails) => ({
          ...prevHostDetails,
          [hostId]: data,
        }));
      } catch (error) {
        console.error("Error fetching host details for HostID:", hostId, error);
      }
    };

    fetchWorkshopDetails(id);
  }, [id]);

  const handleRegister = async (attendanceType) => {
    const isHost = userData.role !== 3;
    const payload = {
      userId: userData.id,
      workshopId: Number(id),
      attendanceType,
      isHost,
    };
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/UserWorkshops`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.status === 200) {
        setShowModal(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error registering for workshop:", error);
    }
  };

  if (!details) {
    return <div>Dohvaćanje podataka...</div>;
  }

  const getUserAttendanceType = (attendees, userId) => {
    const attendee = attendees.find((attendee) => attendee.id === userId);
    return attendee ? attendee.attendanceType : null;
  };

  const handleButtonClick = async () => {

    const isHost = userData.role !== 3;
    const existingAttendanceType = getUserAttendanceType(
      details.attendees,
      userData.id
    );

    const sendUnregisterRequest = async () => {
      const payload = {
        userId: userData.id,
        workshopId: Number(id),
        attendanceType: existingAttendanceType,
        isHost,
      };
      console.log("payload",payload)
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/UserWorkshops`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        if (response.status === 200) {
          console.log("Successfully unregistered from workshop");
          window.location.reload();
        } else {
          console.error("Failed to unregister from workshop");
        }
      } catch (error) {
        console.error("Error unregistering for workshop:", error);
      }
    };

    if (existingAttendanceType) {
      await sendUnregisterRequest();
      await sendUnregisterRequest();
    } else if (eventType === 3) {
      setShowModal(true);
    } else {
      return;
      // const newAttendanceType = eventType;
      // handleRegister(newAttendanceType);
    }
  };

  const {
    name,
    startDateTime,
    endDateTime,
    description,
    picture,
    address,
    room,
    attendees,
    //eventType,
    maxAttendeesOffline,
    maxAttendeesOnline,
    hosts,
  } = details;

  const attendeesOnline = attendees.filter((a) => a.attendanceType === 1);
  const attendeesOnsite = attendees.filter((a) => a.attendanceType === 2);
  const maxAttendees = maxAttendeesOnline + maxAttendeesOffline;

  const typeMap = {
    1: "online",
    2: "offline",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "80%",
          justifyContent: "space-between",
        }}
      >
        <div>
          <img
            src={picture.url}
            alt="Workshop"
            style={{ width: "400px", height: "300px" }}
          />
          <div>
            <p>
              {address.streetName} {address.houseNumber}
            </p>
            <p>
              {address.zipCode} {address.cityName}, {address.countryName}
            </p>
            <p>Soba {room.name}</p>

            {address.cityName === "Zagreb" ? (
              <iframe
                title="zagreb_karta"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6621.663414787042!2d15.98784793073814!3d45.74981247334116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4765d58ea546c3db%3A0x8fca5a162e17184d!2sKING%20ICT!5e0!3m2!1shr!2shr!4v1693320580967!5m2!1shr!2shr"
                width="300"
                height="300"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <iframe
                title="split_karta"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d32731.084394545498!2d16.403814905058017!3d43.522223743553!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13355fab84b83829%3A0x63178dbde6b3db40!2sKING%20ICT!5e0!3m2!1shr!2shr!4v1693321151361!5m2!1shr!2shr"
                width="300"
                height="300"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            )}
          </div>
        </div>
        <div style={{ flex: 1, marginLeft: "20px" }}>
          <h1>{name}</h1>
          <hr />
          <p>
            <b>
              {new Date(startDateTime).toLocaleDateString("hr-HR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
              ~
              {new Date(startDateTime).toLocaleTimeString("hr-HR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              -
              {new Date(endDateTime).toLocaleTimeString("hr-HR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </b>
          </p>
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              border: "1px solid black",
              borderRadius: "12px",
              position: "relative",
            }}
          >
            <p>{description}</p>
            <h2>Predavači</h2>

            <div>
              {details?.hosts?.length ? (
                details?.hosts?.map((host, index) => (
                  <div key={index}>
                    <a
                      href={`/predavacprofil?hostId=${host.id}`}
                      style={{
                        textDecoration: "underline",
                        fontWeight: "bold",
                        color: "inherit",
                      }}
                    >
                      {host.firstName} {host.lastName}
                    </a>
                  </div>
                ))
              ) : (
                <p>Nema predavača</p>
              )}
            </div>

            <h2>
              {`Polaznici (${attendees.length}/${
                details.eventType === 1
                  ? maxAttendeesOnline
                  : details.eventType === 2
                  ? maxAttendeesOffline
                  : maxAttendees
              })`}
            </h2>
            <div>
              {details.eventType === 3 ? (
                <>
                  <h3>
                    Online ({attendeesOnline.length}/{maxAttendeesOnline})
                  </h3>
                  {attendeesOnline.length ? (
                    attendeesOnline.map((attendee, index) => (
                      <div key={index}>
                        <span style={{ marginLeft: "40px" }}> </span>
                        {attendee.firstName} {attendee.lastName}
                      </div>
                    ))
                  ) : (
                    <p>Nema online polaznika</p>
                  )}

                  <h3>
                    Offline ({attendeesOnsite.length}/{maxAttendeesOffline})
                  </h3>
                  {attendeesOnsite.length ? (
                    attendeesOnsite.map((attendee, index) => (
                      <div key={index}>
                        <span style={{ marginLeft: "30px" }}> </span>
                        {attendee.firstName} {attendee.lastName}
                      </div>
                    ))
                  ) : (
                    <p>Nema offline polaznika</p>
                  )}
                </>
              ) : (
                <>
                  {attendees.length ? (
                    attendees.map((attendee, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", alignItems: "baseline" }}
                      >
                        <span
                          style={{ minWidth: "150px", display: "inline-block" }}
                        >
                          {attendee.firstName} {attendee.lastName}
                        </span>
                        {/* <span>({typeMap[attendee.attendanceType]})</span> */}
                      </div>
                    ))
                  ) : (
                    <p>Nema polaznika</p>
                  )}
                </>
              )}
            </div>
          </div>

          <Box
            sx={{
              display: "flex",
              justifyContent: "right",
              mt: 3,
              mb: 2,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: "20%",
                bgcolor: "#3f51b5",
                color: "#ffffff",
                "&:hover": {
                  bgcolor: "#303f9f",
                },
                mt: 3,
                mb: 2,
              }}
              onClick={() => {
                if (currentDateTime > workshopEndDateTime) {
                  handleClickOpen();
                } else if (
                  maxAttendees &&
                  details?.attendees?.length >= maxAttendees &&
                  !isUserRegistered
                ) {
                  // logika
                } else {
                  if (isUserRegistered) {
                    handleButtonClick();
                  } else {
                    if (details?.eventType === 1) {
                      handleRegister(1);
                    } else if (details?.eventType === 2) {
                      handleRegister(2);
                    } else if (details?.eventType === 3) {
                      setShowModal(true);
                    }
                  }
                }
              }}
            >
              {currentDateTime > workshopEndDateTime
                ? "Ocijeni predavanje"
                : maxAttendees &&
                  details?.attendees?.length >= maxAttendees &&
                  !isUserRegistered
                ? "Prijavi se na listu čekanja"
                : isUserRegistered
                ? "Odjavi se"
                : "Prijavi se"}
            </Button>

            <Dialog
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  minWidth: "20%",
                  backgroundColor: "rgb(240, 246, 255)",
                },
              }}
            >
              <DialogTitle>
                Ocijeni predavanje
                <button
                  onClick={handleClose}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    fontSize: "24px",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "black",
                  }}
                >
                  X
                </button>
              </DialogTitle>
              <DialogContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "20px",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => handleStarClick(star)}
                      style={{ fontSize: "24px", cursor: "pointer" }}
                    >
                      {star <= rating ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label>Komentar:</label>
                </div>
                <TextareaAutosize
                  minRows={6}
                  placeholder="Napišite svoju ocjenu ovdje"
                  style={{ width: "100%" }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Spremi</Button>
              </DialogActions>
            </Dialog>
          </Box>

          {/* Modal */}
          {showModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.7)",
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgb(248, 206, 204)",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    fontSize: "24px",
                    backgroundColor: "transparent",
                    border: "none",
                  }}
                >
                  X
                </button>
                <h3 style={{ textAlign: "center" }}>Odaberite način prijave</h3>
                <Button
                  onClick={() => handleRegister(1)}
                  variant="outlined"
                  style={{
                    color: "black",
                    padding: "15px 30px",
                    margin: "10px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  Online
                </Button>
                <Button
                  onClick={() => handleRegister(2)}
                  variant="outlined"
                  style={{
                    color: "black",
                    padding: "15px 30px",
                    margin: "10px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  Offline
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkshopDetails;
