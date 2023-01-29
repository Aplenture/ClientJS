import * as Aplenture from "aplenturejs";
import { Request } from "../utils";

export class NumberRequest<TParams> extends Request<TParams, number> {
    protected parse(data: string): number {
        return Aplenture.parseToNumber(data);
    }
}