import HeaderBar from "src/components/ui/HeaderBar";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";

function DonorDashboard() {
  return (
    <>
      <HeaderBar />
      <Link className="" to="/registration" component={RouterLink}>
        Non hai ancora un account?
      </Link>
      <div>
        <p>Donor dashboard</p>
      </div>
    </>
  );
}

export default DonorDashboard;
