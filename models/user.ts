import { ObjectId } from "mongodb";

export default class User {
    constructor(
        public _id: ObjectId,
        public firstName: string,
        public lastName: string,
        public email: string,
        public role: string
    ) { }
}