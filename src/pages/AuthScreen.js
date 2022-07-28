import React, { Fragment, useState, useRef, useContext } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Card,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { LOGIN_USER, SIGNUP_USER } from "../graphql/mutations";
import AuthContext from "../store/auth-context";

const AuthScreen = () => {
  const { loginHandler } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(true);
  const authForm = useRef(null);
  const [formData, setFormData] = useState({});

  // We need to pass the mutation in here
  // When we signup the user through signupUser function, we get loading, after loading we get data or error
  const [signupUser, { data: signupData, loading: l1, error: e1 }] =
    useMutation(SIGNUP_USER);

  // The second argument we send, is the function where you want to do something with the data that is returned, you can also receive data from loginData, but this method is better.
  const [loginUser, { data: loginData, loading: l2, error: e2 }] = useMutation(
    LOGIN_USER,
    {
      onCompleted(data) {
        loginHandler(data.signinUser.token);
      },
    }
  );

  if (l1 || l2) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
        <Typography variant="h6" marginLeft={2}>
          Authenticating...
        </Typography>
      </Box>
    );
  }

  const handleChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log(formData);
    if (showLogin) {
      loginUser({
        variables: {
          userSignin: formData,
        },
      });
      // if (loginData) {
      //   const token = loginData.signinUser.token;
      //   console.log(token);
      // }
    } else {
      signupUser({
        variables: {
          // The name of the variable we used in mutation
          userNew: formData,
        },
      });
    }
  };

  return (
    // Box is like a div, and you can add css to it directly as a prop.
    <Box
      ref={authForm}
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh"
      component="form"
      onSubmit={handleSubmit}
    >
      <Card variant="outlined" sx={{ padding: "10px" }}>
        {/* Stack helps in aligning content either vertically or horizontally */}
        <Stack
          direction="column"
          spacing={2}
          // To add custom css
          sx={{ width: "400px" }}
        >
          {signupData && (
            <Alert severity="success">
              {signupData.signupUser.firstName} signed up successfully!
            </Alert>
          )}
          {e1 && <Alert severity="error">{e1.message}</Alert>}
          {e2 && <Alert severity="error">{e2.message}</Alert>}

          {/* Typography is for text or headings */}
          <Typography variant="h5">
            Please {showLogin ? "Login" : "Signup"}
          </Typography>
          {!showLogin && (
            <Fragment>
              <TextField
                name="firstName"
                label="First Name"
                variant="standard"
                onChange={handleChange}
                required
              />
              <TextField
                name="lastName"
                label="Last Name"
                variant="standard"
                onChange={handleChange}
                required
              />
            </Fragment>
          )}
          <TextField
            type="email"
            name="email"
            label="email"
            variant="standard"
            onChange={handleChange}
            required
          />
          <TextField
            type="password"
            name="password"
            label="password"
            variant="standard"
            onChange={handleChange}
            required
          />
          <Typography
            textAlign="center"
            variant="subtitle1"
            onClick={() => {
              setShowLogin((prevState) => !prevState);
              setFormData({});
              authForm.current.reset();
            }}
          >
            {showLogin ? "Signup?" : "Login?"}
          </Typography>
          <Button variant="outlined" type="submit">
            {showLogin ? "Login" : "Signup"}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default AuthScreen;
