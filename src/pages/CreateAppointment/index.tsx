import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import type { Patient } from "../../types/patient";
import { MainLayout } from "../../layouts/MainLayout";
import { createAppointment } from "../../services/appointments";
import { getPatients } from "../../services/patients";

export function CreateAppointment() {
  const navigate = useNavigate();

  // Estados dos formulários
  const [titulo, setTitulo] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [patientId, setPatientId] = useState("");

  // Estados auxiliares e de busca
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPatients() {
      try {
        const response = await getPatients();
        
        if (isMounted) {
          const actualData = Array.isArray(response) 
            ? response 
            : (response?.data && Array.isArray(response.data) ? response.data : []);
          
          setPatients(actualData);
        }
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
      }
    }

    loadPatients();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.nome.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!patientId) {
      alert("Selecione um paciente");
      return;
    }

    try {
      await createAppointment({
        titulo,
        dataHora: new Date(dataHora).toISOString(), // Formata a data de forma segura para o back
        observacoes: observacoes,
        patientId,
      });

      alert("Agendamento criado com sucesso!");
      navigate("/appointments");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar agendamento");
    }
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Novo Agendamento</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-4"
      >
        {/* TÍTULO */}
        <input
          placeholder="Título / Procedimento"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border p-3 rounded-lg"
          required
        />

        {/* DATA E HORA */}
        <input
          type="datetime-local"
          value={dataHora}
          onChange={(e) => setDataHora(e.target.value)}
          className="w-full border p-3 rounded-lg"
          required
        />

        {/* CAMPO DE BUSCA DE PACIENTE POR NOME */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Buscar Paciente por Nome
          </label>
          <input
            type="text"
            placeholder="Digite o nome do idoso para filtrar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border p-3 rounded-lg bg-gray-50 focus:bg-white"
          />

          {/* SELECT COM A LISTA FILTRADA */}
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full border p-3 rounded-lg"
            required
          >
            <option value="">
              {filteredPatients.length === 0 
                ? "Nenhum paciente encontrado..." 
                : "Selecione o paciente na lista..."}
            </option>
            {filteredPatients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.nome}
              </option>
            ))}
          </select>
        </div>

        {/* OBSERVAÇÕES */}
        <textarea
          placeholder="Observações"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        {/* BOTÃO SALVAR */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Salvar Agendamento
        </button>
      </form>
    </MainLayout>
  );
}