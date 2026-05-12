import { useState, useRef } from "react";
import { Typography, Popover, Box, Button, Stack } from "@mui/material";
import UserView from "./UserView";
import { useAuth } from "src/hooks/useAuth";
import { USER_ROLE } from "src/utils/constants";
import { useAlert } from "src/hooks/useAlert";
import AlertSnack from "./AlertSnack";
import { banUser } from "src/services/adminService";

function HoverUser({ user, onBan, onUnban }) {
  const [hoverAnchorEl, setHoverAnchorEl] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const { user: currentUser } = useAuth();
  const { alertData, alertSuccess, alertError, hideAlert } = useAlert();

  if (!user) return <Typography variant="body1">-</Typography>;

  const handlePopoverOpen = (e) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoverAnchorEl(e.currentTarget);
  };

  const handlePopoverClose = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverAnchorEl(null);
    }, 100);
  };

  const handlePopoverEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  // funzione per gestire il ban e l'unban
  const handleBan = async (isBanned) => {
    const result = await banUser(user._id, isBanned);

    if (result.success) {
      alertSuccess(result.message);

      if (isBanned && onBan) onBan(user._id);
      if (!isBanned && onUnban) onUnban(user._id);

      setHoverAnchorEl(null);
      return;
    }
    alertError(result.message);
  };

  const openHover = Boolean(hoverAnchorEl);

  return (
    <>
      <AlertSnack
        severity={alertData.severity}
        open={alertData.open}
        onClose={hideAlert}
      >
        {alertData.message}
      </AlertSnack>
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

          {currentUser.role === USER_ROLE.ADMIN && (
            <Stack
              direction="row"
              spacing={2}
              sx={{
                mt: 3,
                pt: 2,
                borderTop: 1,
                borderColor: "divider",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleBan(true)}
              >
                Ban
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={() => handleBan(false)}
                disableElevation
              >
                Unban
              </Button>
            </Stack>
          )}
        </Box>
      </Popover>
    </>
  );
}

export default HoverUser;
