import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { login, loginFacebook } from "../../functions/AuthFunction";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginRedux } from "../../store/userSlice";
import { useSelector } from "react-redux";
import { FaFacebook } from "react-icons/fa";
import { BsLine } from "react-icons/bs";
import { toast } from 'react-toastify';


// Login Line
import liff from "@line/liff";

// Login Facebook
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import { useEffect } from "react";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Login() {
  const { user } = useSelector((state) => ({ ...state }));
  const navi = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    liff.init({
      liffId: (import.meta.env.VITE_LINE_LIFF_ID),
    });
  }, []);

  const handleLoginLiff = () => {
    try {
      liff.login();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const form = {
      name: data.get("name"),
      password: data.get("password"),
    };
    login(form)
    .then((res) => {
        toast.success("User : "+res.data.payload.user.name + " Login Successfully")
        dispatch(
          loginRedux({
            name: res.data.payload.user.name,
            role: res.data.payload.user.role,
            token: res.data.token,
          })
        );
        localStorage.setItem("token", res.data.token);
        roleRedirects(res.data.payload.user.role);
      })
      .catch((err) => toast.error(err.response.data));
  };

  const roleRedirects = (role) => {
    if (role === "admin") {
      navi("/admin/index");
    } else {
      navi("/user/index");
    }
  };

  const responseFacebook = async (response) => {
    await loginFacebook(response)
      .then((res) => {
        dispatch(
          loginRedux({
            name: res.data.payload.user.name,
            role: res.data.payload.user.role,
            token: res.data.token,
          })
        );
        toast.success("User : "+res.data.payload.user.name + " Login Successfully")
        roleRedirects(res.data.payload.user.role);
      })
      .catch((err) => console.log(err));
  };

  return user.user.length === 0 ? (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="success"
                onClick={handleLoginLiff}
                sx={{ mb: 2 }}
                startIcon={<BsLine />}
              >
                Login With Line
              </Button>

              <FacebookLogin
                appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                autoLoad={false}
                fields="name,email,picture"
                callback={responseFacebook}
                render={(renderProps) => (
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={renderProps.onClick}
                    startIcon={<FaFacebook />}
                  >
                    Login With Facebook
                  </Button>
                )}
              />

              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2">
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  ) : (
    roleRedirects(user.user.role)
  );
}