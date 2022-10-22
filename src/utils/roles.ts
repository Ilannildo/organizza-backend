export function validateCpf(cpf: string) {
  let Soma;
  let Resto;
  Soma = 0;

  if (cpf === '00000000000') {
    return false;
  }

  for (let i = 1; i <= 9; i++) {
    Soma += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
  }

  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) {
    Resto = 0;
  }

  if (Resto !== parseInt(cpf.substring(9, 10), 10)) {
    return false;
  }

  Soma = 0;
  for (let i = 1; i <= 10; i++) {
    Soma += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
  }

  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) {
    Resto = 0;
  }
  if (Resto !== parseInt(cpf.substring(10, 11), 10)) {
    return false;
  }
  return true;
}

export enum UserRoles {
  /**
   * AUTH codes
   */
  // Thrown if there is no user corresponding to the given param (username, userId, email)
  ADMIN = 0,
  PROFESSIONAL = 1,
  CUSTOMER = 2,
}