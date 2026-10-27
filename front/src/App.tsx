import { useState } from "react";
import type { Turno, Voluntario } from "./domain/types";
import { getCurrentMonth, getMonthDays, formatDate } from "./utils/dates";
import { VolunteerForm } from "./components/VolunteerForm";
import { AvailabilityForm } from "./components/AvailabilityForm";
import "./App.css";

const shifts: { value: Turno; label: string }[] = [
  { value: "manha", label: "Manhã" },
  { value: "tarde", label: "Tarde" },
  { value: "noite", label: "Noite" },
];

function App() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [volunteers, setVolunteers] = useState<Voluntario[]>([]);
  const [message, setMessage] = useState("");

  function addVolunteer(name: string) {
    const volunteer: Voluntario = {
      id: crypto.randomUUID(),
      nome: name,
      disponibilidades: [],
    };

    setVolunteers((current) => [...current, volunteer]);
    setMessage(`${name} foi cadastrado.`);
  }

  function addAvailability(
    volunteerId: string,
    date: string,
    shift: Turno
  ) {
    if (!date.startsWith(`${month}-`)) {
      setMessage("A data precisa pertencer ao mês selecionado.");
      return;
    }

    const volunteer = volunteers.find(
      (item) => item.id === volunteerId
    );

    if (!volunteer) {
      setMessage("Voluntário não encontrado.");
      return;
    }

    const alreadyExists = volunteer.disponibilidades.some(
      (item) => item.data === date && item.turno === shift
    );

    if (alreadyExists) {
      setMessage("Essa disponibilidade já foi cadastrada.");
      return;
    }

    setVolunteers((current) =>
      current.map((item) =>
        item.id === volunteerId
          ? {
              ...item,
              disponibilidades: [
                ...item.disponibilidades,
                {
                  id: crypto.randomUUID(),
                  data: date,
                  turno: shift,
                },
              ],
            }
          : item
      )
    );

    setMessage(
      `Disponibilidade de ${volunteer.nome} registrada para ${formatDate(date)}.`
    );
  }

  function removeAvailability(
    volunteerId: string,
    availabilityId: string
  ) {
    setVolunteers((current) =>
      current.map((volunteer) =>
        volunteer.id === volunteerId
          ? {
              ...volunteer,
              disponibilidades: volunteer.disponibilidades.filter(
                (item) => item.id !== availabilityId
              ),
            }
          : volunteer
      )
    );

    setMessage("Disponibilidade removida.");
  }

  function removeVolunteer(volunteerId: string) {
    setVolunteers((current) =>
      current.filter((item) => item.id !== volunteerId)
    );

    setMessage("Voluntário removido.");
  }

  const days = getMonthDays(month);

  const monthLabel = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T12:00:00Z`));

const totalAvailabilities = volunteers.reduce(
  (total, volunteer) =>
    total +
    volunteer.disponibilidades.filter(
      (item) => item.data.startsWith(`${month}-`)
    ).length,
  0
);

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Escala — início">
          <span className="brand-mark">E</span>
          <span>escala<span className="brand-dot">.</span></span>
        </a>

        <span className="local-badge">
          <span className="status-dot" />
          Modo local
        </span>
      </header>

      <section className="page-heading">
        <div>
          <p className="eyebrow">GERENCIAMENTO DE VOLUNTÁRIOS</p>
          <h1>Organize sua escala.</h1>
          <p className="subtitle">
            Cadastre pessoas, registre disponibilidades e prepare
            a distribuição mensal.
          </p>
        </div>

        <label className="month-picker">
          <span>Mês da escala</span>
          <input
            type="month"
            value={month}
            onChange={(event) => {
              setMonth(event.target.value);
              setMessage("");
            }}
          />
        </label>
      </section>

      <section className="stats-grid" aria-label="Resumo">
        <article className="stat-card">
          <span className="stat-label">Voluntários</span>
          <strong>{volunteers.length}</strong>
          <span className="stat-detail">Pessoas cadastradas</span>
        </article>

        <article className="stat-card">
          <span className="stat-label">Disponibilidades</span>
          <strong>{totalAvailabilities}</strong>
          <span className="stat-detail">Registros no período</span>
        </article>

        <article className="stat-card">
          <span className="stat-label">Período selecionado</span>
          <strong className="stat-month">{monthLabel}</strong>
          <span className="stat-detail">Escala mensal</span>
        </article>
      </section>

      {message && (
        <div className="feedback" role="status">
          <span>{message}</span>
          <button
            className="feedback-close"
            onClick={() => setMessage("")}
            aria-label="Fechar mensagem"
          >
            ×
          </button>
        </div>
      )}

      <section className="workspace">
        <div className="forms-column">
          <article className="panel">
            <div className="panel-heading">
              <span className="step-number">01</span>
              <div>
                <h2>Voluntários</h2>
                <p>Quem participará da escala?</p>
              </div>
            </div>

            <VolunteerForm onAdd={addVolunteer} />

            <div className="volunteer-list">
              {volunteers.length === 0 ? (
                <p className="empty-note">
                  Seus voluntários aparecerão aqui.
                </p>
              ) : (
                volunteers.map((volunteer) => (
                  <div className="volunteer-row" key={volunteer.id}>
                    <span className="avatar">
                      {volunteer.nome.trim().charAt(0).toUpperCase()}
                    </span>

                    <span className="volunteer-name">
                      {volunteer.nome}
                    </span>

                    <button
                      className="icon-button"
                      onClick={() => removeVolunteer(volunteer.id)}
                      aria-label={`Remover ${volunteer.nome}`}
                      title="Remover voluntário"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <span className="step-number">02</span>
              <div>
                <h2>Disponibilidades</h2>
                <p>Quando cada pessoa pode participar?</p>
              </div>
            </div>

            <AvailabilityForm
              key={month}
              volunteers={volunteers}
              month={month}
              onAdd={addAvailability}
            />
          </article>
        </div>

        <article className="panel calendar-panel">
          <div className="panel-heading calendar-heading">
            <div>
              <p className="eyebrow">VISÃO GERAL</p>
              <h2>Disponibilidade mensal</h2>
              <p>
                {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
              </p>
            </div>

            <span className="calendar-count">
              {days.length} dias
            </span>
          </div>

          <div className="legend">
            {shifts.map((shift) => (
              <span key={shift.value} className={`legend-item ${shift.value}`}>
                <span className="legend-dot" />
                {shift.label}
              </span>
            ))}
          </div>

          <div className="calendar-list">
            {days.map((day) => {
              const dayEntries = volunteers.flatMap((volunteer) =>
                volunteer.disponibilidades
                  .filter((item) => item.data === day)
                  .map((item) => ({
                    ...item,
                    volunteerName: volunteer.nome,
                    volunteerId: volunteer.id,
                  }))
              );

              return (
                <section className="day-row" key={day}>
                  <div className="day-label">
                    <strong>{formatDate(day)}</strong>
                    <span>
                      {new Intl.DateTimeFormat("pt-BR", {
                        weekday: "short",
                        timeZone: "UTC",
                      })
                        .format(new Date(`${day}T12:00:00Z`))
                        .replace(".", "")}
                    </span>
                  </div>

                  <div className="day-entries">
                    {dayEntries.length === 0 ? (
                      <span className="no-availability">
                        Sem disponibilidades
                      </span>
                    ) : (
                      dayEntries.map((entry) => (
                        <div
                          className={`availability-chip ${entry.turno}`}
                          key={entry.id}
                        >
                          <span>
                            {shifts.find(
                              (item) => item.value === entry.turno
                            )?.label}
                            {" · "}
                            {entry.volunteerName}
                          </span>

                          <button
                            onClick={() =>
                              removeAvailability(
                                entry.volunteerId,
                                entry.id
                              )
                            }
                            aria-label={`Remover disponibilidade de ${entry.volunteerName}`}
                            title="Remover disponibilidade"
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </article>
      </section>

      <footer className="app-footer">
        <span>Escala · Projeto de estudo</span>
        <span>Os dados existem somente nesta sessão.</span>
      </footer>
    </main>
  );
}

export default App;