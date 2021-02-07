import { SchemaMap } from "@hapi/joi";
import { HttpStatusCode } from "../enums";

export interface IBaseInterface extends SchemaMap {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BaseApiResponse {
    total?: number;
    data: any;
    message: string;
    statusCode: HttpStatusCode;
    status:boolean
}