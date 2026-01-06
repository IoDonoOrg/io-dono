import HeaderBar from "src/components/ui/HeaderBar";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Fab, Paper, Tooltip } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CreateDonationDialog from "src/components/form/CreateDonationDialog";
import ActiveDonationsTile from "src/components/ui/ActiveDonationsTile";
import { DonationProvider } from "src/context/DonationProvider";
import DonationHistory from "src/components/ui/DonationHistory";
import TileClickable from "src/components/ui/TileClickable";

function DonorDashboard() {
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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
            <DonationHistory
              open={isHistoryOpen}
              onClose={() => setIsHistoryOpen(false)}
            />

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
            <Box className="flex flex-row gap-10 my-5">
              <TileClickable onClick={() => setIsHistoryOpen(true)}>
                Storico
              </TileClickable>
              <TileClickable>Mappa</TileClickable>
              <TileClickable>Ricompense</TileClickable>
            </Box>
          </Paper>
        </Container>
      </DonationProvider>
    </>
  );
}

export default DonorDashboard;
