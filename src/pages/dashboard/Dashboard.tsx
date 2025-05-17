import styles from "./styles.module.css";
import SideBarAgendamento from "../../components/siderBarAgendamento/index";
import Agendamentos from "../../components/agendamentos/index";
const Dashboard = () => {
  return (
    <section className={styles.dashboard}>
      <SideBarAgendamento />
      <Agendamentos />
      
    </section>
  );
};

export default Dashboard;
