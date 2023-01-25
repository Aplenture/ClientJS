import * as Foundation from "foundationjs";
import { Client, Request, RequestOptions } from "../utils";

export class PrivateRequest<TResponse, TParams> extends Request<TResponse, TParams> {
    constructor(path: string, parser: (data: string) => TResponse, options?: RequestOptions) {
        super(path, parser, options);

        this.onSending.on(() => this.setHeader(Foundation.RequestHeader.APIKey, Client.session.access.id));
        this.onSending.on(params => this.setHeader(Foundation.RequestHeader.Signature, Client.session.access.sign(params)));
    }

    public send(params: TParams, headers?: NodeJS.ReadOnlyDict<string>): Promise<TResponse> {
        if (!Client.session.access)
            throw new Error('no_access');

        return super.send(params, headers);
    }

    protected paramsToString(params: NodeJS.Dict<any> = {}): string {
        params['timestamp'] = Date.now();

        return super.paramsToString(params);
    }
}