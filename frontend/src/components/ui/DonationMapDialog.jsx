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

import "leaflet/dist/leaflet.css";

// fix per icon dei marker mancanti in production (leaflet non funziona out-of-the box con bundler tipo Vite)
// vedi https://github.com/Leaflet/Leaflet/issues/4968
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { DONATION_STATUS } from "src/utils/constants";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// TODO: idealmente dovrebbero essere le coordinate di indirizzo dell'utente
// Per ora sono coordinate di Trento
const DEFAULT_START_COORDS = [46.06787, 11.12108];

const createColoredIcon = (color) =>
  L.divIcon({
    className: "",
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 8.5 12.5 28.5 12.5 28.5S25 21 25 12.5C25 5.596 19.404 0 12.5 0z" fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12.5" cy="12.5" r="5" fill="white"/>
    </svg>`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });

const MARKER_ICONS = {
  [DONATION_STATUS.AVAILABLE]: createColoredIcon("#4caf50"), // verde
  [DONATION_STATUS.ACCEPTED]: createColoredIcon("#ff9800"), // arancione
  [DONATION_STATUS.COMPLETED]: createColoredIcon("#2196f3"), // blu
  [DONATION_STATUS.CANCELLED]: createColoredIcon("#f44336"), // rosso
};

const DEFAULT_ICON = createColoredIcon("#9e9e9e");

export default function DonationMapDialog({ open, onClose }) {
  const { allDonations } = useDonation();

  // filtriamo le donazioni per mostrare solo quelle non completate
  const preparedDonations = allDonations?.filter(
    (d) => d.status !== DONATION_STATUS.COMPLETED,
  );

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
          {open && (
            <MapContainer
              center={DEFAULT_START_COORDS}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {preparedDonations?.map((donation) => (
                <Marker
                  key={donation._id}
                  // GeoJSON è [Lng, Lat], Leaflet aspetta [Lat, Lng] => scambio
                  position={[
                    donation.pickupLocation.geo.coordinates[1],
                    donation.pickupLocation.geo.coordinates[0],
                  ]}
                  icon={MARKER_ICONS[donation.status] ?? DEFAULT_ICON}
                >
                  <Popup>
                    <div>
                      <strong>Status:</strong> {donation.status}
                      <br />
                      {/* TODO: cambiare l'id donatore a qualcosa più leggibile */}
                      <strong>ID donatore:</strong> {donation.donorId}
                      <br />
                      <strong>ID donazione:</strong> {donation._id} <br />
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
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
