'use client';

import React, { useState, useEffect } from 'react'
import { Card, Button, Form, Input, message } from 'antd';
import { useRouter } from 'next/navigation';

function LoginForm() {

  const { push } = useRouter();
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const email = Form.useWatch("email", form);
  const password = Form.useWatch("password", form);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setCanSubmit(false);
      },
      () => {
        setCanSubmit(true);
      }
    )
  }, [email, password])

  useEffect(() => {
    if (error !== "") {
      showErrorNotification(error);
    }
  }, [error])

  const showErrorNotification = (content: string | null) => {
    messageApi.open({
      type: 'error',
      content: content,
      duration: 6,
    });
  };

  const login = async (values: any) => {
    console.log(values);
    const endpoint = '/api/users/login'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }
    const response = await fetch(endpoint, options);
    const json = await response.json();
    if (json !== "null") {
      push("/hotels");
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <>
      {contextHolder}
      <Card style={{ width: "300px" }}>
        <Form layout='vertical' form={form} onFinish={login}>
          <Form.Item label="Email" tooltip="This field is required" name='email' rules={[{ required: true, type: 'email' }]}>
            <Input allowClear placeholder='email@domain.com' />
          </Form.Item>
          <Form.Item label="Password" tooltip="This field is required" name='password' rules={[{ required: true }]}>
            <Input.Password allowClear placeholder='Password' />
          </Form.Item>
          <Form.Item>
            <Button block disabled={canSubmit} type='primary' htmlType='submit'>Login</Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}

export default LoginForm;