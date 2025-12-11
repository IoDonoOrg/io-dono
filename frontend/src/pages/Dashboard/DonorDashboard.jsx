import HeaderBar from "src/components/ui/HeaderBar";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Fab,
  Link,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CreateDonationDialog from "src/components/ui/CreateDonationDialog";
import DonationBar from "src/components/ui/DonationBar";
import ActiveDonationsTile from "src/components/ui/ActiveDonationsTile";
import { DonationProvider } from "src/context/DonationProvider";

function DonorDashboard() {
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  return (
    <>
      {/* 
        DonationProvider è il contesto React che ci permette di aggiornare 
        l'elenco delle donazione appena ne viene creata / cancellata / modificata una 
      */}
      <DonationProvider>
        <HeaderBar />
        <Container className="flex flex-col items-center justify-between mx-15 my-5 p-2">
          <Paper
            className="flex flex-col items-center space-y-4 p-5 w-3/4"
            sx={{
              borderRadius: 2,
            }}
          >
            <ActiveDonationsTile displayNumber={4} />
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
          </Paper>
        </Container>
      </DonationProvider>
    </>
  );
}

export default DonorDashboard;
