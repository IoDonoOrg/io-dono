import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Rating,
  Typography,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { styled } from "@mui/material/styles";
import { formatDate } from "src/utils/format";
import { completeDonation } from "src/services/donationService";
import { useDonation } from "src/hooks/useDonation";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff3d47",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

function CompleteDonationDialog({ open, onClose, donation }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const { updateDonationLocally } = useDonation();

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("La valutazione è obbligatoria");
      return;
    }

    const result = await completeDonation(donation._id, { rating, comment });

    if (result.success) updateDonationLocally(result.donation);

    resetForm();
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
    setError("");
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={resetForm} fullWidth maxWidth="sm">
        <DialogContent
          dividers
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                ID: {donation._id}
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Ritiro:
              </Typography>
              <Typography variant="body2" gutterBottom>
                {formatDate(donation.pickupTime)}
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Contenuti:
              </Typography>
              <Box>
                {donation.items?.map((item, index) => (
                  <Typography key={index} variant="body2">
                    {item.name} ({item.quantity})
                  </Typography>
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="body1" gutterBottom fontWeight="bold">
                Valutazione
              </Typography>
              <StyledRating
                value={rating}
                defaultValue={2}
                onChange={(event, newValue) => {
                  setRating(newValue);
                  setError("");
                }}
                size="medium"
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                max={10}
              />
              {error && (
                <Typography color="error" variant="caption" textAlign="center">
                  {error}
                </Typography>
              )}
            </Box>

            <TextField
              label="Commenti"
              multiline
              rows={3}
              placeholder="Aggiungi eventuali commenti sulla donazione..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
            />
          </>
        </DialogContent>

        <DialogActions sx={{ gap: 1, justifyContent: "space-between" }}>
          <Button onClick={resetForm} variant="contained" color="error">
            Chiudi
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="success">
            Completa
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CompleteDonationDialog;
