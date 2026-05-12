import { useState, useRef } from "react";
import { Typography, Popover, Box } from "@mui/material";
import UserView from "./UserView";

function HoverUser({ user }) {
  const [hoverAnchorEl, setHoverAnchorEl] = useState(null);
  const hoverTimeoutRef = useRef(null);

  // se non c'è un utente, mostra un trattino invece di un popover vuoto
  if (!user) return <Typography variant="body1">-</Typography>;

  const handlePopoverOpen = (e) => {
    // se c'è già un timeout in corso, lo cancella
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoverAnchorEl(e.currentTarget);
  };

  // un timeout di 100ms per evitare che il popover si chiuda immediatamente quando si sposta il mouse dal popover
  const handlePopoverClose = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverAnchorEl(null);
    }, 100);
  };

  const handlePopoverEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  const openHover = Boolean(hoverAnchorEl);

  return (
    <>
      <Typography
        variant="body1"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        aria-owns={openHover ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        sx={{
          cursor: "pointer",
          textDecoration: "underline",
          color: "primary.main",
          display: "inline-block",
        }}
      >
        {user.name}
      </Typography>

      <Popover
        id="mouse-over-popover"
        open={openHover}
        anchorEl={hoverAnchorEl}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        disableScrollLock
        sx={{
          pointerEvents: "none",
        }}
        PaperProps={{
          onMouseEnter: handlePopoverEnter,
          onMouseLeave: handlePopoverClose,
          sx: {
            pointerEvents: "auto",
          },
        }}
      >
        <Box sx={{ p: 2, maxWidth: 400 }}>
          <UserView user={user} />
        </Box>
      </Popover>
    </>
  );
}

export default HoverUser;
