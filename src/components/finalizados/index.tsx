import styles from "./styles.module.css";
import { getAtendimentos, type Atendimento } from "../../axios/axios";
import { useQuery } from "@tanstack/react-query";
const index = () => {
  const { data, isLoading, isError } = useQuery<Atendimento[]>({
    queryKey: ["atendimentos"],
    queryFn: getAtendimentos,
  });

  console.log(data);

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar os agendamentos.</p>;

  return (
    <section className={styles.sectionFinalizados}>
      <h2>Ultimos Atendimentos Finalizados:</h2>

      {data?.length === 0 ? (
        <p>Nenhum atendimento encontrado.</p>
      ) : (
        <ul>
          {data?.map((atendimento) => (
            <li key={atendimento.id} className={styles.cardAtendimento}>
              <p>
                <strong>ID do Agendamento:</strong> {atendimento.agendamentoId}
              </p>
              <p>
                <strong>Data:</strong>{" "}
                {new Date(atendimento.dataAtendimento).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
              <p>
                <strong>Observações:</strong> {atendimento.observacoes}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default index;
