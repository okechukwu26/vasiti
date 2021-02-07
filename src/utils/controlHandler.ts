import { BaseApiResponse } from "./../api/baseInterface";
import { Users as UserModel } from "../api/User/userModel";
import { Request, Response, NextFunction } from "express";
/* Type declaration to override User type declared by passport */
declare global {
    namespace Express {
        // tslint:disable-next-line:no-empty-interface
        interface User extends UserModel { }
    }
}

/**
 * Handles controller execution and responds to user (API Express version).
 * @param promise Controller Promise. I.e. ControllerInstance().getUser.
 * @param params A function (req, res, next), all of which are optional
 * that maps our desired controller parameters. I.e. (req) => [
 * req.params.username, ...].
 */
// tslint:disable-next-line:ban-types
// tslint:disable-next-line:max-line-length
export const controlHandler = (promise: (...any) => Promise<BaseApiResponse>, params: (req: Request, res: Response, next: NextFunction) => any) => {
    return async (req, res, next) => {
        const boundParams = params ? params(req, res, next) : [];

        try {
            const result = await promise(...boundParams);
            return res.status(result.statusCode).json(prepareRes(req, result));
        } catch (error) {
            next(error);
        }
    };
};

const prepareRes = (req: Request, result: BaseApiResponse) => {
    if ((req.query.page && req.query.limit)) {
        if (result.total == null) {
            throw new Error("Total count of items not found. Did you call findAndCount()?");
        }
        const { page, limit } = req.query;
        const totalPages = Math.ceil((result.total / Number(limit)));
        return {
            status: result.status,
            message: result.message,
            data: result.data,
            currentPage: Number(page),
            totalPages,
            nextPage: Number(page) < totalPages ? Number(page) + 1 : null,
            prevPage: (Number(page) < totalPages && Number(page) != 1) ? Number(page) - 1 : null,
        };
    } else {
        return {
            status: result.status,
            message: result.message,
            data: result.data,
        };
    }
};
