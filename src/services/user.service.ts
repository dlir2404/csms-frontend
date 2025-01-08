import { httpClient } from '@/libs/api.client'
import { ApiEndpoint } from '@/shared/constants/api.endpoint'
import { QueryKey } from '@/shared/constants/query.key'
import { useQuery } from '@tanstack/react-query'

export const useGetListUser = ({ page, pageSize }: { page: number; pageSize: number }) => {
  return useQuery({
    queryKey: [QueryKey.GET_USERS],
    queryFn: async () => {
      return await httpClient.get(ApiEndpoint.GET_USERS, { page, pageSize })
    },
  })
}
