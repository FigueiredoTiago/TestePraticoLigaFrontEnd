import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { filtrarAtendimentos, type Atendimento } from "../../axios/axios";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import styles from "./styles.module.css";

type FiltrosAtendimento = {
  data: Dayjs | null;
  paciente: string;
};

export default function FiltroAtendimentosModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { register, handleSubmit, control, reset} =
    useForm<FiltrosAtendimento>({
      defaultValues: {
        data: null,
        paciente: "",
      },
    });

  const [filtrosAtivos, setFiltrosAtivos] = React.useState<{
    data?: string;
    paciente?: string;
  }>({});

  const {
    data: atendimentos = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Atendimento[]>({
    queryKey: ["atendimentosFiltrados", filtrosAtivos],
    queryFn: async () => {
      try {
        const response = await filtrarAtendimentos(filtrosAtivos);
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error("Erro ao buscar atendimentos:", error);
        return [];
      }
    },
    enabled: false, // ativar manualmente
  });

  const onSubmit = (data: FiltrosAtendimento) => {
    const filtros: typeof filtrosAtivos = {};

    if (data.paciente.trim()) filtros.paciente = data.paciente.trim();
    if (data.data) filtros.data = data.data.format("YYYY-MM-DD");

    setFiltrosAtivos(filtros);

    if (Object.keys(filtros).length > 0) {
      refetch();
    }
  };

  const limparFiltros = () => {
    reset();
    setFiltrosAtivos({});
  };

  return (
    <div>
      <button onClick={handleOpen} className={styles.btnModal}>
        Filtrar
      </button>
      <Modal
        className={styles.modal}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.modalBox}>
          <Box>
            <Typography variant="h4" component="h2" mb={3}>
              Filtrar Atendimentos
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Stack spacing={3}>
                  <Controller
                    name="data"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Data"
                        value={field.value}
                        onChange={field.onChange}
                        slotProps={{ textField: { fullWidth: true } }}
                        className={styles.date}
                      />
                    )}
                  />
                  <TextField
                    label="Nome do Paciente"
                    {...register("paciente")}
                    fullWidth
                    className={styles.date}
                  />
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <button
                      onClick={limparFiltros}
                      className={styles.btnModalForm}
                    >
                      Limpar
                    </button>

                    <button type="submit" className={styles.btnModalForm}>
                      Aplicar Filtros
                    </button>
                  </Stack>
                </Stack>
              </LocalizationProvider>
            </form>
            <Box mt={3}>
              {isLoading ? (
                <CircularProgress />
              ) : isError ? (
                <Typography color="error">
                  Ocorreu um erro ao buscar os atendimentos
                </Typography>
              ) : (
                <>
                  <p className={styles.info}>
                    Resultados encontrados: {atendimentos.length}
                  </p>
                  {atendimentos.length > 0 ? (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {atendimentos.map((atendimento) => (
                        <li
                          key={atendimento.id}
                          style={{
                            marginBottom: "16px",
                            padding: "12px",
                            border: "1px solid #eee",
                            borderRadius: "4px",
                          }}
                        >
                          <Typography variant="subtitle2">
                            Paciente: {atendimento.paciente}
                          </Typography>
                          <Typography>
                            Data:{" "}
                            {dayjs(atendimento.dataAtendimento).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </Typography>
                          <Typography>
                            Observações: {atendimento.observacoes}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.info}>
                      Nenhum atendimento encontrado com os filtros aplicados
                    </p>
                  )}
                </>
              )}
            </Box>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
