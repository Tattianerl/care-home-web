import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Roles } from "../permissions/roles";

import { Login } from "../pages/Login";
import { MainLayout } from "../layouts/MainLayout";
import { Dashboard } from "../pages/Dashboard";
import { Patients } from "../pages/Patients";
import { PatientDetails } from "../pages/PatientDetails";
import { NotFound } from "../pages/NotFound";
import { PatientMedications } from "../pages/PatientMedications";

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
import { Reports } from "../pages/Reports";
import { EditAppointment } from "../pages/EditAppointment";
import { Documents } from "../pages/Documents";
import { PatientVitalSigns } from "../pages/PatientVitalSigns";

import { EvolutionsToday } from "../pages/EvolutionsToday";
import { SignatureSettings } from "../pages/SignatureSettings";
import { VitalSignsOverview } from "../pages/VitalSignsOverview";
import { EditPatient } from "../pages/EditPatient";
import { PatientNutritionHistory } from "../pages/PatientNutritionHistory";
import { TodayNutritionalAssessments } from "../pages/TodayNutritionalAssessments";
import { CreateMedication } from "../pages/CreateMedication";
import { EditMedication } from "../pages/EditMedication";

export function AppRoutes() {
  return (
    <BrowserRouter>
  <Routes>

    {/* Login */}
    <Route path="/" element={<Login />} />

    {/* Rotas protegidas */}
    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />

        {/* Pacientes */}
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/:id" element={<PatientDetails />} />
        <Route path="/patients/:id/edit" element={<EditPatient />} />

        {/* Sinais vitais */}
        <Route path="/patients/:id/vital-signs/new" element={<CreateVitalSign />}/>
        <Route path="/patients/:id/vital-signs" element={<PatientVitalSigns />} />
        <Route path="/vital-signs" element={<VitalSignsOverview />} />
        <Route path="/vital-signs/latest" element={<VitalSignsOverview />} />

        {/* Nutrição */}
        <Route path="/patients/:id/nutrition" element={<PatientNutritionHistory />} />
        <Route path="/nutritional-assessments/today" element={<TodayNutritionalAssessments />} />
       
        {/* Agendamentos */}
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/appointments/new" element={<CreateAppointment />} />
        <Route
          path="/appointments/:id/edit"
          element={<EditAppointment />}
        />

        {/* Evoluções */}
        <Route
          path="/evolutions"
          element={<EvolutionsToday />}
          />

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
        {/* Medicação */}
        <Route
          path="/patients/:id/medications"
          element={<PatientMedications />}
        />
        <Route
          path="/patients/:id/medications/new"
          element={<CreateMedication />}
        />
          <Route
            path="/medications/:id/edit"
            element={<EditMedication />}
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
        <Route path="/documents"
               element={<Documents />} />
               
        <Route path="/assinatura" 
               element={<SignatureSettings />} />      

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

          <Route
            path="/reports"
            element={<Reports />}
            />
        <Route
          path="/audit"
          element={<Audit />}
          />
         </Route>
      </Route>
    </Route>

    <Route path="*" element={<NotFound />} />

  </Routes>
</BrowserRouter>
  );
}