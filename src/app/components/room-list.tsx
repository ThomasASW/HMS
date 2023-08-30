'use client'

import React, { useEffect, useState } from 'react';
import { Button, Card, Carousel, Col, DatePicker, Image, InputNumber, List, Row, Space, Tag, Typography } from 'antd';
import { getStorage, useSelector } from '../../../redux';
import { parse } from 'date-fns';
import Hotel from '../../../models/hotel';
import AddRoom from '../../../models/add-room';
import Title from 'antd/es/typography/Title';
import { useRouter } from 'next/navigation';
import APIService from '../services/API-Service';

const { Text } = Typography;
const { RangePicker } = DatePicker;

function RoomList({ user }: { user: string }) {

    const { push } = useRouter();
    const storage = useSelector(getStorage);
    const [hotel, setHotel] = useState<Hotel>()
    const [roomList, setRoomList] = useState<AddRoom[]>([])
    const [loading, setLoading] = useState(true)
    const [canBook, setCanBook] = useState(false)
    const [peopleCount, setPeopleCount] = useState<number | null>(2)
    const [dates, setDates] = useState<[number, number]>([0, 0])

    useEffect(() => {
        initialLoad();
    }, [])

    useEffect(() => {
        const check = [NaN, 0]
        if (check.includes(dates[0]) || check.includes(dates[1])) {
            setCanBook(false);
        }
        if (peopleCount == null) {
            setCanBook(false);
        }
        if (!check.includes(dates[0]) && !check.includes(dates[1]) && peopleCount != null) {
            setCanBook(true)
        }
        getRoomList();
    }, [dates, peopleCount])

    const initialLoad = async () => {
        await getHotelDetails();
        await getRoomList();
        setLoading(false);
    }

    const getHotelDetails = async () => {
        const response = await APIService.getHotelDetails(storage)
        if (response.status == 200) {
            const json = await response.json()
            const hotel = JSON.parse(json);
            console.log(hotel);
            setHotel(hotel);
        }
    }

    const getRoomList = async () => {
        const response = await APIService.getRoomList(storage, dates, peopleCount)
        if (response.status == 200) {
            const json = await response.json()
            const room = JSON.parse(json);
            console.log(room);
            setRoomList(room.rooms)
        }
    }

    const pickDates = (value: any, dateString: [string, string]) => {
        console.log(value, dateString);
        let dates: Date[] = []
        for (let i = 0; i < dateString.length; i++) {
            dates.push(parse(dateString[i], "yyyy-MM-dd", new Date()))
        }
        setDates([dates[0].getTime(), dates[1].getTime()]);
    }

    const people = (value: number | null) => {
        console.log(value);
        setPeopleCount(value);
    }

    const book = async (roomNumber: number) => {
        const response = await APIService.bookRoom(storage, dates, roomNumber, peopleCount, user)
        if (response.status == 200) {
            const json = await response.json()
            if (json.insertedId != "") {
                push("bookings")
            }
        }
    }

    return (
        <Card bodyStyle={{ padding: "0" }} style={{ width: "85%" }}>
            <Row
                style={{ width: "100%", padding: "10px" }}
            >
                <Col span={13}>
                    <div style={{ width: "500px", height: "281px", marginTop: "10px", marginLeft: "6px" }}>
                        <Carousel
                            autoplay
                        >
                            {hotel?.images.filter((image) => image.imageType == "hotel").map((image, index) => (
                                <Image
                                    height={281}
                                    key={index}
                                    alt={image.imageDesc}
                                    src={image.imageURL}
                                />
                            ))}
                        </Carousel>
                    </div>
                </Col>
                <Col span={11}>
                    <Row>
                        <Title style={{ marginTop: "10px", marginBottom: "6px" }} level={2}>{hotel?.name}</Title>
                    </Row>
                    <Row>
                        <Text style={{ marginBottom: "10px" }}>{hotel?.description}</Text>
                    </Row>
                    <Row>
                        <Text type='secondary'>{`${hotel?.address}, ${hotel?.city}, ${hotel?.state}, ${hotel?.country}`}</Text>
                    </Row>
                    <Row style={{ marginTop: "10px" }}>
                        <Space direction='horizontal' wrap>
                            {hotel?.amenities.map((amenity, index) => (
                                <Tag key={index}>{amenity}</Tag>
                            ))}
                        </Space>
                    </Row>
                </Col>
            </Row>
            <Row style={{ paddingLeft: "14px" }}>
                <Title level={3} style={{ marginTop: "10px" }}>Rooms</Title>
            </Row>
            <Row style={{ paddingLeft: "14px", paddingRight: "14px" }} gutter={10}>
                <Col span={12}>
                    <RangePicker style={{ width: "100%" }} onChange={pickDates} />
                </Col>
                <Col span={12}>
                    <InputNumber style={{ width: "100%" }} onChange={people} defaultValue={2} min={1} placeholder='People' />
                </Col>
            </Row>
            <Row style={{ paddingLeft: "10px" }}>
                <List
                    loading={loading}
                    size='large'
                    dataSource={roomList}
                    grid={{ column: 2, gutter: 0, xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
                    renderItem={(item) => (
                        <List.Item
                            key={item.roomNumber}
                            style={{ paddingTop: "20px", paddingLeft: "8px" }}
                        >
                            <Card
                                style={{ width: "350px" }}
                                bodyStyle={{ padding: "0" }}
                                cover={
                                    <div style={{ width: "350px", height: "197px" }}>
                                        <Carousel
                                            autoplay
                                        >
                                            {hotel?.images.filter((image) => image.imageType == "room" && image.roomNumber == item.roomNumber).map((image, index) => (
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
                                <Row style={{ paddingLeft: "8px" }}>
                                    <Title style={{ marginTop: "10px" }} level={4}>{item.desc}</Title>
                                </Row>
                                <Row style={{ paddingLeft: "8px" }}>
                                    <Text>People - {item.sleeps}</Text>
                                </Row>
                                <Row style={{ paddingLeft: "8px" }}>
                                    <Title style={{ marginTop: "10px" }} level={4}>&#8377; {item.price}</Title>
                                </Row>
                                <Row style={{ padding: "8px" }}>
                                    <Button
                                        type='primary'
                                        block
                                        disabled={!canBook}
                                        onClick={() => book(item.roomNumber)}
                                    >
                                        Book
                                    </Button>
                                </Row>
                            </Card>
                        </List.Item>
                    )}
                ></List>
            </Row>
        </Card>
    )
}

export default RoomList;