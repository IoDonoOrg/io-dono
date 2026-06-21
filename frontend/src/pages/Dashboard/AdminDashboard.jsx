import HeaderBar from "src/components/ui/HeaderBar";
import { Box, Container, Paper } from "@mui/material";

import { useState } from "react";
import TileClickable from "src/components/ui/TileClickable";
import { DIALOGS } from "src/utils/constants";
import CreateAssocDialog from "src/components/form/CreateAssocDialog";
import ReportHistory from "src/components/ui/ReportHistory";
import AdminStats from "src/components/ui/AdminStats";

function AdminDashboard() {
  const [openDialog, setOpenDialog] = useState(null);

  return (
    <>
      {/* 
        DonationProvider è il contesto React che ci permette di aggiornare 
        l'elenco delle donazione appena ne viene creata / cancellata / modificata una 
      */}
      <HeaderBar />
      <Container className="flex flex-col items-center justify-between mx-15 my-5 p-2">
        <Paper
          className="flex flex-col items-center space-y-4 p-5 w-3/4"
          sx={{
            borderRadius: 2,
          }}
        >
          <AdminStats />
          <CreateAssocDialog
            open={openDialog === DIALOGS.CREATE_ASSOC}
            onClose={() => setOpenDialog(null)}
          />
          <ReportHistory
            open={openDialog === DIALOGS.MANAGE_REPORTS}
            onClose={() => setOpenDialog(null)}
            title={"Gestione Segnalazioni"}
            isAdmin
          />
          <Box className="grid grid-cols-3 gap-10 my-5">
            <TileClickable onClick={() => setOpenDialog(DIALOGS.CREATE_ASSOC)}>
              Aggiungi Associazione
            </TileClickable>
            <TileClickable
              onClick={() => setOpenDialog(DIALOGS.MANAGE_REPORTS)}
            >
              Gestione Segnalazioni
            </TileClickable>
            <TileClickable onClick={() => setOpenDialog(DIALOGS.MANAGE_USERS)}>
              Gestione Utenti
            </TileClickable>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default AdminDashboard;
