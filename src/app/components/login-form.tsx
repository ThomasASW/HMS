'use client';

import React, { useState, useEffect } from 'react'
import { Card, Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import { notificationSlice, useDispatch } from '../../../redux';
import APIService from '../services/API-Service';

function LoginForm() {

  const dispatch = useDispatch();
  const { push } = useRouter();
  const [error, setError] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const email = Form.useWatch("email", form);
  const password = Form.useWatch("password", form);

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
      dispatch(
        notificationSlice.actions.notify({
          content: error,
          type: "error",
          duration: 6
        })
      )
    }
    setError("")
  }, [error])

  const login = async () => {
    const response = await APIService.login(email, password)
    if (response.status == 200) {
      const json = await response.json();
      if (json !== "null") {
        const user = JSON.parse(json);
        localStorage.setItem("role", user.role)
        if (user.role != "admin") {
          push("/hotels/list");
        } else {
          push("/hotels/admin/list");
        }
      } else {
        setError("Invalid credentials");
        setLoading(false);
      }
    } else {
      setError("Server error");
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loading == true) {
      login();
    }
  }, [loading])


  const submit = async (values: any) => {
    setLoading(true);
    console.log(values);
  }

  return (
    <>
      <Card style={{ width: "300px" }}>
        <Form layout='vertical' form={form} onFinish={submit}>
          <Form.Item label="Email" tooltip="This field is required" name='email' rules={[{ required: true, type: 'email' }]}>
            <Input allowClear placeholder='email@domain.com' />
          </Form.Item>
          <Form.Item label="Password" tooltip="This field is required" name='password' rules={[{ required: true }]}>
            <Input.Password allowClear placeholder='Password' />
          </Form.Item>
          <Form.Item>
            <Button block loading={loading} disabled={canSubmit} type='primary' htmlType='submit'>Login</Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}

export default LoginForm;