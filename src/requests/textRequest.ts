import { Request } from "../utils/request";

export class TextRequest<TParams extends NodeJS.ReadOnlyDict<any>> extends Request<string, TParams> {
    protected parse(result: string): string {
        return result;
    }
}