import type {
  BloodType,
  DependencyLevel,
  Gender,
  MaritalStatus,
} from "./enums";
import type { Evolution } from "./evolution";

export interface PatientDetails {
  id: string;
  nome: string;

  dataNascimento: string;

  cpf?: string | null;
  rg?: string | null;
  naturalidade?: string | null;
  estadoCivil?: MaritalStatus | null;
  cartaoSus?: string | null;
  fotoUrl?: string | null;
  quartoLeito?: string | null;
  genero: Gender;

  responsavel: string;
  telefone: string;

  responsavelCpf?: string | null;
  responsavelGrauParentesco?: string | null;
  responsavelEmail?: string | null;
  responsavelEndereco?: string | null;

  tipoSanguineo?: BloodType | null;
  planoSaude?: string | null;
  contatoEmergencia?: string | null;
  grauDependencia?: DependencyLevel | null;

  historicoMedico?: string | null;
  alergias?: string | null;
  diagnosticos?: string | null;
  restricaoAlimentar?: string | null;
  observacoes?: string | null;

  ativo: boolean;
  falecido: boolean;

  dataInternacao?: string | null;
  dataAlta?: string | null;

  createdAt: string;

  evolutions?: Evolution[];
}
