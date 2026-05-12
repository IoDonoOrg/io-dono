import HeaderBar from "src/components/ui/HeaderBar";
import { Link as RouterLink } from "react-router-dom";
import { Box, Container, Paper } from "@mui/material";

import { useState } from "react";
import ActiveDonationsTile from "src/components/ui/ActiveDonationsTile";
import { DonationProvider } from "src/context/DonationProvider";
import DonationHistory from "src/components/ui/DonationHistory";
import TileClickable from "src/components/ui/TileClickable";
import DonationMapDialog from "src/components/ui/DonationMapDialog";
import { DIALOGS } from "src/utils/constants";
import AssociationStatistics from "src/components/ui/AssociationStatistics";
import CreateAssocDialog from "src/components/form/CreateAssocDialog";
import ReportHistory from "src/components/ui/ReportHistory";

function AdminDashboard() {
  const [openDialog, setOpenDialog] = useState(null);

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
              open={openDialog === DIALOGS.HISTORY}
              onClose={() => setOpenDialog(null)}
            />
            <DonationMapDialog
              open={openDialog === DIALOGS.MAP}
              onClose={() => setOpenDialog(null)}
            />
            <AssociationStatistics
              open={openDialog === DIALOGS.STATISTICS}
              onClose={() => setOpenDialog(null)}
            />
            <CreateAssocDialog
              open={openDialog === DIALOGS.CREATE_ASSOC}
              onClose={() => setOpenDialog(null)}
            />
            <ReportHistory
              open={openDialog === DIALOGS.MANAGE_REPORTS}
              onClose={() => setOpenDialog(null)}
              title={"Gestine Associazioni"}
              isAdmin
            />
            <Box className="grid grid-cols-3 gap-10 my-5">
              <TileClickable onClick={() => setOpenDialog(DIALOGS.HISTORY)}>
                Donazioni
              </TileClickable>
              <TileClickable onClick={() => setOpenDialog(DIALOGS.MAP)}>
                Mappa
              </TileClickable>
              <TileClickable onClick={() => setOpenDialog(DIALOGS.STATISTICS)}>
                Statistiche
              </TileClickable>
              <TileClickable
                onClick={() => setOpenDialog(DIALOGS.CREATE_ASSOC)}
              >
                Gestione Associazioni
              </TileClickable>
              <TileClickable
                onClick={() => setOpenDialog(DIALOGS.MANAGE_REPORTS)}
              >
                Gestione Segnalazioni
              </TileClickable>
            </Box>
          </Paper>
        </Container>
      </DonationProvider>
    </>
  );
}

export default AdminDashboard;
