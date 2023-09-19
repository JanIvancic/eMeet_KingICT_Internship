import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Notifications from "@mui/icons-material/Notifications";
import AdbIcon from "@mui/icons-material/Adb";
import logo from "../../assets/logo_kingict_vikend-radionice.png";
import { useAuth } from "../../contexts/authentication";

const settings = ["Statistika", "Predavači", "Moj profil", "Odjava"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [anchorElNotification, setAnchorElNotification] = React.useState(null);
  const { removeToken } = useAuth();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenNotificationMenu = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorElNotification(null);
  };

  const handleStatisticsClick = () => {
    window.location.href = "/adminstatistika";
    handleCloseUserMenu();
  };

  const handleInstructorsClick = () => {
    window.location.href = "/adminpredavaci";
    handleCloseUserMenu();
  };

  const handleProfileClick = () => {
    window.location.href = "/adminprofil";
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    removeToken();
    window.location.href = "/prijava";
    handleCloseUserMenu();
  };

  // React.useEffect(() => {
  //   fetch("")
  //     .then((response) => response.json())
  //     .then((data) => setNotifications(data))
  //     .catch((error) => console.error("Greška:", error));
  // }, []);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "black",
        borderBottom: "15px solid rgb(51, 51, 255)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/adminpocetna"
            sx={{
              ml: -16,
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >

          <Box sx={{ width: "330px", height: "50px" }}>
            <img
              alt="king ict logo"
              src={logo}
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
          
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/adminkreiranjedogadaja"
            sx={{
              ml: 8,
              display: { xs: "none", md: "flex" },
              fontFamily: "",
              fontWeight: 600,
              color: "inherit",
              textDecoration: "none",
            }}
          > KREIRAJ PREDAVANJE</Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              sx={{ color: "white" }}
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            ></Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              color: "white",
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              textDecoration: "none",
            }}
          ></Typography>

          <Box sx={{ flexGrow: 1 }}></Box>

          <Tooltip title="Obavijesti">
            <IconButton
              onClick={handleOpenNotificationMenu}
              sx={{ p: 0, color: "white" }}
            >
              <Notifications fontSize="large" />
            </IconButton>
          </Tooltip>
          {/* obavijesti */}
          <Menu
            sx={{ mt: "45px" }}
            id="notifications-menu"
            anchorEl={anchorElNotification}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElNotification)}
            onClose={handleCloseNotificationMenu}
          >
            <MenuItem>
              <Typography textAlign="center">Nema obavijesti</Typography>
            </MenuItem>
          </Menu>

          <Tooltip title="Postavke">
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{ p: 0, color: "white", padding: "10px", mr: -16 }}
            >
              <AccountCircle fontSize="large" />
            </IconButton>
          </Tooltip>

          <Menu
            sx={{
              mt: "45px",
              width: "250px",
            }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem
                key={setting}
                sx={{ border: "1px solid black", padding: "10px", margin:"5px"}}
                onClick={
                  setting === "Statistika" ? handleStatisticsClick :
                  setting === "Predavači" ? handleInstructorsClick : 
                  setting === "Moj profil" ? handleProfileClick :
                  setting === "Odjava" ? handleLogout :
                  handleCloseUserMenu
                }
              >
                <Typography
                  textAlign="center"
                  sx={{ fontWeight: "bold", color: "black" }}
                >
                  {setting}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
