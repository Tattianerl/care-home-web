import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import { Patients } from "../pages/Patients";
import { PatientDetails } from "../pages/PatientDetails";
import { NotFound } from "../pages/NotFound";
import { CreatePatient } from "../pages/CreatePatient";
import { EditPatient }
from "../pages/EditPatient";
 
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route 
          path="/" 
          element={<Login />} 
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/patients"
          element={<Patients />}
        />

        <Route
          path="/patients/:id"
          element={<PatientDetails />}
        />
        <Route
          path="/patients/new"
          element={<CreatePatient />}
        />
        <Route
          path="/patients/:id/edit"
          element={<EditPatient />}
        />

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}
