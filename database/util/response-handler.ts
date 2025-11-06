import { Toast } from '@/components/re-usables/custom-toaster/toast-service';

interface ResponseHandlerProps {
  message?: string;
  statusCode?: number;
  success?: boolean;
  data?: any;
}
export const responseHandler = ({
  message = 'Operation Success',
  statusCode = 200,
  success = true,
  data,
}: ResponseHandlerProps) => {
  if (success === false) {
    Toast.error(message);
  }
  return {
    message,
    statusCode,
    success,
    data: data ?? null,
  };
};
