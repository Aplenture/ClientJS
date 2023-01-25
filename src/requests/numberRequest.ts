import { Request } from "../utils/request";

export class NumberRequest<TParams extends NodeJS.ReadOnlyDict<any>> extends Request<number, TParams> {
    protected parse(result: string): number {
        return Number(result);
    }
}