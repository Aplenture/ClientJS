import * as Foundation from "foundationjs";
import { Request } from "../utils";

export class BoolRequest<TParams> extends Request<TParams, boolean> {
    protected parse(data: string): boolean {
        return Foundation.parseToBool(data);
    }
}