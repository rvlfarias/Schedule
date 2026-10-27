import { useState, type SubmitEvent } from "react";
import type { Voluntario, Turno } from "../domain/types";
import { getMonthDays, formatDate } from "../utils/dates";

interface AvailabilityFormProps {
  volunteers: Voluntario[];
  month: string;
  onAdd: (
    volunteerId: string,
    date: string,
    shift: Turno
  ) => void;
}

const shifts: { value: Turno; label: string }[] = [
  { value: "manha", label: "Manhã" },
  { value: "tarde", label: "Tarde" },
  { value: "noite", label: "Noite" },
];

export function AvailabilityForm({
  volunteers,
  month,
  onAdd,
}: AvailabilityFormProps) {
  const days = getMonthDays(month);

  const [volunteerId, setVolunteerId] = useState("");
  const [date, setDate] = useState("");
  const [shift, setShift] = useState<Turno>("manha");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!volunteerId || !date || !shift) return;

    onAdd(volunteerId, date, shift);
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      <label htmlFor="availability-volunteer">Voluntário</label>

      <select
        id="availability-volunteer"
        value={volunteerId}
        onChange={(event) => setVolunteerId(event.target.value)}
        required
      >
        <option value="">Selecione uma pessoa</option>

        {volunteers.map((volunteer) => (
          <option key={volunteer.id} value={volunteer.id}>
            {volunteer.nome}
          </option>
        ))}
      </select>

      <label htmlFor="availability-date">Dia do mês</label>

      <select
        id="availability-date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        required
      >
        <option value="">Selecione um dia</option>

        {days.map((day) => (
          <option key={day} value={day}>
            {formatDate(day)}
          </option>
        ))}
      </select>

      <label htmlFor="availability-shift">Turno</label>

      <select
        id="availability-shift"
        value={shift}
        onChange={(event) => setShift(event.target.value as Turno)}
      >
        {shifts.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      <button type="submit" disabled={volunteers.length === 0}>
        Registrar disponibilidade
      </button>
    </form>
  );
}