export default class AddBooking {
    constructor(
        public hotelId: string,
        public userId: string,
        public roomNumber: string,
        public startDate: number,
        public endDate: number,
        public peopleCount: number,
    ) { }
}