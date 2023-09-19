import React, { useState, useEffect } from "react";
import {useLocation} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import "./AdminProfile.css";

const InstructorProfile = () => {
  const [profileData, setProfileData] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const hostId = searchParams.get('hostId'); 

  const userPreferences = {
    1: "BA",
    2: "DEV",
    3: "QA",
    4: "KING",
  };

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/User/GetUserProfileDetailsById?id=${hostId}`
    )
      .then((response) => response.json())
      .then((data) => setProfileData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="admin-profile-wrapper">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ textAlign: "left", margin: 0 }}>Profil predavača</h1>
      </div>
      <hr />
      {profileData ? (
        <div>
          <img
            src={profileData.pictureURL || 'https://icon-library.com/images/default-user-icon/default-user-icon-13.jpg' }
            alt="Profile"
            className="admin-profile-picture"
          />
          <div className="admin-profile-detail">
            <label>Ime</label>
            <input type="text" readOnly value={profileData.firstName} />
          </div>
          <div className="admin-profile-detail">
            <label>Prezime</label>
            <input type="text" readOnly value={profileData.lastName} />
          </div>
          <div className="admin-profile-detail">
            <label>Email</label>
            <input type="text" readOnly value={profileData.email} />
          </div>
          {/* <div className="admin-profile-detail">
            <label>Broj telefona</label>
            <input type="text" readOnly value={profileData.phoneNumber} />
          </div> */}
          <div className="admin-profile-detail">
            <label>Područje interesa</label>
            <input
              type="text"
              readOnly
              value={profileData.userPreferenceIDs
                .map((id) => userPreferences[id])
                .join(", ")}
            />
          </div>
          <div className="admin-profile-detail">
            <label>Opis</label>
            <textarea
              readOnly
              value={profileData.description}
              rows="10"
              className="textarea"
            ></textarea>
          </div>
        </div>
      ) : (
        <p>Učitavanje...</p>
      )}
    </div>
  );
};

export default InstructorProfile;
