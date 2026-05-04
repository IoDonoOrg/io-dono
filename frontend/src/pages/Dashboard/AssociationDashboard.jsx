import HeaderBar from "src/components/ui/HeaderBar";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Paper } from "@mui/material";

import { useState } from "react";
import ActiveDonationsTile from "src/components/ui/ActiveDonationsTile";
import { DonationProvider } from "src/context/DonationProvider";
import DonationHistory from "src/components/ui/DonationHistory";
import TileClickable from "src/components/ui/TileClickable";
import DonationMapDialog from "src/components/ui/DonationMapDialog";

function AssociationDashboard() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

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
            <DonationMapDialog
              open={isMapOpen}
              onClose={() => setIsMapOpen(false)}
            />
            <Box className="flex flex-row gap-10 my-5">
              <TileClickable onClick={() => setIsHistoryOpen(true)}>
                Donazioni
              </TileClickable>
              <TileClickable onClick={() => setIsMapOpen(true)}>
                Mappa
              </TileClickable>
            </Box>
          </Paper>
        </Container>
      </DonationProvider>
    </>
  );
}

export default AssociationDashboard;
