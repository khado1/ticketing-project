import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import api from "../api";
import { useHistory } from "react-router-dom";

const NavbarMenu = ({ onLogout }) => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogOut = async () => {
    await api.logout();
    handleCloseMenu();
    onLogout();
    history.push("/login");
  };

  const goToMyTickets = () => {
    handleCloseMenu();
    history.push("/myTickets");
  };

  const goToBooking = () => {
    handleCloseMenu();
    history.push("/booking");
  };

  return (
    <div>
      <IconButton onClick={handleOpenMenu} color="inherit">
        <MenuIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={!!anchorEl}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={goToMyTickets}>My tickets</MenuItem>
        <MenuItem onClick={goToBooking}>Order ticket</MenuItem>
        <MenuItem onClick={handleLogOut}>Log out</MenuItem>
      </Menu>
    </div>
  );
};

export default NavbarMenu;
