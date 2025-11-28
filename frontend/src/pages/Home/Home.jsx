import { useAuth } from "src/hooks/useAuth";

import AssociationDashboard from "../Dashboard/AssociationDashboard";
import DonorDashboard from "../Dashboard/DonorDashboard";
import AdminDashboard from "../Example/Example";

// un componente "switch"
// cambia il contenuto della rotta dashboard in base all tipo dello user
function Home() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "ASSOCIATION":
      return <AssociationDashboard />;

    case "DONOR":
      return <DonorDashboard />;

    case "ADMIN":
      return <AdminDashboard />;

    // fallback -> l'utente ha un ruolo ignoto
    default:
      return <div>Ruolo utente non riconosciuto</div>;
  }
}

export default Home;
