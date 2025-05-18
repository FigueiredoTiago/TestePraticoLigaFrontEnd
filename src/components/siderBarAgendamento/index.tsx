import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEspecialidades,
  getConvenios,
  agendarConsulta,
  getHorariosDisponiveis,
} from "../../axios/axios";
import { toast } from "react-toastify";
import logoLiga from "../../assets/logo_cor.png";

import styles from "./styles.module.css";
import { useForm, useWatch } from "react-hook-form";
import { useMemo } from "react";

const Index = () => {
  const queryClient = useQueryClient();

  const { data: especialidades } = useQuery({
    queryKey: ["especialidades"],
    queryFn: getEspecialidades,
  });

  const { data: convenios } = useQuery({
    queryKey: ["convenios"],
    queryFn: getConvenios,
  });

  const { data: disponibilidades } = useQuery({
    queryKey: ["disponibilidades"],
    queryFn: getHorariosDisponiveis,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: agendarConsulta,
    onSuccess: () => {
      toast.success("Consulta agendada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["agendamentos"] });
    },
    onError: () => {
      toast.error("Erro ao agendar consulta. Tente novamente.");
    },
  });

  type FormValues = {
    especialidadeNome: string;
    convenioNome: string;
    dataSelecionada: string;
    horarioSelecionado: string;
    medico?: string;
    paciente: string;
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  // Monitora especialidade e médico selecionado
  const especialidadeSelecionada = useWatch({
    control,
    name: "especialidadeNome",
  });
  const medicoSelecionado = useWatch({ control, name: "medico" });

  // Descobre o ID da especialidade pelo nome
  const especialidadeIdSelecionado = useMemo(() => {
    const encontrada = especialidades?.find(
      (esp) => esp.nome === especialidadeSelecionada
    );
    return encontrada?.id ? parseInt(encontrada.id) : null;
  }, [especialidades, especialidadeSelecionada]);

  // Filtra médicos com base na especialidade
  // Defina o tipo para os itens de disponibilidade
  type Disponibilidade = {
    especialidadeId: number;
    medico: string;
    horaInicio: string;
    horaFim: string;
    // adicione outros campos se necessário
  };

  const medicosDisponiveis = useMemo(() => {
    if (!disponibilidades || !especialidadeIdSelecionado) return [];
    const nomesUnicos = new Set<string>();
    return (disponibilidades as Disponibilidade[])
      .filter(
        (d: Disponibilidade) => d.especialidadeId === especialidadeIdSelecionado
      )
      .filter((d: Disponibilidade) => {
        if (!nomesUnicos.has(d.medico)) {
          nomesUnicos.add(d.medico);
          return true;
        }
        return false;
      })
      .map((d: Disponibilidade) => d.medico);
  }, [disponibilidades, especialidadeIdSelecionado]);

  // Obtém os horários do médico selecionado
  const horariosDoMedico = useMemo(() => {
    if (!disponibilidades || !medicoSelecionado) return null;
    return disponibilidades.find(
      (d) =>
        d.medico === medicoSelecionado &&
        d.especialidadeId === especialidadeIdSelecionado
    );
  }, [disponibilidades, medicoSelecionado, especialidadeIdSelecionado]);

  const onSubmit = (data: FormValues) => {
    const dataHora = `${data.dataSelecionada}T${data.horarioSelecionado}:00Z`;

    const values = {
      convenioNome: data.convenioNome,
      especialidadeNome: data.especialidadeNome,
      medico: data.medico,
      paciente: data.paciente,
      dataHora,
    };

    mutate(values);
  };

  return (
    <div className={styles.sideBar}>
      <div className={styles.title}>
        <img src={logoLiga} alt="Logo LigaRN" />
        <h2>Agendar um Atendimento</h2>
        <p>Preencha os dados abaixo para criar um novo agendamento.</p>
      </div>

      <form className={styles.formContent} onSubmit={handleSubmit(onSubmit)}>
        {/* Especialidade */}
        <label>
          Especialidade:
          <select {...register("especialidadeNome", { required: true })}>
            <option value="">Selecione</option>
            {especialidades?.map((esp) => (
              <option key={esp.id} value={esp.nome}>
                {esp.nome}
              </option>
            ))}
          </select>
          {errors.especialidadeNome && (
            <span className={styles.errorMessage}>Campo obrigatório</span>
          )}
        </label>

        {/* Convênio */}
        <label>
          Convênio:
          <select {...register("convenioNome", { required: true })}>
            <option value="">Selecione</option>
            {convenios?.map((conv) => (
              <option key={conv.id} value={conv.nome}>
                {conv.nome}
              </option>
            ))}
          </select>
          {errors.convenioNome && (
            <span className={styles.errorMessage}>Campo obrigatório</span>
          )}
        </label>

        {/* Médico */}
        {medicosDisponiveis.length > 0 && (
          <label>
            Médico:
            <select {...register("medico", { required: true })}>
              <option value="">Selecione</option>
              {medicosDisponiveis.map((medico) => (
                <option key={medico} value={medico}>
                  {medico}
                </option>
              ))}
            </select>
            {errors.medico && (
              <span className={styles.errorMessage}>Campo obrigatório</span>
            )}
          </label>
        )}

        {/* Data */}
        <label>
          Data:
          <input
            type="date"
            {...register("dataSelecionada", { required: true })}
            disabled={!horariosDoMedico}
          />
          {errors.dataSelecionada && (
            <span className={styles.errorMessage}>Campo obrigatório</span>
          )}
        </label>

        {/* Hora */}
        <label>
          Hora:
          <input
            type="time"
            {...register("horarioSelecionado", { required: true })}
            disabled={!horariosDoMedico}
            min={horariosDoMedico?.horaInicio}
            max={horariosDoMedico?.horaFim}
          />
          {errors.horarioSelecionado && (
            <span className={styles.errorMessage}>Campo obrigatório</span>
          )}
        </label>

        {/* Nome do paciente */}
        <label>
          Nome do paciente:
          <input
            type="text"
            {...register("paciente", { required: true })}
            placeholder="Digite o nome"
          />
          {errors.paciente && (
            <span className={styles.errorMessage}>Campo obrigatório</span>
          )}
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
