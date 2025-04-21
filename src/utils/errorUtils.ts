import { FieldErrorMap } from '@/types/api/responses/responseTypes';

export const getErrorMessage = (
  err: unknown,
  fallback = 'Something went wrong'
): string[] | string => {
  // Handle Axios / network / server errors
  if (typeof err === 'object' && err !== null) {
    const resData = (err as any)?.response?.data;

    // Case 1: Simple message string
    if (typeof resData?.message === 'string') {
      return resData.message;
    }

    // Case 2: Field validation errors
    if (
      resData?.message?.json &&
      typeof resData.message.json === 'object' &&
      resData.message.json !== null
    ) {
      const map = resData.message.json as FieldErrorMap;
      return Object.values(map).flat();
    }

    // Case 3: JS error with message
    if ('message' in err && typeof (err as any).message === 'string') {
      return (err as any).message;
    }
  }

  return fallback;
};
