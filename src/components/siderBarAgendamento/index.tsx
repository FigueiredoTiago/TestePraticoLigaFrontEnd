import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEspecialidades,
  getConvenios,
  agendarConsulta,
} from "../../axios/axios";
import { toast } from "react-toastify";
import logoLiga from "../../assets/logo_cor.png";

import styles from "./styles.module.css";
import { useForm } from "react-hook-form";

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
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log(data);

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

        {/* Data */}
        <label>
          Data:
          <input
            type="date"
            {...register("dataSelecionada", { required: true })}
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
          />
          {errors.horarioSelecionado && (
            <span className={styles.errorMessage}>Campo obrigatório</span>
          )}
        </label>

        {/* Médico (opcional) */}
        <label>
          Médico (opcional):
          <input
            type="text"
            {...register("medico")}
            placeholder="Nome do médico"
          />
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
