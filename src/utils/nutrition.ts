/**
 * Retorna a classificação do IMC com base no valor numérico.
 * @param imc Valor numérico do IMC
 * @param isElderly Se true, utiliza a tabela da OPAS/SABER para idosos (padrão em LPIEs)
 */
export function getImcClassification(imc: number | null | undefined, isElderly = true): string {
  if (imc === null || imc === undefined || isNaN(imc)) {
    return "N/I";
  }

  // Tabela específica para Idosos (OPAS / Projeto SABE) - Padrão em Geriatria
  if (isElderly) {
    if (imc < 22.0) return "Baixo peso";
    if (imc <= 27.0) return "Adequado / Eutrófico";
    return "Sobrepeso";
  }

  // Tabela Padrão OMS (Adultos)
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 25.0) return "Peso normal";
  if (imc < 30.0) return "Sobrepeso";
  if (imc < 35.0) return "Obesidade Grau I";
  if (imc < 40.0) return "Obesidade Grau II";
  return "Obesidade Grau III";
}