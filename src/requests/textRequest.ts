import * as Foundation from "foundationjs";
import { Request } from "../utils";

export class TextRequest<TParams> extends Request<TParams, string> {
    protected parse(data: string): string {
        return Foundation.parseToString(data);
    }
}