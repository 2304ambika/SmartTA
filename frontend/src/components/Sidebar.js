// import React, { useState } from 'react';
// import { Drawer, List, ListItem, ListItemText, ListItemIcon, Typography, Divider, Box, ListItemButton, IconButton } from '@mui/material';
// import { Home, TextSnippet, Summarize, Note, Slideshow, Quiz, ChevronLeft, ChevronRight } from '@mui/icons-material';

// const Sidebar = () => {
//   const [open, setOpen] = useState(false);

//   const toggleDrawer = () => {
//     setOpen(!open);
//   };

//   return (
//     <div>
//       <Drawer
//         anchor="left"
//         open={open}
//         onClose={() => setOpen(false)}
//       >
//         <Box sx={{ width: 240 }}>
//           <Typography variant="h6" align="center">Logo</Typography>
//           <Divider />
//           <List>
//             <ListItemButton component="div">
//               <ListItemIcon><Home /></ListItemIcon>
//               <ListItemText primary="Home" />
//             </ListItemButton>
//             <ListItemButton component="div">
//               <ListItemIcon><TextSnippet /></ListItemIcon>
//               <ListItemText primary="Generate Text" />
//             </ListItemButton>
//             <ListItemButton component="div">
//               <ListItemIcon><Summarize /></ListItemIcon>
//               <ListItemText primary="Summarize Doc" />
//             </ListItemButton>
//             <ListItemButton component="div">
//               <ListItemIcon><Note /></ListItemIcon>
//               <ListItemText primary="Scan Class Notes" />
//             </ListItemButton>
//             <ListItemButton component="div">
//               <ListItemIcon><Slideshow /></ListItemIcon>
//               <ListItemText primary="Create PPT" />
//             </ListItemButton>
//             <ListItemButton component="div">
//               <ListItemIcon><Quiz /></ListItemIcon>
//               <ListItemText primary="Generate Quiz" />
//             </ListItemButton>
//           </List>
//           <Divider />
//           <List>
//             <ListItemButton component="div">
//               <ListItemText primary="Username" />
//             </ListItemButton>
//             <ListItemButton component="div">
//               <ListItemText primary="Help Center" />
//             </ListItemButton>
//           </List>
//         </Box>
//       </Drawer>
//       <IconButton
//         onClick={toggleDrawer}
//         sx={{
//           position: 'fixed',
//           left: open ? 240 : 0,
//           transition: 'left 0.3s ease-out',
//           zIndex: 1,
//         }}
//       >
//         {open ? <ChevronLeft /> : <ChevronRight />}
//       </IconButton>
//     </div>
//   );
// };

// export default Sidebar;

// Sidebar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Typography, Divider, Box, ListItemButton, IconButton, useMediaQuery } from '@mui/material';
import { TextSnippet, Summarize, Note, Slideshow, Quiz, Logout } from '@mui/icons-material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';

const Sidebar = () => {
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
          <ListItemButton component={Link} to="/summarize-doc">
            <ListItemIcon><Summarize /></ListItemIcon>
            <ListItemText primary="Summarize Doc" />
          </ListItemButton>
          <ListItemButton component={Link} to="/whiteboard">
            <ListItemIcon><Note /></ListItemIcon>
            <ListItemText primary="Scan Class Notes" />
          </ListItemButton>
          <ListItemButton component={Link} to="/create-ppt">
            <ListItemIcon><Slideshow /></ListItemIcon>
            <ListItemText primary="Create PPT" />
          </ListItemButton>
          <ListItemButton component={Link} to="/quiz-landing">
            <ListItemIcon><Quiz /></ListItemIcon>
            <ListItemText primary="Generate Quiz" />
          </ListItemButton>
        </List>
      </Box>
      <Divider />
      <Box>
        <List>
          <ListItem>
            <ListItemText primary="Username" />
          </ListItem>
          {/* <ListItemButton component={Link} to="/help-center">
            <ListItemIcon><HelpOutlineOutlinedIcon /></ListItemIcon>
            <ListItemText primary="Help Center" />
          </ListItemButton> */}
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon><Logout /></ListItemIcon>
            <ListItemText primary="Logout" />
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

export default Sidebar;
