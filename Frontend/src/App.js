import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Prijava from "./components/LoginInputs/Login";
import Registracija from "./components/RegistrationInputs/Registration";
import { AuthProvider } from "./contexts/authentication";
import UserNavbar from "./components/PageElements/UserNavbar";
import AdminNavbar from "./components/PageElements/AdminNavbar";
import InfoPage from "./components/FrontPage/PublicContent";
import TermsOfService from "./components/TOSPage/TOSPage";
import UserContent from "./components/FrontPage/UserContent";
import AdminContent from "./components/FrontPage/AdminContent";
import CreateWorkshop from "./components/CreateWorkshop/CreateWorkshop";
import { Box } from "@mui/material";
import EmailConfirmation from "./components/EmailConfirmation/EmailConfirmation";
import UserProfile from "./components/Profile/UserProfile";
import AdminProfile from "./components/Profile/AdminProfile";
import Instructors from "./components/Instructors/Instructors";
import Statistics from "./components/Statistics/Statistics";
import WorkshopDetails from "./components/DetailsPage/WorkshopDetails"
import AdminWorkshopDetails from "./components/DetailsPage/AdminWorkshopDetails"
import InstructorProfile from "./components/Profile/InstructorProfile";
import EditWorkshop from "./components/CreateWorkshop/EditWorkshop";


function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");
  const hidePageElements = ["/public", "/prijava", "/registracija","/termsOfservice", "/"];

  let NavbarToDisplay;

  if (userRole == "3") {
    NavbarToDisplay = UserNavbar;
  } else if (userRole == "2") {
    NavbarToDisplay = AdminNavbar;
  }

  return (
    <div>
      {!hidePageElements.includes(location.pathname) && NavbarToDisplay && <NavbarToDisplay />}
      
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "80.2vh",
        }}
      >
        <Box sx={{ flex: "1" }}>
          <Routes>
          <Route path="/" element={<InfoPage />} />
            <Route path="/registracija" element={<Registracija />} />
            <Route path="/prijava" element={<Prijava />} />
            <Route path="/uvjetikoristenja" element={<TermsOfService />} />
            <Route path="/detaljiradionice/:id" element={<WorkshopDetails />} />
            <Route path="/admindetaljiradionice/:id" element={<AdminWorkshopDetails />} />
            <Route path="/adminuredipredavanje/:id" element={<EditWorkshop />} />

            <Route path="/pocetna" element={<UserContent />} />
            <Route path="/adminpocetna" element={<AdminContent />} />

            <Route path="/profil" element={<UserProfile />} />
            <Route path="/adminprofil" element={<AdminProfile />} />
            <Route path="/predavacprofil" element={<InstructorProfile />} />

            <Route path="/adminpredavaci" element={<Instructors />} />
            <Route path="/adminstatistika" element={<Statistics />} />
            <Route path="/adminkreiranjedogadaja" element={<CreateWorkshop />} />
            <Route path="/api/User/confirm-email" element={<EmailConfirmation />} />
          </Routes>
        </Box>
      </Box>
    </div>
  );
}

export default App;
