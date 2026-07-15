import { cargos } from "../constants/cargos";

export function getCargoLabel(cargo: string) {
  return (
    cargos.find((item) => item.value === cargo)?.label ??
    cargo
  );
}