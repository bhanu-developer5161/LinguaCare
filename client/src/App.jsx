import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Educators from "./pages/Educators";
import EducatorProfile from "./pages/EducatorProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FamilyDashboard from "./pages/FamilyDashboard";
import EducatorDashboard from "./pages/EducatorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/educators" element={<Educators />} />
        <Route path="/educators/:id" element={<EducatorProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/family-dashboard"
          element={<FamilyDashboard />}
        />
        <Route
          path="/educator-dashboard"
          element={<EducatorDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;