export default interface HotelImage {
    imageURL: string,
    imageDesc: string,
    imageType: "hotel" | "room" | null,
    roomNumber: number | null
}