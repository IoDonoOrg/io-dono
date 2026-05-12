import api from "./api";

// PATCH /users/:id/admin-state
// Ban/unban utente (solo ADMIN)
// isBanned: true per bannare, false per unban
export const banUser = async (id, isBanned, bannedReason = null) => {
  try {
    const result = await api.patch(`/admin/users/${id}`, {
      isBanned,
      ...(isBanned && bannedReason && { bannedReason }),
    });
    return {
      success: true,
      message: isBanned ? "Utente bannato con successo" : "Utente sbannato con successo",
      user: result.data.user,
    };
  } catch (e) {
    if (e.response) {
      console.log("Errore backend: ", e.response.data.message);
      return {
        success: false,
        message: e.response.data.message,
      };
    }
    return {
      success: false,
      message: "Errore server backend",
    };
  }
};
