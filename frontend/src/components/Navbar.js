import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" style={{ textDecoration: 'none', color: 'white', flexGrow: 1 }}>
          Engineer Blog
        </Typography>
        <Button color="inherit" component={RouterLink} to="/create">
          新規投稿
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
