import { TextField, Button, Container, Box } from "@mui/material";

import { useState } from "react";
import handleLogin from "../../utils/handleLogin";

import PasswordField from "../../components/PasswordField";

import { GoogleLogin } from "@react-oauth/google";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Container
        maxWidth="xs"
        className="bg-white p-8 border-2 border-gray-100/35 rounded-lg shadow-md/15"
      >
        <Box>
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          <div className="flex flex-col gap-4">
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <PasswordField
              passwordValue={password}
              onPasswordChange={setPassword}
            />
            <Button
              color="primary"
              fullWidth
              variant="contained"
              onClick={() => handleLogin(email, password)}
            >
              Accedi
            </Button>
          </div>
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
