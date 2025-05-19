import styles from "./styles.module.css";
import { getAtendimentos, type Atendimento } from "../../axios/axios";
import { useQuery } from "@tanstack/react-query";
import Filtrar from '../modalFiltrarPorData/index';

const index = () => {
  const { data, isLoading, isError } = useQuery<Atendimento[]>({
    queryKey: ["atendimentos"],
    queryFn: getAtendimentos,
  });

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar os agendamentos.</p>;

  return (
    <section className={styles.sectionFinalizados}>
      <h2>Ultimos Atendimentos Finalizados <Filtrar/> </h2>

      {data?.length === 0 ? (
        <p className={styles.alert}>Nenhum atendimento Foi Finalizado ainda.</p>
      ) : (
        <ul>
          {data?.map((atendimento) => (
            <li key={atendimento.id} className={styles.cardAtendimento}>
              <p>
                <strong>ID do Agendamento:</strong> {atendimento.id}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(atendimento.dataAtendimento).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
              <p>
                <strong>Paciente: </strong>
                {atendimento.paciente}
              </p>
              <p>
                <strong>Observações: </strong> {atendimento.observacoes}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default index;
