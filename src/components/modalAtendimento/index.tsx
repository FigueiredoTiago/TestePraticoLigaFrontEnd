import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newAtendimento, type NovoAtendimento, api } from "../../axios/axios";
import { toast } from "react-toastify";
import styles from "./styles.module.css";

interface ModalProps {
  agendamentoId: number;
  paciente: string;
}

const deletarAgendamento = async (id: number) => {
  const response = await api.delete(`/agendamentos/${id}`);
  return response.data;
};

export default function BasicModal({ agendamentoId, paciente }: ModalProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const { register, handleSubmit, reset } = useForm<{ observacoes: string }>();
  const queryClient = useQueryClient();

  // finalizar atendimento e apagar agendamento
  const mutation = useMutation({
    mutationFn: async (dados: NovoAtendimento) => {
      await newAtendimento(dados); // cria atendimento
      await deletarAgendamento(dados.agendamentoId); // deleta agendamento
    },
    onSuccess: () => {
      toast.success("Esse atendimento Foi Finalizado.");

      queryClient.invalidateQueries({ queryKey: ["agendamentos"] });
      queryClient.invalidateQueries({ queryKey: ["atendimentos"] });
      handleClose();
    },
    onError: () => {
      alert("Erro ao finalizar atendimento.");
    },
  });

  const onSubmit = (data: { observacoes: string }) => {
    const now = new Date().toISOString();
    mutation.mutate({
      agendamentoId,
      observacoes: data.observacoes,
      dataAtendimento: now,
      paciente: paciente,
    });
  };

  return (
    <div>
      <Button className={styles.btnModal} onClick={handleOpen}>
        Finalizar?
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={styles.modal}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          className={styles.box}
        >
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Finalizar Atendimento
          </Typography>

          <TextField
            {...register("observacoes")}
            fullWidth
            multiline
            rows={3}
            label="Observações sobre esse atendimento"
            margin="normal"
            placeholder="Digite as observações (opcional)"
            className={styles.text}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={mutation.isPending}
            fullWidth
            sx={{ mt: 2 }}
          >
            {mutation.isPending ? "Finalizando..." : "Confirmar"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
