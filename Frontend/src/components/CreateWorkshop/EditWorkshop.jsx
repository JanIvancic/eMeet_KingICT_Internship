import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import "./CreateWorkshop";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import axios from "axios";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import ListItemText from "@mui/material/ListItemText";
import Select from "react-select";
import SelectMui from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { MenuItem } from "@mui/material";
import { useParams } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/en-gb";
import utc from "dayjs/plugin/utc";
import makeAnimated from "react-select/animated";
import { set } from "lodash";

dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(updateLocale);
dayjs.extend(utc);
dayjs.locale("en-gb");
dayjs.updateLocale("en-gb", { weekStart: 1 });
const EditWorkshop = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState("Offline");
  const [onlineAttendees, setOnlineAttendees] = useState(0);
  const [offlineAttendees, setOfflineAttendees] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [address, setAddress] = useState("");
  const [room, setRoom] = useState("");
  const [accessLink, setAccessLink] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [images, setImages] = useState([]);
  const [map, setMap] = useState(null);
  const defaultCenter = { lat: 44.4737849, lng: 16.4688717 };
  const [center, setCenter] = useState(defaultCenter);
  const [isDefaultPosition, setIsDefaultPosition] = useState(true);
  const [zoom, setZoom] = useState(6);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [addressesLoaded, setAddressesLoaded] = useState(false);
  const [roomsLoaded, setRoomsLoaded] = useState(false);
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const [instructorsLoaded, setInstructorsLoaded] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const [groupError, setGroupError] = useState("");

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [onlineAttendeesError, setOnlineAttendeesError] = useState("");
  const [offlineAttendeesError, setOfflineAttendeesError] = useState("");
  const [accessLinkError, setAccessLinkError] = useState("");

  // const [dateError, setDateError] = useState("");
  // const [startTimeError, setStartTimeError] = useState("");
  // const [endTimeError, setEndTimeError] = useState("");

  const [timeError, setTimeError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [roomError, setRoomError] = useState("");

  const [instructorError, setInstructorError] = useState("");

  const [imageError, setImageError] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);

  const handleDeleteClick = () => {
    setModalVisible(true);
  };

  const handleNoClick = () => {
    setModalVisible(false);
  };

  const handleYesClick = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/Workshop/DeleteWorkshop?workshopId=${id}`
      );
      if (response.status === 200) {
        navigate("/adminpocetna", { state: { workshopDeleted: true } });
      }
    } catch (error) {
      console.error("An error occurred while deleting the workshop:", error);
      alert("An error occurred. Please try again.");
    }

    setModalVisible(false);
  };

  const handleInstructorChange = (selectedOption) => {
    setSelectedInstructors(selectedOption);
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCRJaICaJxFMN9Jhi5AbpeNBgJWMOcbA98",
  });

  const containerStyle = {
    width: "800px",
    height: "360px",
  };

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const animatedComponents = makeAnimated();

  const handleGroupsChange = (event) => {
    const selectedValues = event.target.value;
    setSelectedGroups(selectedValues);
    setSelectedImage(null);
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
    setOnlineAttendeesError("");
    setOfflineAttendeesError("");
    setOnlineAttendees(0);
    setOfflineAttendees(0);
  };

  const getNextWeekendDay = () => {
    const today = dayjs();
    const dayOfWeek = today.day();

    switch (dayOfWeek) {
      case 0:
        return today.add(6, "day");
      case 6:
        return today.add(1, "day");
      default:
        return today.add(6 - dayOfWeek, "day");
    }
  };

  const nameToPreferenceMap = {
    BA: 1,
    DEV: 2,
    QA: 3,
    Interno: 4,
  };

  const getImagesForSelectedGroups = (selectedGroups, images) => {
    return images.filter((image) =>
      selectedGroups.includes(
        nameToPreferenceMap[getOptionNameById(image.preference)]
      )
    );
  };

  const getOptionNameById = (id) => {
    const option = options.find((opt) => opt.id === id);
    return option.name;
  };
  const [options, setOptions] = useState([]);
  const displayedImages = getImagesForSelectedGroups(selectedGroups, images);

  const [value, setValue] = React.useState(getNextWeekendDay());
  const [startTime, setStartTime] = useState(
    dayjs().set("hour", 9).set("minute", 0).set("second", 0)
  );
  const [endTime, setEndTime] = useState(
    dayjs().set("hour", 17).set("minute", 0).set("second", 0)
  );

  const datePart = dayjs(value).format("YYYY-MM-DD");

  const startTimePart = dayjs(startTime).format("HH:mm:ss");
  const endTimePart = dayjs(endTime).format("HH:mm:ss");

  const combinedStartDateTime = dayjs.utc(`${datePart}T${startTimePart}Z`);
  const combinedEndDateTime = dayjs.utc(`${datePart}T${endTimePart}Z`);

  const startDateTimeISO = combinedStartDateTime.toISOString();
  const endDateTimeISO = combinedEndDateTime.toISOString();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/Preference`)
      .then((response) => response.json())
      .then((data) => {
        setOptions(data);
        setOptionsLoaded(true);
      })
      .catch((error) => console.error("Error fetching addresses: ", error));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/Address`)
      .then((response) => response.json())
      .then((data) => {
        setAddresses(data);
        setAddressesLoaded(true);
      })
      .catch((error) => console.error("Error fetching addresses:", error));
  }, []);

  useEffect(() => {
    if (address) {
      const selectedAddress = addresses.find((addr) => addr.id === address);
      const fullAddress = `${selectedAddress.streetName} ${selectedAddress.houseNumber}, ${selectedAddress.cityName}, ${selectedAddress.zipCode}, ${selectedAddress.countryName}`;

      axios
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
            fullAddress
          )}&key=AIzaSyCRJaICaJxFMN9Jhi5AbpeNBgJWMOcbA98`
        )
        .then((response) => {
          const { lat, lng } = response.data.results[0].geometry.location;
          setCenter({ lat, lng });
          setIsDefaultPosition(false);
        })
        .catch((error) => {
          console.log("Error fetching geocoding data: ", error);
        });
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      setZoom(17);
    } else {
      setZoom(6);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetch(
        `${process.env.REACT_APP_API_BASE_URL}/Room/GetRoomsByAddressId?id=${address}`
      )
        .then((response) => response.json())
        .then((data) => {
          setRooms(data);
          setRoomsLoaded(true);
        })
        .catch((error) => {
          console.error("Error fetching rooms:", error);
        });
    } else {
      setRooms([]);
    }
  }, [address]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/User/GetAllInstructors`)
      .then((response) => response.json())
      .then((data) => {
        const mappedInstructors = data.map((instructor) => ({
          value: instructor.id,
          label: `${instructor.firstName} ${instructor.lastName}`,
        }));
        setInstructors(mappedInstructors);
        setInstructorsLoaded(true);
      })
      .catch((error) => console.error("Error fetching instructors:", error));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/Picture`)
      .then((response) => response.json())
      .then((data) => {
        setImages(data);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);

  useEffect(() => {
    if (formSubmitted) {
      handleValidation();
    }
  }, [
    selectedGroups,
    title,
    description,
    accessLink,
    address,
    room,
    selectedImage,
    selectedInstructors,
    onlineAttendees,
    offlineAttendees,
    startTime,
    endTime,
    formSubmitted,
  ]);

  const handleValidation = () => {
    let isValid = true;
    const forbiddenCharacters = ['"', "\\", "\x00", "%00", "_", ";"];

    if (selectedGroups.length === 0) {
      setGroupError("Potrebno je odabrati barem jednu grupu događaja.");
      isValid = false;
    } else {
      setGroupError("");
    }

    if (title.trim() === "") {
      setTitleError("Naslov predavanja je obavezan.");
      isValid = false;
    } else if (title.length > 150) {
      setTitleError("Naslov predavanja ne može biti duži od 150 znakova.");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (forbiddenCharacters.some((char) => title.includes(char))) {
      setTitleError(
        'Tekst ne smije sadržavati sljedeće simbole ili kombinacije : " \\ \\x00 %00 _ ;'
      );
      isValid = false;
    }

    if (description.trim() === "") {
      setDescriptionError("Opis predavanja je obavezan.");
      isValid = false;
    } else if (description.length > 500) {
      setDescriptionError("Opis ne može biti duži od 500 znakova.");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (forbiddenCharacters.some((char) => description.includes(char))) {
      setDescriptionError(
        'Tekst ne smije sadržavati sljedeće simbole ili kombinacije : " \\ \\x00 %00 _ ;'
      );
      isValid = false;
    }
    if (accessLink.trim() === "") {
      setAccessLinkError("Pristupni link je obavezan.");
      isValid = false;
    } else if (!accessLink.startsWith("https://king-ict.webex.com/king-ict/")) {
      setAccessLinkError(
        "Pristupni link mora početi s 'https://king-ict.webex.com/king-ict/'."
      );
      isValid = false;
    } else if (accessLink.length > 300) {
      setAccessLinkError("Pristupni link ne može biti duži od 300 znakova.");
      isValid = false;
    } else {
      setAccessLinkError("");
    }

    if (forbiddenCharacters.some((char) => accessLink.includes(char))) {
      setAccessLinkError(
        'Tekst ne smije sadržavati sljedeće simbole ili kombinacije : " \\ \\x00 %00 _ ;'
      );
      isValid = false;
    }

    if (
      (mode === "Online" || mode === "Hibridno") &&
      (!onlineAttendees || onlineAttendees < 1)
    ) {
      setOnlineAttendeesError("Broj polaznika online mora biti veći od 0.");
      isValid = false;
    } else if (onlineAttendees > 20) {
      setOnlineAttendeesError("Maksimalan broj polaznika online je 20.");
      isValid = false;
    } else {
      setOnlineAttendeesError("");
    }

    if (
      (mode === "Offline" || mode === "Hibridno") &&
      (!offlineAttendees || offlineAttendees < 1)
    ) {
      setOfflineAttendeesError("Broj polaznika offline mora biti veći od 0.");
      isValid = false;
    } else if (offlineAttendees > 20) {
      setOfflineAttendeesError("Maksimalan broj polaznika offline je 20.");
      isValid = false;
    } else {
      setOfflineAttendeesError("");
    }

    if (startTime && endTime) {
      if (dayjs(endTime).diff(dayjs(startTime), "hour") < 1) {
        setTimeError(
          "Predavanje mora trajati barem 1 sat. Molimo odaberite drugo vrijeme."
        );
        isValid = false;
      } else {
        setTimeError("");
      }
    }

    if (!address) {
      setAddressError("Adresa je obavezna.");
      isValid = false;
    } else {
      setAddressError("");
    }

    if (!room) {
      setRoomError("Soba je obavezna.");
      isValid = false;
    } else {
      setRoomError("");
    }

    if (!selectedInstructors || selectedInstructors.length === 0) {
      setInstructorError("Potrebno je odabrati barem jednog predavača.");
      isValid = false;
    } else if (selectedInstructors.length > 5) {
      setInstructorError("Maksimalno je moguće odabrati 5 predavača.");
      isValid = false;
    } else {
      setInstructorError("");
    }

    if (!selectedImage) {
      setImageError("Slika je obavezna.");
      isValid = false;
    } else {
      setImageError("");
    }

    return isValid;
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/Workshop/Details?id=${id}`)
      .then((response) => {
        const data = response.data;
        setTitle(data.name);
        setDescription(data.description);
        setMode(
          data.eventType === 1
            ? "Online"
            : data.eventType === 2
            ? "Offline"
            : "Hibridno"
        );
        if(data.maxAttendeesOnline === 0) setOnlineAttendees(0)
        else setOnlineAttendees(data.maxAttendeesOnline-5);
        if(data.maxAttendeesOffline === 0) setOfflineAttendees(0)
        else setOfflineAttendees(data.maxAttendeesOffline-5);
        setAccessLink(data.accessLink);

        const matchingAddress = addresses.find(
          (addr) => addr.id === data.address.id
        );
        if (matchingAddress) {
          setAddress(matchingAddress.id);
        }

        const matchingRoom = rooms.find((r) => r.id === data.room.id);
        if (matchingRoom) {
          setRoom(matchingRoom.id);
        }

        if (Array.isArray(data.preferences)) {
          const preferenceIds = data.preferences.map(
            (preference) => preference.id
          );
          setSelectedGroups(preferenceIds);
        }

        setSelectedImage(data.picture);

        // ... rest of your code in the useEffect ...

        // 1. Get the list of host names from the received response.
        const hostNames = data.hosts.map((host) => ({
          firstName: host.firstName,
          lastName: host.lastName,
        }));

        // 2. Filter the loaded instructors using the host names.
        const matchedInstructors = instructors.filter((instructor) =>
          hostNames.some(
            (hostName) =>
              hostName.firstName === instructor.label.split(" ")[0] &&
              hostName.lastName === instructor.label.split(" ")[1]
          )
        );

        // 3. Set the matched instructors as the selectedInstructors.
        setSelectedInstructors(matchedInstructors);

        // ... rest of your code in the useEffect ...

        const startDateTimeFromAPI = dayjs(data.startDateTime); // assuming data.startDateTime = "2023-10-15T09:00:00";
        const endDateTimeFromAPI = dayjs(data.endDateTime); // assuming data.startDateTime = "2023-10-15T09:00:00";
        const startDate = startDateTimeFromAPI.format("YYYY-MM-DD"); // "2023-10-15"
        console.log("startDate", startDate);
        const startTime = startDateTimeFromAPI.format("HH:mm"); // "09:00"
        const endTime = endDateTimeFromAPI.format("HH:mm"); // "10:00"
        const startTimeHour = Number(startTime.split(":")[0]); // 9
        const startTimeMinute = Number(startTime.split(":")[1]); // 0
        const endTimeHour = Number(endTime.split(":")[0]); // 10
        const endTimeMinute = Number(endTime.split(":")[1]); // 0
        setValue(startDateTimeFromAPI);
        setStartTime(
          dayjs()
            .set("hour", startTimeHour)
            .set("minute", startTimeMinute)
            .set("second", 0)
        );
        setEndTime(
          dayjs()
            .set("hour", endTimeHour)
            .set("minute", endTimeMinute)
            .set("second", 0)
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the data", error);
      });
  }, [addressesLoaded, roomsLoaded, optionsLoaded, instructorsLoaded]);

  const createWorkshopAPI = () => {
    setFormSubmitted(true);
    const isValid = handleValidation();
    const adjustedMaxAttendeesOffline =
      offlineAttendees === 0 ? 0 : Number(offlineAttendees) + Number(5);
    const adjustedMaxAttendeesOnline =
      onlineAttendees === 0 ? 0 : Number(onlineAttendees) + Number(5);

    if (isValid) {
      const payload = {
        id: id,
        preferenceIds: selectedGroups.map(Number),
        name: title.trim(),
        description: description.trim(),
        availability: true, //Hardcoded
        eventType: mode === "Online" ? 1 : mode === "Offline" ? 2 : 3,
        maxAttendeesOffline: Number(adjustedMaxAttendeesOffline),
        maxAttendeesOnline: Number(adjustedMaxAttendeesOnline),
        pictureId: selectedImage ? Number(selectedImage.id) : null,
        startDateTime: startDateTimeISO,
        endDateTime: endDateTimeISO,
        addressId: address,
        roomId: room,
        hostIds: selectedInstructors.map((instructor) =>
          Number(instructor.value)
        ),
        accessLink: accessLink,
      };
      fetch(`${process.env.REACT_APP_API_BASE_URL}/Workshop/UpdateWorkshop`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Workshop updated successfully", data);
          navigate("/adminpocetna", { state: { workshopUpdated: true } });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div className="div-centered">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ margin: 0 }}>Kreiranje predavanja</h1>
        <button onClick={handleDeleteClick} className="admin-delete-button">
          <DeleteIcon />
        </button>
        <Dialog
          open={isModalVisible}
          disableEscapeKeyDown={true}
          PaperProps={{
            classes: {
              root: "workshop-shadowed-paper",
            },
          }}
        >
          <DialogTitle className="workshop-dialog-title">
            Želite li izbrisati predavanje?
          </DialogTitle>
          <DialogContent className="workshop-dialog-content">
            <DialogContentText>Ova akcija je nepovratna.</DialogContentText>
          </DialogContent>
          <DialogActions className="workshop-dialog-actions">
            <Button
              onClick={handleNoClick}
              color="primary"
              className="workshop-cancel-button"
            >
              Ne
            </Button>
            <Button
              onClick={handleYesClick}
              color="primary"
              className="workshop-confirm-button"
            >
              Da
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <FormControl
        sx={{ width: 300, marginTop: "30px", marginBottom: "10px" }}
        error={!!groupError}
      >
        <InputLabel id="grupa-dogadjaja-label">Grupa događaja</InputLabel>
        <SelectMui
          labelId="grupa-dogadjaja-label"
          id="grupa-dogadjaja"
          multiple
          value={selectedGroups}
          onChange={handleGroupsChange}
          input={<OutlinedInput label="Grupa događaja" />}
          renderValue={(selected) =>
            selected
              .map((id) => {
                const option = options.find((opt) => opt.id === id);
                return option.name === "DEV"
                  ? "DEV"
                  : option.name === "QA"
                  ? "QA"
                  : option.name === "BA"
                  ? "BA"
                  : option.name === "Interno"
                  ? "KING"
                  : "Ostalo";
              })
              .join(", ")
          }
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              <Checkbox checked={selectedGroups.indexOf(option.id) > -1} />
              <ListItemText
                primary={
                  option.name === "DEV"
                    ? "DEV - Razvoj softvera"
                    : option.name === "QA"
                    ? "QA - Osiguravanje kvalitete"
                    : option.name === "BA"
                    ? "BA - Poslovna analiza"
                    : option.name === "Interno"
                    ? "Kingovi događaji"
                    : "Ostalo"
                }
              />
            </MenuItem>
          ))}
        </SelectMui>
        {groupError && <FormHelperText>{groupError}</FormHelperText>}
      </FormControl>

      <div style={{ padding: "0px" }}>
        <h3>Općenito</h3>
        <hr />
        <TextField
          fullWidth
          label="Naslov predavanja"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ marginBottom: "20px", marginTop: "10px" }}
          error={!!titleError}
          helperText={titleError}
        />

        <div className="grid-container">
          <TextField
            fullWidth
            label="Opis predavanja"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={8}
            className="description"
            error={!!descriptionError}
            helperText={descriptionError}
          />

          <TextField
            fullWidth
            select
            label="Način predavanja"
            value={mode}
            onChange={handleModeChange}
            className="mode"
          >
            <MenuItem value="Offline">Offline</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="Hibridno">Hibridno</MenuItem>
          </TextField>

          <TextField
            fullWidth
            type="number"
            label="Broj polaznika online"
            value={onlineAttendees}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || Math.floor(val) == val) setOnlineAttendees(val);
            }}
            InputProps={{ inputProps: { min: 0, step: 1 } }}
            onKeyPress={(e) => {
              const allowedChars = "0123456789";
              if (!allowedChars.includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="mode"
            disabled={mode !== "Online" && mode !== "Hibridno"}
            error={!!onlineAttendeesError}
            helperText={onlineAttendeesError}
          />

          <TextField
            fullWidth
            type="number"
            label="Broj polaznika offline"
            value={offlineAttendees}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || Math.floor(val) == val)
                setOfflineAttendees(val);
            }}
            InputProps={{ inputProps: { min: 0, step: 1 } }}
            onKeyPress={(e) => {
              const allowedChars = "0123456789";
              if (!allowedChars.includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="mode"
            disabled={mode !== "Offline" && mode !== "Hibridno"}
            error={!!offlineAttendeesError}
            helperText={offlineAttendeesError}
          />
        </div>
        <TextField
          fullWidth
          label="Pristupni Link"
          value={accessLink}
          onChange={(e) => setAccessLink(e.target.value)}
          sx={{ width: "885px", marginBottom: "20px" }}
          error={!!accessLinkError}
          helperText={accessLinkError}
        />
      </div>

      <h3>Mjesto i vrijeme</h3>
      <hr />
      <div className="form-grid">
        <div className="form-column">
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="en-gb"
          >
            <DatePicker
              label="Datum predavanja"
              slotProps={{
                textField: {
                  readOnly: true,
                },
              }}
              value={value}
              format="DD/MM/YYYY"
              onChange={(newValue) => setValue(newValue)}
              shouldDisableDate={(date) => {
                const today = dayjs();
                const selectedDate = dayjs(date);
                const day = selectedDate.day();

                return (
                  selectedDate.isBefore(today, "day") ||
                  (day !== 6 && day !== 0) ||
                  selectedDate.isSame(today, "day")
                );
              }}
            />

            <TimePicker
              label="Vrijeme početka"
              slotProps={{
                textField: {
                  readOnly: true,
                  error: !!timeError,
                },
              }}
              inputFormat="HH:mm"
              ampm={false}
              locale="en-GB"
              value={startTime}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              onChange={(newTimeValue) => setStartTime(newTimeValue)}
              minTime={dayjs().hour(8).minute(0).second(0)}
              maxTime={dayjs().hour(18).minute(0).second(0)}
              minutesStep={5}
              openTo="hours"
              views={["hours", "minutes"]}
              error={!!timeError}
              helperText={{ timeError }}
            />

            <TimePicker
              label="Vrijeme kraja"
              slotProps={{
                textField: {
                  readOnly: true,
                  error: !!timeError,
                },
              }}
              inputFormat="HH:mm"
              ampm={false}
              value={endTime}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
              onChange={(newTimeValue) => setEndTime(newTimeValue)}
              minTime={dayjs().hour(9).minute(0).second(0)}
              maxTime={dayjs().hour(21).minute(0).second(0)}
              minutesStep={5}
              openTo="hours"
              views={["hours", "minutes"]}
              error={!!timeError}
            />
          </LocalizationProvider>

          <TextField
            fullWidth
            select
            label="Adresa"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              //setRoom("");
            }}
            error={Boolean(addressError)}
            helperText={addressError}
          >
            {addresses.map((addr) => (
              <MenuItem key={addr.id} value={addr.id}>
                {`${addr.zipCode} ${addr.cityName}, ${addr.streetName} ${addr.houseNumber}`}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            select
            label="Soba"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            disabled={!address}
            error={Boolean(roomError)}
            helperText={roomError}
          >
            {rooms.map((rm) => (
              <MenuItem key={rm.id} value={rm.id}>
                {rm.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="map">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={zoom}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              {!isDefaultPosition && <Marker position={center} />}
              <></>
            </GoogleMap>
          ) : (
            <>Učitavanje...</>
          )}
        </div>
      </div>
      <h3>Predavači</h3>
      <hr />
      <div style={{ marginTop: "10px", marginBottom: "6vh", width: "885px" }}>
        <Select
          styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
          isSearchable
          isMulti
          components={animatedComponents}
          value={selectedInstructors}
          onChange={handleInstructorChange}
          options={instructors}
          placeholder="Predavači"
        />

        {instructorError && (
          <div className="error-message">{instructorError}</div>
        )}
      </div>

      <h3>Slika</h3>
      <hr />
      <div className="image-container">
        {displayedImages.map((image) => (
          <div
            key={image.id}
            className={`image-preview ${
              selectedImage && selectedImage.id === image.id ? "selected" : ""
            }`}
            onClick={() => setSelectedImage(image)}
          >
            <img src={image.url} alt={`image${image.id}`} className="image" />
            {selectedImage && selectedImage.id === image.id && (
              <div className="image-overlay">
                <span className="checkmark">&#10003;</span>
              </div>
            )}
          </div>
        ))}
        {imageError && <div className="error-message">{imageError}</div>}
      </div>

      <div className="buttons">
        <Button
          href="/adminpocetna"
          className="button grey-button"
          onClick={() => {}}
        >
          Odustani
        </Button>
        <Button className="button" onClick={createWorkshopAPI}>
          Spremi promjene
        </Button>
      </div>
    </div>
  );
};

export default EditWorkshop;
