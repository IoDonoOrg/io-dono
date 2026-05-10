import React from "react";
import { Grid, Typography, Box } from "@mui/material";

import { formatDate, formatStatus } from "src/utils/format";

function DonationView({ donation, short = false }) {
  if (!donation) {
    return (
      <Typography color="text.secondary">
        Nessuna donazione selezionata
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {!short && (
        <Grid item size={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Status
          </Typography>
          <Typography variant="body1">
            {formatStatus(donation.status)}
          </Typography>
        </Grid>
      )}
      <Grid item size={6}>
        <Typography variant="subtitle2" color="text.secondary">
          ID Donazione
        </Typography>
        <Typography variant="body1">{donation._id}</Typography>
      </Grid>
      <Grid item size={6}>
        <Typography variant="subtitle2" color="text.secondary">
          ID Donatore
        </Typography>
        <Typography variant="body1">{donation.donorId}</Typography>
      </Grid>

      <Grid item size={6}>
        <Typography variant="subtitle2" color="text.secondary">
          Data creazione
        </Typography>
        <Typography variant="body1">
          {formatDate(donation.createdAt)}
        </Typography>
      </Grid>

      <Grid item size={6}>
        <Typography variant="subtitle2" color="text.secondary">
          Data e Ora Ritiro
        </Typography>
        <Typography variant="body1">
          {formatDate(donation.pickupTime)}
        </Typography>
      </Grid>

      {donation.notes && !short && (
        <Grid item size={12}>
          <Typography variant="subtitle2" color="text.secondary">
            Note
          </Typography>
          <Typography variant="body1">{donation.notes}</Typography>
        </Grid>
      )}

      <Grid item size={12}>
        <Typography variant="subtitle2" color="text.secondary">
          Luogo di Ritiro
        </Typography>
        <Typography variant="body1">
          {donation.pickupLocation.address}
        </Typography>
      </Grid>
      {!short && (
        <Grid item size={12}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            display="block"
            gutterBottom
          >
            Contenuti
          </Typography>
          <Box
            sx={{
              bgcolor: "grey.50",
              p: 1.5,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            {donation.items && donation.items.length > 0 ? (
              donation.items.map((item, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  sx={{ mb: index !== donation.items.length - 1 ? 0.5 : 0 }}
                >
                  {item.name} - {item.quantity} {item.units || ""}
                </Typography>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                Nessun articolo registrato
              </Typography>
            )}
          </Box>
        </Grid>
      )}
    </Grid>
  );
}

export default DonationView;
