import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // Altere para a URL correta da sua API
});

export type Agendamento = {
  id: number;
  paciente: string;
  especialidadeId: number;
  especialidadeNome: string;
  convenioId: number;
  convenioNome: string;
  dataHora: string;
  medico: string;
};

export type FiltrosAgendamento = {
  dataInicio?: string; // Formato AAAA-MM-DD
  dataFim?: string; // Formato AAAA-MM-DD
  paciente?: string;
  // Você pode adicionar outros filtros aqui
};

export interface Especialidade {
  id: number;
  nome: string;
}

export interface Convenio {
  id: number;
  nome: string;
}

export interface HorarioDisponibilidade {
  horaInicio: string;
  horaFim: string;
  disponivel: boolean;
  agendamentoId?: number;
  paciente?: string;
}

export interface NovoAgendamento {
  paciente: string;
  especialidadeId?: number;
  especialidadeNome?: string;
  convenioId?: number;
  convenioNome?: string;
  dataHora: string;
  medico?: string;
}

export type Atendimento = {
  id: string;
  agendamentoId: number;
  dataAtendimento: string; // ou Date, se for convertido
  observacoes: string;
  paciente: string;
};

export interface NovoAtendimento {
  agendamentoId: number;
  dataAtendimento: string;
  observacoes?: string;
  paciente: string;
}

//exibe os agendamentos
const getAgendamentos = async (): Promise<Agendamento[]> => {
  const response = await api.get("http://localhost:3000/agendamentos");
  return response.data;
};

// Buscar especialidades
const getEspecialidades = async (): Promise<Especialidade[]> => {
  const response = await api.get<Especialidade[]>("/especialidades");
  return response.data;
};

//Buscar convênios
const getConvenios = async (): Promise<Convenio[]> => {
  const response = await api.get<Convenio[]>("/convenios");
  return response.data;
};

//Buscar horários disponíveis
const getHorariosDisponiveis = async () => {
  const response = await api.post(`/disponibilidades`);
  return response.data;
};

//agendar consulta
const agendarConsulta = async (dados: NovoAgendamento) => {
  const response = await api.post(`/agendamentos`, dados);
  return response.data;
};

//deletar consulta
const deletarAgendamento = async (id: number) => {
  const response = await api.delete(`/agendamentos/${id}`);
  return response.data;
};

const getAtendimentos = async () => {
  try {
    const response = await api.get<Atendimento[]>("/atendimentos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar atendimentos:", error);
    throw error;
  }
};

const newAtendimento = async (dados: NovoAtendimento) => {
  const response = await api.post("/atendimentos", dados);
  return response.data;
};

const filtrarAtendimentos = async (filtros: {
  dataInicio?: string; // formato esperado: '2025-05-01'
  dataFim?: string; // formato esperado: '2025-05-31'
  paciente?: string;
}): Promise<Atendimento[]> => {
  const params = new URLSearchParams();

  const formatISO = (data: string, hora: string) => {
    const isoString = new Date(`${data}T${hora}.000Z`).toISOString();
    return isoString;
  };

  if (filtros.dataInicio) {
    const inicioISO = formatISO(filtros.dataInicio, "00:00:00");
    params.append("dataAtendimento_gte", inicioISO);
  }

  if (filtros.dataFim) {
    const fimISO = formatISO(filtros.dataFim, "23:59:59");
    params.append("dataAtendimento_lte", fimISO);
  }

  if (filtros.paciente) {
    params.append("paciente_like", filtros.paciente);
  }

  const response = await axios.get<Atendimento[]>("/atendimentos", { params });
  return response.data;
};

export {
  getAgendamentos,
  getConvenios,
  getEspecialidades,
  getHorariosDisponiveis,
  agendarConsulta,
  getAtendimentos,
  newAtendimento,
  deletarAgendamento,
  filtrarAtendimentos,
};
