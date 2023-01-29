import * as Aplenture from "aplenturejs";
import { Request } from "../utils";

export class BoolRequest<TParams> extends Request<TParams, boolean> {
    protected parse(data: string): boolean {
        return Aplenture.parseToBool(data);
    }
}