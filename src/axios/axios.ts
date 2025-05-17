import axios from "axios";

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

//exibe os agendamentos

const getAgendamentos = async (): Promise<Agendamento[]> => {
  const response = await axios.get("http://localhost:3000/agendamentos");
  return response.data;
};

export { getAgendamentos };
