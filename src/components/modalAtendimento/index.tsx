import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newAtendimento, type NovoAtendimento, api } from "../../axios/axios"; // api axios para delete
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

interface ModalProps {
  agendamentoId: number;
}

const deletarAgendamento = async (id: number) => {
  const response = await api.delete(`/agendamentos/${id}`);
  return response.data;
};

export default function BasicModal({ agendamentoId }: ModalProps) {
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
      // Remove o agendamento da lista localmente para atualização em tempo real
      toast.success("Esse atendimento Foi Finalizado.");

      queryClient.invalidateQueries({ queryKey: ["agendamentos"] });
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
    });
  };

  return (
    <div>
      <Button onClick={handleOpen}>Finalizar?</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Finalizar Atendimento
          </Typography>

          <TextField
            {...register("observacoes")}
            fullWidth
            multiline
            rows={3}
            label="Observações"
            margin="normal"
            placeholder="Digite as observações (opcional)"
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
