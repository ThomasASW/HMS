import { DatePicker } from 'antd'
import { ObjectId } from 'mongodb';
import React, { useEffect, useState } from 'react'
import APIService from '../services/API-Service';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

interface BookedDates {
    startDate: Date,
    endDate: Date
}

function Calendar({ hotelId, pickDates }: { hotelId: ObjectId | undefined, pickDates: (value: any, dateString: [string, string]) => void }) {

    const [bookedDates, setBookedDates] = useState<BookedDates[]>([])

    useEffect(() => {
        console.log(hotelId);
        getBookedDates();
    }, [])

    const getBookedDates = async () => {
        const response = await APIService.getHotelBookedDates(hotelId)
        if (response.status == 200) {
            const json = JSON.parse(await response.json())
            json.bookings.forEach((booking: any) => {
                booking.startDate = new Date(booking.startDate)
                booking.endDate = new Date(booking.endDate)
            });
            console.log(json);
            setBookedDates(json.bookings);
        }
    }

    const checkDateDisabled = (current: Dayjs): boolean => {
        for (let i = 0; i < bookedDates.length; i++) {
            const dates = bookedDates[i];
            if (current.isSame(dates.startDate, "day")) {
                return true;
            } else if (current.isSame(dates.endDate, "day")) {
                return true;
            } else if (current.isAfter(dates.startDate, "day") && current.isBefore(dates.endDate, "day")) {
                return true;
            }
        }
        return false;
    }

    return (
        <RangePicker
            style={{ width: "100%" }}
            allowClear
            onChange={pickDates}
            // disabledDate={checkDateDisabled}
            cellRender={(current, info) => {
                if (info.type !== "date") return info.originNode;
                const disabledStyle: React.CSSProperties = {}
                if (checkDateDisabled(current)) {
                    disabledStyle.borderBottom = "1px solid red"
                }
                return (
                    <div className="ant-picker-cell-inner" style={disabledStyle}>
                        {current.date()}
                    </div>
                )
            }}
        />
    )
}

export default Calendar