import React, { useState, useEffect } from "react";
import "./Statistics.css";

const Statistics = () => {
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/Workshop/GetAllWorkshopsStatistics`
    )
      .then((response) => response.json())
      .then((data) => setWorkshops(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="content-wrapper">
      <div className="content-horizontal-center">
        <h1 style={{ textAlign: "left", marginTop: "70px", marginBottom: "70px" }}>Statistika</h1>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th className="naziv">Naziv</th>
              <th>Online polaznici</th>
              <th>Offline polaznici</th>
              <th>Dobiveni certifikati</th>
            </tr>
          </thead>
          <tbody>
            {workshops.map((workshop, index) => (
              <tr key={workshop.id}>
                <td className="number">{index + 1}.</td>
                <td className="naziv">{workshop.title}</td>
                <td className="narrow">
                  {workshop.onlineAttendees === 0 ? '-' : `${workshop.onlineSignedUpAttendees}/${workshop.onlineAttendees}`}
                </td>
                <td className="narrow">
                  {workshop.offlineAttendees === 0 ? '-' : `${workshop.offlineSignedUpAttendees}/${workshop.offlineAttendees}`}
                </td>
                <td className="narrow">{workshop.certificatesGiven}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Statistics;
