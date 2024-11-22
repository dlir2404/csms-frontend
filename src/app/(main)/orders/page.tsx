'use client'
import { useGetListOrder } from '@/services/order.service';
import { IOder, OrderStatus } from '@/shared/types/order';
import { IProduct } from '@/shared/types/product';
import { formatDate } from '@/shared/utils/format.date';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { SettingOutlined } from '@ant-design/icons';
import { Button, Table, TableProps, Tag } from 'antd';
import React, { useState } from 'react'

export default function OrderManagement() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useGetListOrder({
    page: currentPage,
    pageSize: 10
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
      render: (value:IProduct[]) => {
        let quantity = 0;

        value.forEach(product => quantity += product.quantity || 0)
        return <p>{quantity}</p>
      }
    },
    {
      title: 'Created by',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: value => value.fullName || value.username
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
      render: (_, record) => {
        return (
          <div className='flex gap-4'>
            <Button
              variant='outlined'
              onClick={() => {
                // setChoosenProduct(record)
                // setEditModal(true)
              }}
            >Process</Button>
          </div>
        )
      }
    }
  ]

  return (
    <div className='mr-12'>
      <Table
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
          console.log(pagination)
          setCurrentPage(pagination.current || 1);
        }}
      />
    </div>
  )
}
