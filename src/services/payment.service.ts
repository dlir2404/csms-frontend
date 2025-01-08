import { httpClient } from '@/libs/api.client'
import { ApiEndpoint } from '@/shared/constants/api.endpoint'
import { useBaseMutation } from '@/shared/hooks/mutation'
import { notification } from 'antd'

export const usePayOrder = (onOk?: Function, onError?: Function) => {
  return useBaseMutation({
    mutationFn: async (body: any) => await httpClient.post(ApiEndpoint.PAY, body),
    onSuccess: (data: any) => {
      onOk && onOk(data)
      notification.success({
        placement: 'top',
        message: 'Successfully',
      })
    },
    onError: (error: any) => {
      onError && onError()
      notification.error({
        placement: 'top',
        message: error.error,
        description: Array.isArray(error.message) ? error.message[0] : error.message,
      })
    },
  })
}
