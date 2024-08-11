import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Typography, Divider, Box, ListItemButton, IconButton, useMediaQuery } from '@mui/material';
import {Quiz, Logout,AccountCircle} from '@mui/icons-material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';

const StudentSidebar = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    navigate('/');
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" align="center">Logo</Typography>
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1 }}>
        <List>
          <ListItemButton component={Link} to="/game-landing">
            <ListItemIcon><Quiz /></ListItemIcon>
            <ListItemText primary="Play Quiz" />
          </ListItemButton>
          <ListItemButton component={Link} to="/poll-display">
            <ListItemIcon><Quiz /></ListItemIcon>
            <ListItemText primary="Play Poll" />
          </ListItemButton>
        </List>
      </Box>
      <Divider />
      <Box>
        <List>
          <ListItem>
          <ListItemIcon><AccountCircle /></ListItemIcon>
            <ListItemText primary="Username" />
          </ListItem>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><Logout /></ListItemIcon>
            {/* <ListItemText primary="Logout" /> */}
            <ListItemText primary="Back to Home" />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <IconButton onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Drawer anchor="left" open={open} onClose={toggleDrawer}>
            {drawerContent}
          </Drawer>
        </>
      ) : (
        <Drawer variant="permanent" open>
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default StudentSidebar;
