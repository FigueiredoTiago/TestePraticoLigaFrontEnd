import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEspecialidades,
  getConvenios,
  agendarConsulta,
} from "../../axios/axios";

import styles from "./styles.module.css";

const Index = () => {
  const [especialidadeId, setEspecialidadeId] = useState<number | "">("");
  const [convenioId, setConvenioId] = useState<number | "">("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [medico, setMedico] = useState("");
  const [paciente, setPaciente] = useState("");
  const queryClient = useQueryClient();

  const { data: especialidades } = useQuery({
    queryKey: ["especialidades"],
    queryFn: getEspecialidades,
  });

  const { data: convenios } = useQuery({
    queryKey: ["convenios"],
    queryFn: getConvenios,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: agendarConsulta,
    onSuccess: () => {
      alert("Consulta agendada com sucesso!");
      setEspecialidadeId("");
      setConvenioId("");
      setDataSelecionada("");
      setHorarioSelecionado("");
      setMedico("");
      setPaciente("");
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] });
    },
    onError: () => {
      alert("Erro ao agendar consulta. Tente novamente.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const especialidadeNumId = Number(especialidadeId);
    const convenioNumId = Number(convenioId);

    if (
      !especialidadeId ||
      !convenioId ||
      !dataSelecionada ||
      !horarioSelecionado ||
      !paciente
    ) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const especialidadeSelecionada = especialidades?.find(
      (esp) => esp.id === especialidadeNumId
    );
    const convenioSelecionado = convenios?.find(
      (conv) => conv.id === convenioNumId
    );

    if (!especialidadeSelecionada || !convenioSelecionado) {
      alert("Especialidade ou Convênio inválido.");
      return;
    }

    const dataHora = `${dataSelecionada}T${horarioSelecionado}:00Z`;

    mutate({
      paciente,
      especialidadeId: especialidadeNumId,
      especialidadeNome: especialidadeSelecionada.nome,
      convenioId: convenioNumId,
      convenioNome: convenioSelecionado.nome,
      dataHora,
      medico,
    });
  };

  return (
    <div className={styles.sideBar}>
      <div className={styles.title}>
        <h2>Agendar um Atendimento</h2>
        <p>Preencha os dados abaixo para criar um novo agendamento.</p>
      </div>

      <form className={styles.formContent} onSubmit={handleSubmit}>
        {/* Especialidade */}
        <label>
          Especialidade:
          <select
            value={especialidadeId}
            onChange={(e) =>
              setEspecialidadeId(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">Selecione</option>
            {especialidades?.map((esp) => (
              <option key={esp.id} value={esp.id}>
                {esp.nome}
              </option>
            ))}
          </select>
        </label>

        {/* Convênio */}
        <label>
          Convênio:
          <select
            value={convenioId}
            onChange={(e) =>
              setConvenioId(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">Selecione</option>
            {convenios?.map((conv) => (
              <option key={conv.id} value={conv.id}>
                {conv.nome}
              </option>
            ))}
          </select>
        </label>

        {/* Data */}
        <label>
          Data:
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
          />
        </label>

        {/* Hora */}
        <label>
          Hora:
          <input
            type="time"
            value={horarioSelecionado}
            onChange={(e) => setHorarioSelecionado(e.target.value)}
          />
        </label>

        {/* Médico (opcional) */}
        <label>
          Médico (opcional):
          <input
            type="text"
            value={medico}
            onChange={(e) => setMedico(e.target.value)}
            placeholder="Nome do médico"
          />
        </label>

        {/* Nome do paciente */}
        <label>
          Nome do paciente:
          <input
            type="text"
            value={paciente}
            onChange={(e) => setPaciente(e.target.value)}
            placeholder="Digite o nome"
          />
        </label>

        {/* Botão Agendar */}
        <button className={styles.submitBtn} type="submit" disabled={isPending}>
          {isPending ? "Agendando..." : "Agendar"}
        </button>
      </form>
    </div>
  );
};

export default Index;
