import { ObjectId } from "mongodb";
import AddRoom from "./add-room";
import HotelImage from "./hotel-images";

export default interface Hotel {
    _id: ObjectId,
    name: string,
    description: string,
    address: string,
    city: string,
    state: string,
    country: string,
    pets: boolean,
    amenities: string[],
    roomCount: number,
    rooms: AddRoom[],
    images: HotelImage[],
}