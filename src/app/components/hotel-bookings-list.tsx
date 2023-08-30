'use client'

import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Card, Carousel, Col, Image, List, Row, Space, Tag, Typography } from 'antd';
import Hotel from '../../../models/hotel';
import Title from 'antd/es/typography/Title';
import Bookings from '../../../models/bookings';
import { format } from 'date-fns';
import { getStorage, useSelector } from '../../../redux';

const { Text } = Typography;

function HotelBookingsList({ user }: { user: string }) {

    const hotel = useSelector(getStorage);
    const [hotelDetails, setHotelDetails] = useState<Hotel>()
    const [bookingsList, setBookingsList] = useState<Bookings[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getBookingsList();
    }, [])

    const getBookingsList = async () => {
        const endpoint = '/api/hotels/get-hotel-bookings'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: hotel.hotelId,
            }),
        }
        fetch(endpoint, options)
            .then((response) => {
                response
                    .json()
                    .then((json) => {
                        const hotelPage = JSON.parse(json);
                        console.log(hotelPage);
                        setHotelDetails(hotelPage.hotel)
                        setBookingsList(hotelPage.bookings)
                        setLoading(false);
                    }
                    )
            })
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
                <Title level={3} style={{ marginTop: "10px" }}>Bookings</Title>
            </Row>
            <Row style={{ paddingLeft: "10px" }}>
                <List
                    loading={loading}
                    size='large'
                    dataSource={bookingsList}
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
                                            {getImages(item)}
                                        </Carousel>
                                    </div>
                                }
                            >
                                <Row>
                                    {getRoomName(item)}
                                </Row>
                                <Row>
                                    {getHotelName(item)}
                                </Row>
                                <Row>
                                    {format(new Date(item.startDate), "dd-MM-yyyy") + "-> " + format(new Date(item.endDate), "dd-MM-yyyy")}
                                </Row>
                                {item.startDate > new Date().getTime() ?
                                    < Button
                                        style={{ marginTop: "8px" }}
                                        type='primary'
                                        block
                                        onClick={() => cancel(item)}
                                    >
                                        Cancel
                                    </Button> : <></>
                                }
                            </Card>
                        </List.Item>
                    )
                    }
                ></List >
            </Row>
        </Card>
    )
}

export default HotelBookingsList;