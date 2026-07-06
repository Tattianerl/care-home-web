import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Login } from "../pages/Login";
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
import { CreateUser } from "../pages/Register";
import { Funcionarios } from "../pages/Funcionarios";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users/new" element={<CreateUser />} />
        <Route path="/funcionarios" element={<Funcionarios />} />

        {/* Módulo de Pacientes */}
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/new" element={<CreatePatient />} />
        <Route path="/patients/:id" element={<PatientDetails />} />
        <Route path="/patients/:id/edit" element={<EditPatient />} />
        <Route path="/patients/:id/vital-signs/new" element={<CreateVitalSign />} />

        {/* Módulo de Agendamentos */}
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/appointments/new" element={<CreateAppointment />} />

        {/* Módulo de Evolução */}
        <Route
            path="/patients/:id/evolutions"
            element={<PatientEvolutions />}
          />

          <Route
            path="/patients/:id/evolutions/new"
            element={<CreateEvolution />}
          />
          <Route path="/evolutions/:id/edit" element={<EditEvolution />} />


          {/* Módulo Timeline */}
          <Route
            path="/patients/:id/timeline"
            element={<PatientTimeline />}
          />

          {/* Módulo Documentos */} 
          <Route
            path="/patients/:id/documents"
            element={<PatientDocuments />}
          />
          <Route
            path="/patients/:id/documents/new"
            element={<CreatePatientDocument />}
          />
        {/* Global */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}