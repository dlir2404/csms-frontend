import { httpClient } from "@/libs/api.client"
import { ApiEndpoint } from "@/shared/constants/api.endpoint"
import { QueryKey } from "@/shared/constants/query.key"
import { useBaseMutation } from "@/shared/hooks/mutation"
import { OrderStatus } from "@/shared/types/order"
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

export const useProcessOrder = (onOk?: Function, onError?: Function) => {
    return useBaseMutation({
        mutationFn: async (body: any) => {
            const { id } = body
            return await httpClient.put(ApiEndpoint.PROCESS_ORDER, { status: OrderStatus.PROCESSING }, { id: id })
        },
        onSuccess: (data: any) => {
            onOk && onOk()
            notification.success({
                placement: 'top',
                message: 'Confirmed'
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

export const useCompleteOrder = (onOk?: Function, onError?: Function) => {
    return useBaseMutation({
        mutationFn: async (body: any) => {
            const { id } = body
            return await httpClient.put(ApiEndpoint.COMPLETE_ORDER, { status: OrderStatus.COMPLETED }, { id: id })
        },
        onSuccess: (data: any) => {
            onOk && onOk()
            notification.success({
                placement: 'top',
                message: 'Confirmed'
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