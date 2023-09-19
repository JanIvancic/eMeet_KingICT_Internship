import React, { useState, useEffect } from "react";
import "./Instructors.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDesc, setExpandedDesc] = useState(null);

  const userPreferences = {
    1: "BA",
    2: "DEV",
    3: "QA",
    4: "KING",
  };

  function normalizeString(str) {
    return str
      .replace(/[ćč]/g, "c")
      .replace(/[š]/g, "s")
      .replace(/[đ]/g, "d")
      .replace(/[ž]/g, "z")
      .toLowerCase();
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/User/GetAllInstructors`)
      .then((response) => response.json())
      .then((data) => setInstructors(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const toggleDescription = (id, description) => {
    if (description.length > 58) {
      setExpandedDesc(expandedDesc === id ? null : id);
    }
  };

  const filteredInstructors = instructors.filter((instructor) => {
    const fullName = `${instructor.firstName} ${instructor.lastName}`;
    const normalizedFullName = normalizeString(fullName);
    const normalizedSearchTerm = normalizeString(searchTerm);

    return (
      normalizeString(instructor.firstName).includes(normalizedSearchTerm) ||
      normalizeString(instructor.lastName).includes(normalizedSearchTerm) ||
      normalizedFullName.includes(normalizedSearchTerm)
    );
  });

  return (
    <div className="content-wrapper">
      <h1
        style={{ textAlign: "left", marginTop: "70px", marginBottom: "70px" }}
      >
        Predavači
      </h1>
      <input
        type="text"
        placeholder="Pretraži prema imenu ili prezimenu"
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Slika</th>
            <th>Prezime</th>
            <th>Ime</th>
            <th>Opis</th>
            <th>Područje interesa</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredInstructors.length > 0 ? (
            filteredInstructors.map((instructor) => (
              <tr key={instructor.id}>
                <td>
                  <img src={instructor.pictureURL} alt="Predavač" />
                </td>
                <td>{instructor.lastName}</td>
                <td>{instructor.firstName}</td>
                <td>
                  <div className="description-wrapper">
                    {instructor.description.length > 50 ? (
                      <>
                        <span>{`${instructor.description.substring(
                          0,
                          50
                        )}...`}</span>
                        <button
                          className="expand-button"
                          onClick={() =>
                            toggleDescription(
                              instructor.id,
                              instructor.description
                            )
                          }
                        >
                          <ArrowDropDownIcon fontSize="medium" />
                        </button>
                      </>
                    ) : (
                      instructor.description
                    )}

                    {expandedDesc === instructor.id && (
                      <div
                        className="description-dropdown expanded"
                        style={{
                          marginTop:
                            expandedDesc === instructor.id ? "350px" : "0px",
                        }}
                      >
                        {instructor.description}
                      </div>
                    )}
                  </div>
                </td>

                <td>
                  {instructor.userPreferenceIDs
                    .map((id) => userPreferences[id])
                    .join(", ")}
                </td>
                <td>{instructor.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  fontStyle: "italic",
                  color: "grey",
                }}
              >
                Predavač sa traženim imenom ili prezimenom ne postoji.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Instructors;
