import { httpClient } from '@/libs/api.client'
import { ApiEndpoint } from '@/shared/constants/api.endpoint'
import { QueryKey } from '@/shared/constants/query.key'
import { useBaseMutation } from '@/shared/hooks/mutation'
import { OrderStatus } from '@/shared/types/order'
import { TABLE_SORT } from '@/shared/types/sort'
import { useQuery } from '@tanstack/react-query'
import { notification } from 'antd'

export const useGetListOrder = ({
  page,
  pageSize,
  status,
  from,
  to,
  createdBy,
  processBy,
}: {
  page?: number
  pageSize?: number
  status?: string
  from?: string
  to?: string
  createdBy?: number
  processBy?: number
}) => {
  return useQuery({
    queryKey: [QueryKey.GET_ORDERS, page, pageSize, status, from, to, createdBy, processBy],
    queryFn: async () => {
      return await httpClient.get(ApiEndpoint.GET_ORDERS, {
        page,
        pageSize,
        status,
        from,
        to,
        createdBy,
        processBy,
        orderBy: 'id',
        order: TABLE_SORT.DESC,
      })
    },
  })
}

export const useGetOrder = (id: number) => {
  return useQuery({
    queryKey: [QueryKey.GET_ORDER],
    queryFn: async () => {
      return await httpClient.get(ApiEndpoint.GET_ORDER + `/${id}`)
    },
  })
}

export const useCreateOrder = (onOk?: Function, onError?: Function) => {
  return useBaseMutation({
    mutationFn: async (body: any) => await httpClient.post(ApiEndpoint.CREATE_ORDER, body),
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

export const useProcessOrder = (onOk?: Function, onError?: Function) => {
  return useBaseMutation({
    mutationFn: async (body: any) => {
      const { id } = body
      return await httpClient.put(
        ApiEndpoint.PROCESS_ORDER,
        { status: OrderStatus.PROCESSING },
        { id: id }
      )
    },
    onSuccess: (data: any) => {
      onOk && onOk(data)
      notification.success({
        placement: 'top',
        message: 'Confirmed',
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

export const useCompleteOrder = (onOk?: Function, onError?: Function) => {
  return useBaseMutation({
    mutationFn: async (body: any) => {
      const { id } = body
      return await httpClient.put(
        ApiEndpoint.COMPLETE_ORDER,
        { status: OrderStatus.COMPLETED },
        { id: id }
      )
    },
    onSuccess: (data: any) => {
      onOk && onOk(data)
      notification.success({
        placement: 'top',
        message: 'Confirmed',
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

export const useCancelOrder = (onOk?: Function, onError?: Function) => {
  return useBaseMutation({
    mutationFn: async (body: any) => {
      const { id } = body
      return await httpClient.put(
        ApiEndpoint.COMPLETE_ORDER,
        { status: OrderStatus.CANCELED },
        { id: id }
      )
    },
    onSuccess: (data: any) => {
      onOk && onOk(data)
      notification.success({
        placement: 'top',
        message: 'Canceled',
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
