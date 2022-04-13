import {
  AppBar, Typography, Grid, Toolbar,
} from '@mui/material';

export function Header(props) {
  return (
    <AppBar
      component="div"
      color="primary"
      position="static"
      elevation={0}
      sx={{ zIndex: 0, py: 4, px: 10 }}
    >
      <Toolbar>
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs>
            <Typography color="inherit" variant="h3" component="h1">
              Canary DApp
              <Typography sx={{fontSize: 12}}>
                {props.currentAccount}
              </Typography>
            </Typography>
          </Grid>

        </Grid>
      </Toolbar>
    </AppBar>
  );
}
