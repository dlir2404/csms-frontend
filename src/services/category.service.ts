import { httpClient } from '@/libs/api.client'
import { ApiEndpoint } from '@/shared/constants/api.endpoint'
import { QueryKey } from '@/shared/constants/query.key'
import { useBaseMutation } from '@/shared/hooks/mutation'
import { useQuery } from '@tanstack/react-query'
import { notification } from 'antd'

export const useGetListCategory = ({ page, pageSize }: { page?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: [QueryKey.GET_CATEGORIES, page, pageSize],
    queryFn: async () => {
      return await httpClient.get(ApiEndpoint.GET_CATEGORIES, { page, pageSize })
    },
  })
}

export const useCreateCategory = (onOk?: Function) => {
  return useBaseMutation({
    mutationFn: async (body: any) => await httpClient.post(ApiEndpoint.CREATE_CATEGORY, body),
    onSuccess: (data: any) => {
      onOk && onOk(data)
      notification.success({
        placement: 'top',
        message: 'Successfully',
      })
    },
  })
}

export const useEditCategory = (onOk?: Function) => {
  return useBaseMutation({
    mutationFn: async (body: any) => {
      const { id, ...rest } = body

      return await httpClient.put(ApiEndpoint.EDIT_CATEGORY, rest, { id: id })
    },
    onSuccess: (data: any) => {
      onOk && onOk(data)
      notification.success({
        placement: 'top',
        message: 'Successfully',
      })
    },
  })
}

export const useDeleteCategory = (onOk?: Function) => {
  return useBaseMutation({
    mutationFn: async (body: any) => {
      const { id } = body

      return await httpClient.delete(ApiEndpoint.DELETE_CATEGORY, { id: id })
    },
    onSuccess: (data: any) => {
      onOk && onOk(data)
      notification.success({
        placement: 'top',
        message: 'Successfully',
      })
    },
  })
}
