'use client'
import { useLogin } from '@/services/auth.service'
import { Button, Form, Input, notification } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Login() {
  const router = useRouter()
  const login = useLogin(() => {
    notification.success({
      message: 'Login successfully',
    })
    router.push('/')
  })

  const onFinish = (values: { username: string; password: string }) => {
    login.mutate(values)
  }

  return (
    <div className="mx-4 px-10 py-4 border border-gray-400 rounded-xl">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <div className="text-2xl text-center mb-4">Login</div>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input className="text-2xl md:text-sm" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password className="text-2xl md:text-sm" />
        </Form.Item>

        <div className="flex justify-center">
          <Button size="large" type="primary" htmlType="submit">
            Login
          </Button>
        </div>
      </Form>
    </div>
  )
}
