import AddRoom from "./add-room";
import HotelImage from "./hotel-images";

export default class AddHotel {
    constructor(
        public name: string,
        public description: string,
        public pets: boolean,
        public amenities: string[],
        public roomCount: number,
        public rooms: AddRoom[],
        public images: HotelImage[],
    ) { }
}