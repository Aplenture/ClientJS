import { Request } from "../utils/request";

export class JSONRequest<TResponse extends NodeJS.ReadOnlyDict<any>, TParams> extends Request<TResponse, TParams> {
    protected parse(result: string): TResponse {
        return JSON.parse(result);
    }
}