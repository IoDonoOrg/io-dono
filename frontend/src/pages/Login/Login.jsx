import { TextField, Button, Container, Box } from "@mui/material";

import { useState } from "react";

import PasswordField from "src/components/PasswordField";

import { GoogleLogin } from "@react-oauth/google";
import { validateEmail } from "src/utils/validation";
import { validatePassword } from "src/utils/validation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const emailResult = validateEmail(email);
    setEmailError(emailResult);

    const passwordResult = validatePassword(password);
    setPasswordError(passwordResult);

    if (emailResult || passwordResult) return;

    console.log("Form is valid. Submitting:", { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Container
        maxWidth="xs"
        className="bg-white p-8 border-2 border-gray-100/35 rounded-lg shadow-md/15"
      >
        <Box>
          <div>
            <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError} // '!!' converts the string to a boolean
              helperText={emailError} // Displays the error message
            />
            <PasswordField
              passwordValue={password}
              onPasswordChange={setPassword}
              error={!!passwordError}
              errorText={passwordError}
            />
            <Button color="primary" type="submit" fullWidth variant="contained">
              Accedi
            </Button>
          </form>
        </Box>
        <Box>
          <Box className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-600 text-sm">oppure</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </Box>
          <Box className="flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
              }}
              onError={() => console.log("Login failed")}
            />
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
