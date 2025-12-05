import HeaderBar from "src/components/ui/HeaderBar";
import { Link as RouterLink } from "react-router-dom";
import { Fab, Link, Tooltip } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CreateDonationDialog from "src/components/ui/CreateDonationDialog";

function DonorDashboard() {
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  return (
    <>
      <HeaderBar />
      <Tooltip title="Crea donazione" arrow>
        <Fab
          color="primary"
          aria-label="add"
          size="medium"
          onClick={() => setIsDonationOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
      <CreateDonationDialog
        open={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
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
