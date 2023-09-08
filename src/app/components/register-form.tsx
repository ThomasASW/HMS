'use client';

import React, { useState, useEffect } from 'react'
import { Card, Button, Form, Input } from 'antd';
import { useRouter } from 'next/navigation';
import AddUser from '../../../models/add-user';
import APIService from '../services/API-Service';
import { notificationSlice, useDispatch } from '../../../redux';

function RegisterForm() {

    const dispatch = useDispatch();
    const { push } = useRouter();
    const [form] = Form.useForm()
    const [canSubmit, setCanSubmit] = useState(false);
    const values = Form.useWatch([], form);

    useEffect(() => {
        form.validateFields({ validateOnly: true }).then(
            () => {
                setCanSubmit(false);
            },
            () => {
                setCanSubmit(true);
            }
        )
    }, [values])

    const register = async (values: AddUser) => {
        console.log(values);
        values.role = "user";
        const response = await APIService.register(values);
        if (response.status == 200) {
            const json = await response.json();
            if (json.insertedId !== "") {
                push('/login');
            }
        } else {
            dispatch(
                notificationSlice.actions.notify({
                    content: "Could not register user",
                    type: "error",
                    duration: 6
                })
            )
        }
    }

    return (
        <Card style={{ width: "300px" }}>
            <Form layout='vertical' form={form} onFinish={register}>
                <Form.Item label="First name" tooltip="This field is required" name='firstName' rules={[{ required: true }]}>
                    <Input allowClear placeholder='John' />
                </Form.Item>
                <Form.Item label="Last name" tooltip="This field is required" name='lastName' rules={[{ required: true }]}>
                    <Input allowClear placeholder='Doe' />
                </Form.Item>
                <Form.Item label="Email" tooltip="This field is required" name='email' rules={[{ required: true, type: 'email' }]}>
                    <Input allowClear placeholder='johndoe@domain.com' />
                </Form.Item>
                <Form.Item label="Password" tooltip="This field is required" name='password' rules={[{ required: true }]}>
                    <Input.Password allowClear placeholder='Password' />
                </Form.Item>
                <Form.Item>
                    <Button block disabled={canSubmit} type='primary' htmlType='submit'>Register</Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default RegisterForm;