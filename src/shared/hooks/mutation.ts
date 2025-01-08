import { MutateFunction, useMutation } from '@tanstack/react-query'
import { notification } from 'antd'

export const useBaseMutation = ({
  mutationFn,
  onError,
  onSuccess,
}: {
  mutationFn: MutateFunction
  onError?:
    | ((error: Error, variables: void, context: unknown) => Promise<unknown> | unknown)
    | undefined
  onSuccess?:
    | ((data: unknown, variables: void, context: unknown) => Promise<unknown> | unknown)
    | undefined
}) => {
  return useMutation({
    mutationFn: async (body: any) => mutationFn(body),
    onError: (error: any, variables, context) => {
      if (onError) {
        onError(error, variables, context)
      } else {
        notification.error({
          placement: 'top',
          message: error.error,
          description: Array.isArray(error.message) ? error.message[0] : error.message,
        })
      }
    },
    onSuccess: (data, variables, context) => {
      if (onSuccess) {
        onSuccess(data, variables, context)
      } else {
        return data
      }
    },
  })
}
