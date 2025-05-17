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

export {
  getAgendamentos,
  getConvenios,
  getEspecialidades,
  getHorariosDisponiveis,
  agendarConsulta,
};
