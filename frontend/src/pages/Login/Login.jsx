import { TextField, Button, Container, Box, Grid } from "@mui/material";

function Login() {
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
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              color="primary"
              fullWidth
              variant="contained"
              // onClick={handleLogin}
            >
              Sign In
            </Button>
          </div>
        </Box>
        <Box>
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-600 text-sm">Or continue with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          <div></div>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
