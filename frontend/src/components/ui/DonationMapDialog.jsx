import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useDonation } from "src/hooks/useDonation";
import { formatDate } from "src/utils/format";

// TODO: idealmente dovrebbero essere le coordinate di indirizzo dell'utente
// Per ora sono coordinate di Trento
const DEFAULT_START_COORDS = [46.06787, 11.12108];

export default function DonationMapDialog({ open, onClose }) {
  const { allDonations } = useDonation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: { height: "80vh" },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div" fontWeight="bold">
          Mappa Punti di Ritiro
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ height: "100%", width: "100%" }}>
          <MapContainer
            center={DEFAULT_START_COORDS}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {allDonations?.map((donation) => (
              <Marker
                key={donation._id}
                // GeoJSON è [Lng, Lat], Leaflet aspetta [Lat, Lng] => scambio
                position={[
                  donation.pickupLocation.geo.coordinates[1],
                  donation.pickupLocation.geo.coordinates[0],
                ]}
              >
                <Popup>
                  <div>
                    <strong>ID:</strong> {donation._id.substring(0, 10)} <br />
                    <strong>Data ritiro:</strong>{" "}
                    {formatDate(donation.pickupTime)} <br />
                    <strong>Indirizzo:</strong> <br />
                    {donation.pickupLocation.address}
                    <br />
                    <strong>Contenuti:</strong>
                    <br />{" "}
                    {donation.items.map((i, index) => (
                      <div key={index}>
                        {i.name} ({i.quantity})
                      </div>
                    ))}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
