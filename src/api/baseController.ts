import { HttpStatusCode } from "./../enums";
export class BaseController {
    // tslint:disable-next-line:max-line-length
    public sendResponse({ data, message = "OK", statusCode = HttpStatusCode.OK, status = true, total = null }: { data; message?: string; statusCode?: HttpStatusCode; status?: boolean; total?: number; }) {
        return { data, message, statusCode, status, total };
    }
}
