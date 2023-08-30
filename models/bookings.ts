import { ObjectId } from "mongodb";

export default interface Bookings {
    _id: ObjectId
    hotelId: string,
    userId: string,
    roomNumber: number,
    startDate: number,
    endDate: number,
    peopleCount: number,
}