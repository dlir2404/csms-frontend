import { httpClient } from "@/libs/api.client"
import { ApiEndpoint } from "@/shared/constants/api.endpoint"
import { QueryKey } from "@/shared/constants/query.key"
import { useBaseMutation } from "@/shared/hooks/mutation"
import { useQuery } from "@tanstack/react-query"
import { notification } from "antd"

export const useGetListOrder = ({
    page,
    pageSize
}: {
    page?: number,
    pageSize?: number
}) => {
    return useQuery({
        queryKey: [QueryKey.GET_ORDERS],
        queryFn: async () => {
            return await httpClient.get(ApiEndpoint.GET_ORDERS)
        }
    })
}


export const useCreateOrder = (onOk?: Function, onError?: Function) => {
    return useBaseMutation({
        mutationFn: async (body: any) => await httpClient.post(ApiEndpoint.CREATE_ORDER, body),
        onSuccess: (data: any) => {
            onOk && onOk()
            notification.success({
                placement: 'top',
                message: 'Successfully'
            })
        },
        onError: (error: any) => {
            onError && onError()
            notification.error({
                placement: 'top',
                message: error.error,
                description: Array.isArray(error.message) ? error.message[0] : error.message
            })
        }
    })
}