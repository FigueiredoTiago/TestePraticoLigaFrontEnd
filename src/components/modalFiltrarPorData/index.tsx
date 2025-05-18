import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
  dataInicio: Dayjs | null;
  dataFim: Dayjs | null;
  paciente: string;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function FiltroAtendimentosModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { register, handleSubmit, control, reset } =
    useForm<FiltrosAtendimento>({
      defaultValues: {
        dataInicio: null,
        dataFim: null,
        paciente: "",
      },
    });

  const [filtrosAtivos, setFiltrosAtivos] = React.useState<{
    dataInicio?: string;
    dataFim?: string;
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
        // Garante que sempre retorne um array
        return Array.isArray(response) ? response : [];
      } catch (error) {
        console.error("Erro ao buscar atendimentos:", error);
        return [];
      }
    },
    enabled: false,
  });

  const onSubmit = (data: FiltrosAtendimento) => {
    const filtros = {
      dataInicio: data.dataInicio?.toISOString(),
      dataFim: data.dataFim?.toISOString(),
      paciente: data.paciente || undefined,
    };

    console.log(atendimentos);

    setFiltrosAtivos(filtros);
    refetch();
  };

  const limparFiltros = () => {
    reset();
    setFiltrosAtivos({});
    refetch();
  };

  const atendimentosArray = Array.isArray(atendimentos) ? atendimentos : [];

  return (
    <div>
      <button onClick={handleOpen} className={styles.btnModal}>
        Filtrar
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" mb={3}>
            Filtrar Atendimentos
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack spacing={3}>
                <Controller
                  name="dataInicio"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Data Início"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  )}
                />

                <Controller
                  name="dataFim"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Data Fim"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  )}
                />

                <TextField
                  label="Nome do Paciente"
                  {...register("paciente")}
                  fullWidth
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={limparFiltros}
                  >
                    Limpar
                  </Button>
                  <Button type="submit" variant="contained">
                    Aplicar Filtros
                  </Button>
                </Stack>
              </Stack>
            </LocalizationProvider>
          </form>

          <Box mt={4}>
            {isLoading ? (
              <CircularProgress />
            ) : isError ? (
              <Typography color="error">
                Ocorreu um erro ao buscar os atendimentos
              </Typography>
            ) : (
              <>
                <Typography variant="subtitle1" mb={2}>
                  Resultados encontrados: {atendimentosArray.length}
                </Typography>

                {atendimentosArray.length > 0 ? (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {atendimentosArray.map((atendimento) => (
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
                  <Typography>
                    Nenhum atendimento encontrado com os filtros aplicados
                  </Typography>
                )}
              </>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
