import { useState, type SubmitEvent } from "react";

interface VolunteerFormProps {
  onAdd: (name: string) => void;
}

export function VolunteerForm({ onAdd }: VolunteerFormProps) {
  const [nome, setNome] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nomeLimpo = nome.trim();

    if (!nomeLimpo) return;

    onAdd(nomeLimpo);
    setNome("");
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <label htmlFor="volunteer-name">Nome do voluntário</label>

      <input
        id="volunteer-name"
        value={nome}
        onChange={(event) => setNome(event.target.value)}
        placeholder="Ex.: Ana Silva"
        maxLength={100}
        required
      />

      <button type="submit">Adicionar voluntário</button>
    </form>
  );
}