import { useAuth } from "src/hooks/useAuth";

import AssociationDashboard from "../Dashboard/AssociationDashboard";
import DonorDashboard from "../Dashboard/DonorDashboard";
import AdminDashboard from "../Example/Example";
import { USER_ROLE } from "src/utils/constants";

// un componente "switch"
// cambia il contenuto della rotta "/" in base al tipo dell'user
function Home() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case USER_ROLE.ASSOCIATION:
      return <AssociationDashboard />;

    case USER_ROLE.DONOR:
      return <DonorDashboard />;

    case USER_ROLE.ADMIN:
      return <AdminDashboard />;

    // fallback -> l'utente ha un ruolo ignoto
    default:
      return <div>Ruolo utente non riconosciuto</div>;
  }
}

export default Home;
