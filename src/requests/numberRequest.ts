import * as Foundation from "foundationjs";
import { Request } from "../utils";

export class NumberRequest<TParams> extends Request<TParams, number> {
    protected parse(data: string): number {
        return Foundation.parseToNumber(data);
    }
}