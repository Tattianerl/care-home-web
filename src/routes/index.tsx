import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Roles } from "../permissions/roles";

import { Login } from "../pages/Login";
import { MainLayout } from "../layouts/MainLayout";
import { Dashboard } from "../pages/Dashboard";
import { Patients } from "../pages/Patients";
import { PatientDetails } from "../pages/PatientDetails";
import { NotFound } from "../pages/NotFound";
import { CreatePatient } from "../pages/CreatePatient";
import { EditPatient } from "../pages/EditPatient";

import { Appointments } from "../pages/Appointments"; 
import { CreateAppointment } from "../pages/CreateAppointment";
import { CreateVitalSign } from "../pages/CreateVitalSign";

import { PatientEvolutions } from "../pages/PatientEvolutions";
import { CreateEvolution } from "../pages/CreateEvolution";
import { EditEvolution } from "../pages/EditEvolution";
import { PatientTimeline } from "../pages/PatientTimeline";
import { PatientDocuments } from "../pages/PatientDocuments";
import { CreatePatientDocument } from "../pages/CreatePatientDocument";
import { CreateUser } from "../pages/Funcionarios/CreateUser";
import { Funcionarios } from "../pages/Funcionarios";
import { Perfil } from "../pages/Perfil";
import { Audit } from "../pages/Audit";


export function AppRoutes() {
  return (
    <BrowserRouter>
  <Routes>

    {/* Login */}
    <Route path="/" element={<Login />} />

    {/* Rotas protegidas */}
    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />

        {/* Pacientes */}
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/new" element={<CreatePatient />} />
        <Route path="/patients/:id" element={<PatientDetails />} />
        <Route path="/patients/:id/edit" element={<EditPatient />} />
        <Route
          path="/patients/:id/vital-signs/new"
          element={<CreateVitalSign />}
        />

        {/* Agendamentos */}
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/appointments/new" element={<CreateAppointment />} />

        {/* Evoluções */}
        <Route
          path="/patients/:id/evolutions"
          element={<PatientEvolutions />}
        />
        <Route
          path="/patients/:id/evolutions/new"
          element={<CreateEvolution />}
        />
        <Route
          path="/evolutions/:id/edit"
          element={<EditEvolution />}
        />

        {/* Timeline */}
        <Route
          path="/patients/:id/timeline"
          element={<PatientTimeline />}
        />

        {/* Documentos */}
        <Route
          path="/patients/:id/documents"
          element={<PatientDocuments />}
        />
        <Route
          path="/patients/:id/documents/new"
          element={<CreatePatientDocument />}
        />

        {/* Somente ADMIN */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={[Roles.ADMIN]}
            />
          }
        >
         <Route 
            path="/funcionarios/new"
            element={<CreateUser />}
            />
            
          <Route
            path="/funcionarios"
            element={<Funcionarios />}
          />
        </Route>

        <Route
          path="/audit"
          element={<Audit />}
          />

      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />

  </Routes>
</BrowserRouter>
  );
}