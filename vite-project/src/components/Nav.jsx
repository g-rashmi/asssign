import * as React from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

export default function Navbar() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleMenu = (e) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);
  const handleDrawerToggle = () => setDrawerOpen((prev) => !prev);

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
    handleMenuClose();
    setDrawerOpen(false);
  };

  if (!user) return null;

  return (
    <>
     
      <AppBar position="static" sx={{ backgroundColor: "#3A3F58" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          
          <IconButton
            edge="start"
            color="inherit"
            sx={{ mr: 1, display: { xs: "block", sm: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {user.displayName}
          </Typography>

          <IconButton color="inherit" onClick={handleMenu}>
            {user.photoURL ? (
              <Avatar src={user.photoURL} sx={{ width: 36, height: 36 }} />
            ) : (
              <AccountCircle sx={{ width: 36, height: 36 }} />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>

      
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250, p: 2, backgroundColor: "#f0f0f0", height: "100%" }}>
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            {user.photoURL ? (
              <Avatar src={user.photoURL} sx={{ width: 48, height: 48 }} />
            ) : (
              <AccountCircle fontSize="large" />
            )}
            <Box>
              <Typography variant="subtitle1">{user.displayName}</Typography>
              <Typography variant="body2" color="textSecondary">
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Box>
      </Drawer>
      <Menu
        id="menu-appbar"
        anchorEl={menuAnchor}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem disabled>{user.email}</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
