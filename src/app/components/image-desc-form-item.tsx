import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Image, Input, Radio, RadioChangeEvent, Row, Select } from "antd";
import { DefaultOptionType } from 'antd/es/select';
import HotelImage from '../../../models/hotel-images';
import { useRouter } from 'next/navigation';
import APIService from '../services/API-Service';

export interface ImageDescFormProps {
    id: string,
    fileUrls: string[]
}

const ImageDescForm = (({ id, fileUrls }: ImageDescFormProps) => {

    const { push } = useRouter();
    const [form] = Form.useForm();
    const values = Form.useWatch([], form);
    const [canSubmit, setCanSubmit] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [isRoom, setIsRoom] = useState<boolean[]>([])
    const [selectOptions, setSelectOptions] = useState<DefaultOptionType[]>([])
    const defaultOption: DefaultOptionType[] = [{
        label: "Select a room",
        value: "-1"
    }]

    useEffect(() => {
        getRoomCount();
    }, [])

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

    const getRoomCount = async () => {
        const response = await APIService.getRoomCount(id)
        if (response.status == 200) {
            const json = JSON.parse(await response.json());
            if (json != null) {
                let sOptions: DefaultOptionType[] = []
                for (let i = 0; i < json.roomCount; i++) {
                    sOptions.push({
                        label: `Room #${i + 1}`,
                        value: (i + 1).toString()
                    })
                }
                setSelectOptions(sOptions);
                setIsRoom(Array(json.roomCount).fill(false))
            }
        }
    }

    const finish = async (values: any) => {
        setUploading(true);
        console.log(values);
        let metas: HotelImage[] = []
        for (let i = 0; i < values.imageType.length; i++) {
            metas.push({
                imageDesc: values.imageDesc[i],
                imageType: values.imageType[i],
                imageURL: fileUrls[i],
                roomNumber: values.imageType[i] == "room" ? values.roomNumber[i] : null
            })
        }
        console.log(metas);
        const response = await APIService.addImageMetadata(id, metas)
        if (response.status == 200) {
            const json = await response.json();
            if (json.message == "Success") {
                push("list");
            }
        }
        setUploading(false);
    }

    const handleChange = (e: RadioChangeEvent, index: number) => {
        console.log(e.target.value, index);
        let room = [...isRoom]
        if (e.target.value == "room") {
            room[index] = true
        } else {
            room[index] = false
        }
        console.log(room);
        setIsRoom(room);
    }

    return (
        <Form form={form} onFinish={finish}>
            <Form.Item name="imageMeta">
                {fileUrls.map((fileUrl, index) => (
                    <Row key={index} gutter={10} style={{ marginBottom: "10px" }}>
                        <Col span={12}>
                            <Image
                                width="100%"
                                src={fileUrl}
                                alt=''
                            />
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name={["imageDesc", index]}
                                rules={[{ required: true }]}
                                label="Image description"
                            >
                                <Input allowClear placeholder='Image description' />
                            </Form.Item>
                            <Form.Item
                                name={["imageType", index]}
                                label="Image type"
                                rules={[{ required: true }]}
                            >
                                <Radio.Group
                                    onChange={(e: RadioChangeEvent) => handleChange(e, index)}
                                >
                                    <Radio value="hotel">Hotel</Radio>
                                    <Radio value="room">Room</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                name={["roomNumber", index]}
                                label="Room number"
                                hidden={!isRoom[index]}
                            >
                                <Select
                                    allowClear
                                    defaultActiveFirstOption={true}
                                    options={isRoom[index] ? selectOptions : defaultOption}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                ))}
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    block
                    disabled={canSubmit}
                    loading={uploading}
                    htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
})

export default ImageDescForm