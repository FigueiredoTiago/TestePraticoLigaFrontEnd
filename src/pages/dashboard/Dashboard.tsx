import styles from "./styles.module.css";
import SideBarAgendamento from '../../components/siderBarAgendamento/index';

const Dashboard = () => {
  return (

    <section className={styles.dashboard}>

      <SideBarAgendamento/>

    </section>

  );
};

export default Dashboard;
