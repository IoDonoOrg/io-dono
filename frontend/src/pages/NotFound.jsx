import { Box, Link, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Cat from "src/assets/cat.svg";

function Example() {
  return (
    <Container className="flex flex-col min-h-screen items-center justify-center gap-5">
      <p className="italic">Ooops!</p>
      <Box className="flex flex-col items-center">
        <h5 className="text-9xl font-bold text-gray-800">404</h5>
        <img src={Cat} className="max-w-xs max-h-xs" />
      </Box>
      <p className="text-gray-800 text-2xl">Pagina non trovata</p>
      <Link className="" to="/login" component={RouterLink}>
        Tornare al login
      </Link>
    </Container>
  );
}

export default Example;
