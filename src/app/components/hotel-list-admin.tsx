'use client'

import React, { useEffect, useState } from 'react';
import { Button, Card, Carousel, Image, List, Row, Space, Tag } from 'antd';
import Hotel from '../../../models/hotel';
import Meta from 'antd/es/card/Meta';
import { getFilter, notificationSlice, storageSlice, useDispatch, useSelector } from '../../../redux';
import { useRouter } from 'next/navigation';
import { CalendarOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import APIService from '../services/API-Service';

function HotelListAdmin({ user }: { user: string }) {

    const { push } = useRouter();
    const dispatch = useDispatch();
    const filter = useSelector(getFilter);
    const [hotelList, setHotelList] = useState<Hotel[]>([])
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        getHotelList();
    }, [pageNumber, pageSize, filter])

    const getHotelList = async () => {
        const response = await APIService.getPaginatedHotelList(pageSize, pageNumber, filter);
        console.log(response);
        if (response.status == 200) {
            const json = await response.json();
            const hotelPage = JSON.parse(json);
            setHotelList(hotelPage.hotels)
            setTotal(hotelPage.total)
            setLoading(false)
        }
    }

    const viewBookings = (hotel: Hotel) => {
        dispatch(
            storageSlice.actions.store({
                hotelId: hotel._id
            })
        )
        push("bookings")
    }

    const deleteHotel = async (hotel: Hotel) => {
        setLoading(true);
        const response = await APIService.deleteHotel(hotel, user)
        console.log(response);
        if (response.status == 200) {
            const json = await response.json();
            const result = JSON.parse(json);
            console.log(result);
            dispatch(
                notificationSlice.actions.notify({
                    content: "Deleted successfully",
                    duration: 6,
                    type: "success"
                })
            )
            getHotelList();
        }
    }

    const editHotel = (hotel: Hotel) => {
        dispatch(
            storageSlice.actions.store({
                hotelId: hotel._id
            })
        )
        push("edit")
    }

    return (
        <Card bodyStyle={{ padding: "0" }}>
            <List
                loading={loading}
                size='large'
                pagination={{
                    onChange(page) {
                        console.log(page);
                        setPageNumber(page);
                    },
                    pageSize: pageSize,
                    align: "center",
                    defaultCurrent: 1,
                    defaultPageSize: 4,
                    showSizeChanger: true,
                    onShowSizeChange(current, size) {
                        console.log(current, size);
                        setPageSize(size);
                    },
                    total: total
                }}
                dataSource={hotelList}
                grid={{ column: 2, gutter: 0, xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
                renderItem={(item) => (
                    <List.Item
                        key={item._id.toString()}
                        style={{ paddingTop: "20px" }}
                    >
                        <Card
                            style={{ width: "350px" }}
                            cover={
                                <div style={{ width: "350px", height: "197px" }}>
                                    <Carousel
                                        autoplay
                                    >
                                        {item.images.map((image, index) => (
                                            <Image
                                                height={197}
                                                key={index}
                                                alt={image.imageDesc}
                                                src={image.imageURL}
                                            />
                                        ))}
                                    </Carousel>
                                </div>
                            }
                        >
                            <Meta
                                title={item.name}
                                description={item.city}
                            />
                            <Row style={{ marginTop: "10px" }}>
                                {item.amenities.map((amenity, index) => (
                                    <Tag key={index}>{amenity}</Tag>
                                ))}
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                {item.description}
                            </Row>
                            <Row style={{ marginTop: "10px" }}>
                                <Space direction='horizontal' wrap>
                                    <Button
                                        type='primary'
                                        icon={<EditOutlined />}
                                        onClick={() => editHotel(item)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        type='primary'
                                        onClick={() => viewBookings(item)}
                                        icon={<CalendarOutlined />}
                                    >
                                        View Bookings
                                    </Button>
                                    <Button
                                        type='primary'
                                        danger
                                        onClick={() => deleteHotel(item)}
                                        icon={<DeleteOutlined />}
                                    >
                                        Delete
                                    </Button>
                                </Space>
                            </Row>
                        </Card>
                    </List.Item>
                )}
            ></List>
        </Card>
    )
}

export default HotelListAdmin;