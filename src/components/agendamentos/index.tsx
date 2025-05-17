import styles from "./styles.module.css";
import dayIcon from "../../assets/icons/day.svg";
import tardeIcon from "../../assets/icons/tarde.svg";
import noiteIcon from "../../assets/icons/noite.svg";
const index = () => {
  return (
    <section className={styles.agendamentosContent}>
      <section className={styles.container}>
        <div className={styles.title}>
          <h2>Agendados</h2>
          <p>Consulte Todos os Pacientes de Hoje</p>
        </div>

        <div className={styles.agendamentos}>
          <div className={styles.agendamentoItem}>
            <h3 className={styles.day}>
              Manha <img src={dayIcon} alt="icone dia" />
            </h3>

            <div className={styles.infoContent}>
              <p className={styles.infoItem}>
                Paciente: <span>Tiago Figueiredo</span>
              </p>
              <p className={styles.infoItem}>
                Medico: <span>Dr. Silva Moraes</span>
              </p>
              <p className={styles.infoItem}>
                Especialidade: <span>Angiovascular</span>
              </p>

              <p className={styles.infoItem}>
                Dia: <span>17/05/2025</span>
              </p>
              <p className={styles.infoItem}>
                Hora: <span>9:00</span>
              </p>
            </div>
          </div>
          <div className={styles.agendamentoItem}>
            <h3 className={styles.day}>
              Tarde <img src={tardeIcon} alt="icone tarde" />
            </h3>

            <div className={styles.infoContent}>
              <p className={styles.infoItem}>
                Paciente: <span>Tiago Figueiredo</span>
              </p>
              <p className={styles.infoItem}>
                Medico: <span>Dr. Silva Moraes</span>
              </p>
              <p className={styles.infoItem}>
                Especialidade: <span>Angiovascular</span>
              </p>

              <p className={styles.infoItem}>
                Dia: <span>17/05/2025</span>
              </p>
              <p className={styles.infoItem}>
                Hora: <span>9:00</span>
              </p>
            </div>
          </div>
          <div className={styles.agendamentoItem}>
            <h3 className={styles.day}>
              Noite <img src={noiteIcon} alt="icone noite" />
            </h3>

            <div className={styles.infoContent}>
              <p className={styles.infoItem}>
                Paciente: <span>Tiago Figueiredo</span>
              </p>
              <p className={styles.infoItem}>
                Medico: <span>Dr. Silva Moraes</span>
              </p>
              <p className={styles.infoItem}>
                Especialidade: <span>Angiovascular</span>
              </p>

              <p className={styles.infoItem}>
                Dia: <span>17/05/2025</span>
              </p>
              <p className={styles.infoItem}>
                Hora: <span>9:00</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default index;
