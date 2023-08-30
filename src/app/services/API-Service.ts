import { DefaultOptionType } from "antd/es/select";
import Bookings from "../../../models/bookings";
import { Filter, Storage } from "../../../redux";
import AddHotel from "../../../models/add-hotel";
import { UploadFile } from "antd";
import { RcFile } from "antd/es/upload";
import Hotel from "../../../models/hotel";
import HotelImage from "../../../models/hotel-images";
import AddUser from "../../../models/add-user";

const APIService = {
    getUserBookings: async (user: string): Promise<Response> => {
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
        return fetch(endpoint, options);
    },

    cancelBooking: async (booking: Bookings): Promise<Response> => {
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
        return fetch(endpoint, options)
    },

    getCountryList: async (): Promise<Response> => {
        const endpoint = "/api/hotels/get-country-list"
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        return fetch(endpoint, options)
    },

    getStateList: async (): Promise<Response> => {
        const endpoint = "/api/hotels/get-state-list"
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        return fetch(endpoint, options)
    },

    getHotelBookings: async (storage: Storage): Promise<Response> => {
        const endpoint = '/api/hotels/get-hotel-bookings'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: storage.hotelId,
            }),
        }
        return fetch(endpoint, options)
    },

    addHotel: (hotelDetails: AddHotel): Promise<Response> => {
        const endpoint = '/api/hotels/add-details'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(hotelDetails),
        }
        return fetch(endpoint, options)
    },

    uploadHotelImages: (hotelId: string, images: UploadFile[]): Promise<Response> => {
        const formData = new FormData();
        images.forEach((file) => {
            formData.append("files[]", file as RcFile);
        });
        formData.append("hotelId", hotelId);
        const endpoint = '/api/hotels/upload-images'
        const options = {
            method: 'POST',
            body: formData,
        }
        return fetch(endpoint, options);
    },

    getPaginatedHotelList: async (pageSize: number, pageNumber: number, filter: Filter): Promise<Response> => {
        const endpoint = '/api/hotels/get-paginated-hotel-list'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pageSize: pageSize,
                pageNumber: pageNumber,
                name: filter.name,
                address: filter.address,
                state: filter.state,
                country: filter.country
            }),
        }
        return fetch(endpoint, options);
    },

    deleteHotel: async (hotel: Hotel, user: string): Promise<Response> => {
        const userDetails = JSON.parse(user);
        const endpoint = '/api/hotels/delete-hotel'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hotelId: hotel._id,
                userId: userDetails._id,
            }),
        }
        return fetch(endpoint, options)
    },

    getRoomCount: async (id: string): Promise<Response> => {
        const endpoint = '/api/hotels/get-room-count'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        }
        return fetch(endpoint, options);
    },

    addImageMetadata: async (id: string, metas: HotelImage[]): Promise<Response> => {
        const endpoint = '/api/hotels/add-image-metadata'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ metadata: metas, id: id }),
        }
        return fetch(endpoint, options);
    },

    login: async (email: string, password: string): Promise<Response> => {
        const endpoint = '/api/users/login'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        }
        return fetch(endpoint, options);
    },

    register: async (user: AddUser): Promise<Response> => {
        const endpoint = '/api/users/register'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        }
        return fetch(endpoint, options);
    },

    getHotelDetails: async (storage: Storage): Promise<Response> => {
        const endpoint = '/api/hotels/get-hotel'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: storage.hotelId
            }),
        }
        return fetch(endpoint, options)
    },

    getRoomList: async (storage: Storage, dates: [number, number], peopleCount: number | null): Promise<Response> => {
        const endpoint = '/api/hotels/get-hotel-rooms'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: storage.hotelId,
                dates: dates,
                peopleCount: peopleCount
            }),
        }
        return fetch(endpoint, options);
    },

    bookRoom: async (storage: Storage, dates: [number, number], roomNumber: number, peopleCount: number | null, user: string): Promise<Response> => {
        const endpoint = '/api/hotels/book-room'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                hotelId: storage.hotelId,
                roomNumber: roomNumber,
                startDate: dates[0],
                endDate: dates[1],
                peopleCount: peopleCount,
                user: (JSON.parse(user))._id
            }),
        }
        return fetch(endpoint, options)
    }
}

export default APIService;