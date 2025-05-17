import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newAtendimento, type NovoAtendimento } from "../../axios/axios";

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

export default function BasicModal({ agendamentoId }: ModalProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const { register, handleSubmit, reset } = useForm<{ observacoes: string }>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (dados: NovoAtendimento) => newAtendimento(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["atendimentos"] });
      handleClose();
    },
  });

  const onSubmit = (data: { observacoes: string }) => {
    const now = new Date().toISOString(); // Data atual em formato ISO
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
