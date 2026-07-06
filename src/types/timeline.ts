export interface TimelineItem {
  tipo: "VITAL_SIGN" | "EVOLUTION" | "APPOINTMENT";
  data: string;
  descricao: string;
}