import styles from "./styles.module.css";
import dayIcon from "../../assets/icons/day.svg";
import tardeIcon from "../../assets/icons/tarde.svg";
import noiteIcon from "../../assets/icons/noite.svg";
import Finalizados from "../../components/finalizados/index";
import ModalAtendimento from "../modalAtendimento/index";

import { useQuery } from "@tanstack/react-query";
import { type Agendamento, getAgendamentos } from "../../axios/axios";

//data e hora formatada
const formatarDataHora = (iso: string) => {
  const data = new Date(iso);
  const dia = data.toLocaleDateString("pt-BR");
  const hora = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { dia, hora };
};

//periodo do dia
const getPeriodoInfo = (iso: string) => {
  const hora = new Date(iso).getHours();

  if (hora >= 6 && hora < 12) {
    return { label: "Manhã", icon: dayIcon };
  } else if (hora >= 12 && hora < 18) {
    return { label: "Tarde", icon: tardeIcon };
  } else {
    return { label: "Noite", icon: noiteIcon };
  }
};

const Index = () => {
  const { data, isLoading, isError } = useQuery<Agendamento[]>({
    queryKey: ["agendamentos"],
    queryFn: getAgendamentos,
  });

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar os agendamentos.</p>;

  return (
    <section className={styles.agendamentosContent}>
      <section className={styles.container}>
        <div className={styles.title}>
          <h2>Agendados</h2>
          <p>Consulte Todos os Pacientes de Agendados</p>
        </div>

        <div className={styles.agendamentos}>
          {data?.map((agendamento) => {
            const { dia, hora } = formatarDataHora(agendamento.dataHora);
            const { label, icon } = getPeriodoInfo(agendamento.dataHora);

            return (
              <div key={agendamento.id} className={styles.agendamentoItem}>
                <div className={styles.agendaTitle}>
                  <h3 className={styles.day}>
                    {label}{" "}
                    <img src={icon} alt={`ícone ${label.toLowerCase()}`} />
                  </h3>
                  <ModalAtendimento agendamentoId={agendamento.id} />
                </div>

                <div className={styles.infoContent}>
                  <p className={styles.infoItem}>
                    Paciente: <span>{agendamento.paciente}</span>
                  </p>
                  <p className={styles.infoItem}>
                    Médico: <span>{agendamento.medico}</span>
                  </p>
                  <p className={styles.infoItem}>
                    Especialidade: <span>{agendamento.especialidadeNome}</span>
                  </p>
                  <p className={styles.infoItem}>
                    Convenio: <span>{agendamento.convenioNome}</span>
                  </p>
                  <p className={styles.infoItem}>
                    Dia: <span>{dia}</span>
                  </p>
                  <p className={styles.infoItem}>
                    Hora: <span>{hora}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Finalizados />
      </section>
    </section>
  );
};

export default Index;
