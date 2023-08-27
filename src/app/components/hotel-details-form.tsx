import { Button, Form, Input, Radio, Select, SelectProps, message, Row, Col, Space, InputNumber } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import AddHotel from '../../../models/add-hotel';
import { notificationSlice, useDispatch } from '../../../redux';

interface HotelDetailsFormProps {
    next: (id: string) => void
}

function HotelDetailsForm({ next }: HotelDetailsFormProps) {

    const dispatch = useDispatch();
    const [canSubmit, setCanSubmit] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [form] = Form.useForm();
    const values = Form.useWatch([], form);
    const [messageApi, contextHolder] = message.useMessage();

    const options: SelectProps['options'] = [
        {
            value: "free_WiFi",
            label: "Free Wifi",
        },
        {
            value: "pool",
            label: "Pool",
        },
        {
            value: "parking",
            label: "Parking",
        },
        {
            value: "ac",
            label: "A/C",
        },
        {
            value: "gym",
            label: "Gym",
        },
        {
            value: "room_service",
            label: "Room service",
        },
        {
            value: "sauna",
            label: "Sauna",
        },
        {
            value: "wheelchair_accessible",
            label: "Wheelchair Accessible",
        },
    ];

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
    }, [error])

    useEffect(() => {
        if (uploading) {
            save();
        }
    }, [uploading])

    const save = async () => {
        let hotel: AddHotel = { ...values };
        hotel.pets = form.getFieldValue("pets") === "yes" ? true : false
        for (let i = 0; i < hotel.rooms.length; i++) {
            const room = hotel.rooms[i];
            room.roomNumber = i + 1
        }
        hotel.images = [];
        console.log(hotel);
        const endpoint = '/api/hotels/add-details'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        }
        fetch(endpoint, options)
            .then((response) => {
                response.json().then((json) => {
                    const hotel = JSON.parse(json);
                    next(hotel.insertedId)
                });
            })
            .catch((error) => {
                console.log(error);
                setError(error);
                setUploading(false);
            });
    }

    const register = async (values: AddHotel) => {
        setUploading(true);
        console.log(values);
    }

    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    return (
        <Form layout='vertical' form={form} onFinish={register}>
            <Form.Item label="Name" tooltip="This field is required" name='name' rules={[{ required: true }]}>
                <Input allowClear placeholder='Hotel Rue De Lac' />
            </Form.Item>
            <Form.Item label="Description" tooltip="This field is required" name='description' rules={[{ required: true }]}>
                <TextArea allowClear placeholder='Description of the hotel' />
            </Form.Item>
            <Form.Item label="Pets allowed" tooltip="This field is required" name='pets' rules={[{ required: true }]}>
                <Radio.Group>
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="Amenities" tooltip="This field is required" name='amenities' rules={[{ required: true }]}>
                <Select
                    mode='tags'
                    placeholder="Amenities"
                    onChange={handleChange}
                    options={options}
                />
            </Form.Item>
            <Form.List
                name="rooms"
                rules={[
                    {
                        validator: async (_, names) => {
                            if (!names || names.length < 1) {
                                return Promise.reject(new Error('At least 1 room required'));
                            }
                        },
                    },
                ]}
            >
                {(fields, { add, remove }, { errors }) => (
                    <Row>
                        <Col span={23}>
                            <Form.Item
                                label='Rooms'
                                required={false}
                            >
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <Row key={index} gutter={10} style={{ marginBottom: "10px" }}>
                                        <Col span={24}>
                                            <Space direction='horizontal' style={{ width: "100%" }} wrap>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "desc"]}
                                                    label={`Room #${index + 1}`}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            whitespace: true,
                                                            message: "Please input room description.",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Room description" />
                                                </Form.Item>
                                                <Form.Item label="Sleeps" {...restField}
                                                    rules={[
                                                        {
                                                            required: true
                                                        }
                                                    ]}
                                                    name={[name, "sleeps"]}>
                                                    <InputNumber placeholder='Sleeps' style={{ width: "100%" }} />
                                                </Form.Item>
                                                <Form.Item label="Area" {...restField}
                                                    rules={[
                                                        {
                                                            required: true
                                                        }
                                                    ]}
                                                    name={[name, "area"]}>
                                                    <InputNumber placeholder='Square feet' style={{ width: "100%" }} />
                                                </Form.Item>
                                                <Form.Item label="Number of rooms" {...restField}
                                                    rules={[
                                                        {
                                                            required: true
                                                        }
                                                    ]}
                                                    name={[name, "nor"]}>
                                                    <InputNumber placeholder='Number of rooms' style={{ width: "100%" }} />
                                                </Form.Item>
                                                <Button
                                                    type="primary"
                                                    shape='circle'
                                                    onClick={() => remove(name)}
                                                    icon={<MinusCircleOutlined />}
                                                >
                                                </Button>
                                            </Space>
                                        </Col>
                                    </Row>
                                ))}
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </Col>
                        <Col span={1}>
                            <Button
                                type="primary"
                                shape='circle'
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                            >
                            </Button>
                        </Col>
                    </Row>
                )}
            </Form.List>
            <Form.Item>
                <Button disabled={canSubmit} loading={uploading} block type='primary' htmlType='submit'>Next</Button>
            </Form.Item>
        </Form>
    )
}

export default HotelDetailsForm