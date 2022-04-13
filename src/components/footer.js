import { AppBar, Typography, Toolbar } from '@mui/material';

export function Footer() {
  return (
    <AppBar
      component="div"
      color="primary"
      position="static"
      elevation={0}
    >
      <Toolbar>
        <Typography color="inherit" variant="h5" component="h1" align="center" width="100%">
          With
          <span className="material-icons">favorite</span>
          from Fuerteventura
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
