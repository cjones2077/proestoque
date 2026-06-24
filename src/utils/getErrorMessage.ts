// src/utils/getErrorMessage.ts
// Extrai mensagens de erro amigáveis de erros Axios provenientes da API.

import { AxiosError } from 'axios';

interface ApiErrorResponse {
  status: string;
  message: string;
  erros?: Array<{ campo: string; mensagem: string }>;
}

/**
 * Extrai uma mensagem de erro amigável a partir de um erro Axios.
 *
 * Cobre os seguintes cenários:
 * - AppError do backend (ex.: 409 "Este e-mail já está em uso.", 401 "E-mail ou senha inválidos.")
 * - Erros de validação Zod (422 com lista de erros por campo)
 * - Erros de rede / servidor indisponível
 * - Timeout da requisição
 * - Qualquer outro erro inesperado
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    // A API retornou uma resposta com corpo JSON
    if (data?.message) {
      // Se houver erros de validação, concatena as mensagens
      if (data.erros && data.erros.length > 0) {
        return data.erros.map((e) => e.mensagem).join('\n');
      }
      return data.message;
    }

    // Mapeia status HTTP conhecidos que podem não ter corpo JSON
    const status = error.response?.status;
    if (status) {
      const mensagensPorStatus: Record<number, string> = {
        400: 'Requisição inválida. Verifique os dados enviados.',
        401: 'E-mail ou senha inválidos.',
        403: 'Você não tem permissão para realizar esta ação.',
        404: 'Recurso não encontrado.',
        409: 'Este registro já existe.',
        422: 'Dados inválidos. Verifique os campos preenchidos.',
        429: 'Muitas tentativas. Aguarde alguns instantes e tente novamente.',
        500: 'Erro interno do servidor. Tente novamente mais tarde.',
      };
      return mensagensPorStatus[status] || `Erro do servidor (código ${status}).`;
    }

    // Erro de rede (sem resposta do servidor)
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return 'Sem conexão com o servidor. Verifique sua internet e tente novamente.';
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      return 'A requisição demorou demais. Verifique sua conexão e tente novamente.';
    }
  }

  // Erro genérico
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
}

/**
 * Extrai erros de validação por campo (quando a API retorna 422 com erros do Zod).
 * Retorna um mapa { nomeDoCampo: mensagem } para exibição inline nos inputs.
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.erros && data.erros.length > 0) {
      const fieldErrors: Record<string, string> = {};
      for (const e of data.erros) {
        if (e.campo) {
          fieldErrors[e.campo] = e.mensagem;
        }
      }
      return fieldErrors;
    }
  }
  return {};
}
