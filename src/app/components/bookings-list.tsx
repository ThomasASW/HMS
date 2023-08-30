'use client'

import React, { ReactNode, useEffect, useState } from 'react';
import { Button, Card, Carousel, Image, List, Row, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import Hotel from '../../../models/hotel';
import Title from 'antd/es/typography/Title';
import Bookings from '../../../models/bookings';
import { format } from 'date-fns';

const { Text } = Typography;

function BookingsList({ user }: { user: string }) {

    const [hotelList, setHotelList] = useState<Hotel[]>([])
    const [bookingsList, setBookingsList] = useState<Bookings[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getBookingsList();
    }, [])

    const getBookingsList = async () => {
        const endpoint = '/api/hotels/get-user-bookings'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: (JSON.parse(user))._id,
            }),
        }
        fetch(endpoint, options)
            .then((response) => {
                response
                    .json()
                    .then((json) => {
                        const hotelPage = JSON.parse(json);
                        console.log(hotelPage);
                        setHotelList(hotelPage.hotels)
                        setBookingsList(hotelPage.bookings)
                        setLoading(false);
                    }
                    )
            })
    }

    const getImages = (booking: Bookings): ReactNode => {
        const hotel = hotelList.filter((hotel) => hotel._id.toString() == booking.hotelId)
        return hotel[0].images.map((image, index) => (
            <Image
                key={index}
                height={197}
                src={image.imageURL}
                alt={image.imageDesc}
            />
        ))
    }

    const getRoomName = (booking: Bookings): ReactNode => {
        const hotel = hotelList.filter((hotel) => hotel._id.toString() == booking.hotelId)
        return hotel[0].rooms.filter((room) => room.roomNumber == booking.roomNumber).map((room, index) => (
            <Title style={{ marginTop: "0" }} key={index} level={3}>{room.desc}</Title>
        ))
    }

    const getHotelName = (booking: Bookings): ReactNode => {
        const hotel = hotelList.filter((hotel) => hotel._id.toString() == booking.hotelId)
        return <Text>{hotel[0].name}</Text>
    }

    const cancel = async (booking: Bookings) => {
        setLoading(true);
        const endpoint = '/api/hotels/cancel-booking'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: booking._id,
            }),
        }
        fetch(endpoint, options)
            .then((response) => {
                response
                    .json()
                    .then((json) => {
                        const result = JSON.parse(json);
                        console.log(result);
                        getBookingsList();
                    }
                    )
            })
    }

    return (
        <Card title="Bookings" style={{ width: "85%" }} bodyStyle={{ padding: "0" }}>
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
        </Card >
    )
}

export default BookingsList;