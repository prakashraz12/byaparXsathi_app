import { UseMutationOptions } from '@tanstack/react-query';

import { Toast } from '@/components/re-usables/custom-toaster/toast-service';

export interface TOpts {
  disableDefaultToast?: boolean;
  disableErrorToast?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const apiOptions = <T, Output>(
  setError?: any,
  successCallback?: (data: Output) => void | Promise<void>,
  opts?: TOpts,
): Omit<UseMutationOptions<any, any, any, unknown>, 'mutationFn'> => ({
  onSuccess(data) {
    // Show default success toast if not disabled
    if (data?.data?.message) {
      Toast.show({
        type: 'success',
        title: 'Success',
        message: data.data.message as string,
      });
    }

    // Call custom success callback
    if (successCallback) {
      successCallback(data?.data);
    }
  },

  onError(err: { error: string; message: string; statusCode: number }) {
    if (err.statusCode === 401) return;

    if (err?.message) {
      return Toast.show({
        type: 'error',
        title: 'Error',
        message: err.message,
      });
    }

    // Generic error toast
    if (!opts?.disableErrorToast) {
      Toast.show({
        type: 'error',
        title: 'Error',
        message: 'Operation failed!!',
      });
    }
  },
});
