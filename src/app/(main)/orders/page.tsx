'use client'
import { useAppContext } from '@/app/app-context';
import { useCompleteOrder, useGetListOrder, useProcessOrder } from '@/services/order.service';
import { QueryKey } from '@/shared/constants/query.key';
import { IOder, OrderStatus } from '@/shared/types/order';
import { IProduct } from '@/shared/types/product';
import { UserRole } from '@/shared/types/user';
import { formatDate } from '@/shared/utils/format.date';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { SettingOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Checkbox, DatePicker, Modal, Select, Table, TableProps, Tag } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

export default function OrderManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [choosenOrder, setChoosenOrder] = useState<IOder | undefined>()
  const [processModal, setProcessModal] = useState(false)
  const [completeModal, setCompleteModal] = useState(false)
  const [isLoadingBtn, setIsLoadingBtn] = useState(false)
  const [status, setStatus] = useState<string | undefined>()
  const [from, setFrom] = useState<string | undefined>(dayjs().startOf('day').toISOString())
  const [to, setTo] = useState<string | undefined>(dayjs().add(1, 'day').startOf('day').toISOString())
  const [createdByMe, setCreatedByMe] = useState(false)
  const [processByMe, setProcessByMe] = useState(false)
  const appContext = useAppContext()
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data, isLoading } = useGetListOrder({
    page: currentPage,
    pageSize: 10,
    status,
    from,
    to,
    createdBy: createdByMe ? appContext.user?.id : undefined,
    processBy: processByMe ? appContext.user?.id : undefined
  })

  const columns: TableProps<IOder>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Total price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: value => <p>{formatCurrency(value)} VND</p>
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => {
        if (value === OrderStatus.CREATED) return <Tag color="volcano">Waiting for processing</Tag>
        if (value === OrderStatus.PROCESSING) return <Tag color="blue">Processing</Tag>
        if (value === OrderStatus.COMPLETED) return <Tag color="green">Completed</Tag>

        return '';
      }
    },
    {
      title: 'Quantity',
      dataIndex: 'products',
      key: 'products',
      render: (value: IProduct[]) => {
        let quantity = 0;

        value.forEach(product => quantity += product.quantity || 0)
        return <p>{quantity}</p>
      }
    },
    {
      title: 'Created by',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: value => value?.fullName || value?.username
    },
    {
      title: 'Processed by',
      dataIndex: 'processBy',
      key: 'processBy',
      render: value => value?.fullName || value?.username
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: value => <p>{formatDate(value)}</p>
    },
    {
      title: <SettingOutlined />,
      key: 'action',
      onCell: () => ({
        onClick: (e) => e.stopPropagation(),
      }),
      render: (_, record) => {
        return (
          <div className='flex gap-4'>
            {appContext.user?.role === UserRole.BARISTA && (
              <>
                {record.status === OrderStatus.CREATED && (
                  <Button
                    variant='outlined'
                    onClick={() => {
                      setChoosenOrder(record)
                      setProcessModal(true)
                    }}
                  >Process</Button>
                )}
                {record.status === OrderStatus.PROCESSING && (
                  <Button
                    type='primary'
                    onClick={() => {
                      setChoosenOrder(record)
                      setCompleteModal(true)
                    }}
                  >Complete</Button>
                )}
              </>
            )}
            {appContext.user?.role === UserRole.ORDER_TAKER && (
              <>
                {record.status === OrderStatus.CREATED && (
                  <div className='flex flex-col gap-4'>
                    <Button
                      variant='outlined'
                      onClick={() => {
                        setChoosenOrder(record)
                        setProcessModal(true)
                      }}
                    >Process payment</Button>
                    <Button
                      variant='outlined'
                      danger
                      onClick={() => {
                        setChoosenOrder(record)
                        setProcessModal(true)
                      }}
                    >Cancel order</Button>
                  </div>
                )}
                {record.status === OrderStatus.PROCESSING && (
                  <Button
                    variant='outlined'
                    danger
                    onClick={() => {
                      setChoosenOrder(record)
                      setProcessModal(true)
                    }}
                  >Cancel order</Button>
                )}
              </>
            )}
          </div>
        )
      }
    }
  ]

  const processOrder = useProcessOrder(() => {
    setIsLoadingBtn(false)
    setProcessModal(false)
    queryClient.invalidateQueries({ queryKey: [QueryKey.GET_ORDERS] })
  }, () => {
    setIsLoadingBtn(false)
  })

  const handleOKProcess = () => {
    setIsLoadingBtn(true)
    processOrder.mutate({ id: choosenOrder?.id })
  }

  const completeOrder = useCompleteOrder(() => {
    setIsLoadingBtn(false)
    setCompleteModal(false)
    queryClient.invalidateQueries({ queryKey: [QueryKey.GET_ORDERS] })
  }, () => {
    setIsLoadingBtn(false)
  })

  const handleOKComplete = () => {
    setIsLoadingBtn(true)
    completeOrder.mutate({ id: choosenOrder?.id })
  }

  const onStatusChange = (value: any) => {
    setStatus(value)
  }

  return (
    <div className='mr-12'>
      <div className='flex gap-4 mb-4 items-center'>
        <DatePicker
          defaultValue={dayjs()}
          onChange={(e) => {
            if (!e) {
              setFrom(undefined)
              setTo(undefined)
            } else {
              setFrom(e.toISOString())
              setTo(e.add(1, 'day').toISOString())
            }
          }} />
        <Select
          placeholder="Status"
          allowClear
          style={{ width: 200 }}
          onChange={onStatusChange}
          options={Object.entries(OrderStatus).map(([key, value]) => {
            return {
              label: key,
              value: value
            }
          })}
        />
        <Checkbox
          value={createdByMe}
          onChange={(e) => {
            setCreatedByMe(e.target.checked)
          }}
        >Created by me</Checkbox>
        <Checkbox
          value={processByMe}
          onChange={(e) => {
            setProcessByMe(e.target.checked)
          }}
        >Processed by me</Checkbox>
      </div>
      <Table
        className='cursor-pointer'
        bordered
        loading={isLoading}
        columns={columns}
        scroll={{ x: 'max-content' }}
        dataSource={data?.rows.map((item: any, index: number) => {
          return {
            key: index,
            ...item
          }
        })}
        pagination={{
          pageSize: 10,
          total: data?.count,
        }}
        onChange={(pagination) => {
          setCurrentPage(pagination.current || 1);
        }}
        onRow={(record) => ({
          onClick: () => router.push(`/orders/${record.id}`),
        })}
      />
      <Modal
        title='Process order'
        open={processModal}
        onOk={handleOKProcess}
        onCancel={() => setProcessModal(false)}
        confirmLoading={isLoadingBtn}
      >
        <p>Confirm to process this order ?</p>
      </Modal>
      <Modal
        title='Complete order'
        open={completeModal}
        onOk={handleOKComplete}
        onCancel={() => setCompleteModal(false)}
        confirmLoading={isLoadingBtn}
      >
        <p>Confirm to complete this order ?</p>
      </Modal>
    </div>
  )
}
