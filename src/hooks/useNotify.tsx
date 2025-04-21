import { notifications } from '@mantine/notifications'
import { getErrorMessage } from '@/utils/errorUtils'

export const useNotify = () => {
  const success = (title: string, message?: string) => {
    notifications.show({
      title,
      message,
      color: 'green',
      autoClose: 3000,
      withCloseButton: true,
    })
  }

  const error = (err: unknown, fallback = 'Something went wrong') => {
    const message = getErrorMessage(err, fallback);
    const displayMessage = Array.isArray(message)
      ? message.map((msg) => `• ${msg}`).join('\n')
      : message;

    notifications.show({
      title: 'Error',
      message: displayMessage,
      color: 'red',
      autoClose: 5000,
    })
  }

  return { success, error }
}