import axios from "axios";

export const register = async (data) =>
  await axios.post(import.meta.env.VITE_REACT_APP_API + "/register", data);

export const login = async (data) =>
  await axios.post(import.meta.env.VITE_REACT_APP_API + "/login", data);

export const loginLine = async (data) =>
  await axios.post(import.meta.env.VITE_REACT_APP_API + "/login-line", data);

export const loginFacebook = async (data) =>
  await axios.post(import.meta.env.VITE_REACT_APP_API + "/login-facebook", data);

export const currentUser = async (authtoken) => {
  return await axios.post(
    import.meta.env.VITE_REACT_APP_API + "/current-user",
    {},
    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};

export const currentAdmin = async (authtoken) =>
  await axios.post(
    import.meta.env.VITE_REACT_APP_API + "/current-admin",
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
