import { ButtonBase, Paper, Typography } from "@mui/material";

function TileClickable({ children, onClick }) {
  return (
    <Paper
      elevation={3}
      // Tailwind non avrebbe aiutato qua, perché bisgona accedere al css "originale",
      // il ciò è possibile solo tramite la prop sx
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        borderRadius: 4,
        overflow: "hidden",
        transition: "0.2s",
        width: "100%",
        height: "120",
        "&:hover": {
          backgroundColor: "primary.dark",
          elevation: 6,
        },
      }}
    >
      <ButtonBase
        onClick={onClick}
        // stessa situazione di prima
        sx={{
          width: "100%",
          height: "100%",
          paddingX: 3,
          paddingY: 1.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="body1">{children}</Typography>
      </ButtonBase>
    </Paper>
  );
}

export default TileClickable;
