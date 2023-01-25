import * as Foundation from "foundationjs";
import { Request } from "../utils/request";

export class BoolRequest<TParams> extends Request<boolean, TParams> {
    protected parse(result: string): boolean {
        return Foundation.parseToBool(result);
    }
}