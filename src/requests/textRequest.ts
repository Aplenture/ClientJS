import * as Aplenture from "aplenturejs";
import { Request } from "../utils";

export class TextRequest<TParams> extends Request<TParams, string> {
    protected parse(data: string): string {
        return Aplenture.parseToString(data);
    }
}