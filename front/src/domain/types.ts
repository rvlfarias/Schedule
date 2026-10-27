export type Turno = "manha" | "tarde" | "noite";

export interface Disponibilidaede {
    id: string;
    data: string;
    turno: Turno;
}

export interface Voluntario {
    id: string;
    nome: string;
    disponibilidades: Disponibilidaede[];
}