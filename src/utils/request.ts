import * as Foundation from "foundationjs";

export interface RequestOptions {
    readonly type?: Foundation.RequestMethod;
    readonly useCredentials?: boolean;
    readonly headers?: NodeJS.ReadOnlyDict<string>;
}

export class Request<TResponse, TParams> {
    public readonly onSending = new Foundation.Event<Request<TResponse, TParams>, string>();

    public readonly type: Foundation.RequestMethod;

    private readonly _request = new XMLHttpRequest();

    private _running = false;

    constructor(
        public readonly path: string,
        public readonly parser: (data: string) => TResponse,
        options: RequestOptions = {}
    ) {
        this.type = options.type || Foundation.RequestMethod.Get;

        this._request.withCredentials = options.useCredentials;

        if (options.headers)
            Object.keys(options.headers).forEach(name => this.setHeader(name, options.headers[name]));
    }

    public get isRunning(): boolean { return this._running; }

    public send(params: TParams, headers: NodeJS.ReadOnlyDict<string> = {}): Promise<TResponse> {
        if (this._running)
            throw new Error('request is running already');

        this._running = true;

        return new Promise<TResponse>((resolve, reject) => {
            this._request.onreadystatechange = () => {
                if (this._request.readyState !== 4)
                    return;

                this._running = false;

                switch (this._request.status) {
                    case Foundation.ResponseCode.OK: {
                        let result: TResponse;

                        try {
                            result = this.parser(this._request.responseText);
                        } catch (error) {
                            return reject(error);
                        }

                        return resolve(result);
                    }

                    case Foundation.ResponseCode.NoContent:
                        return resolve(null);

                    default:
                        return reject(new Error(this._request.responseText));
                }
            };

            const paramString = this.paramsToString(params);
            const path = this.createPath(paramString);
            const body = this.createBody(paramString);

            Object.keys(headers).forEach(name => this.setHeader(name, headers[name]));

            this._request.open(this.type, path, true);
            this._request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            this.onSending.emit(this, paramString);

            this._request.send(body);
        });
    }

    public setHeader(name: string, value: string) {
        this._request.setRequestHeader(name, value);
    }

    protected paramsToString(params: NodeJS.ReadOnlyDict<any> = {}): string {
        if (!params)
            return "";

        const args = [];

        for (const key in params) {
            if (typeof params[key] == "boolean")
                args.push(`${key}=${params[key] ? 1 : 0}`);
            else if (Array.isArray(params[key]))
                (params[key] as any).forEach(value => args.push(`${key}=${Foundation.encodeString(value)}`));
            else
                args.push(`${key}=${Foundation.encodeString(params[key] as any)}`)
        }

        return args.join("&");
    }

    protected createPath(params: string): string {
        let result = '';

        switch (this.type) {
            case Foundation.RequestMethod.Get:
                result += params
                    ? this.path + "?" + params
                    : this.path;
                break;

            default:
                result += this.path;
                break;
        }

        return result;
    }

    protected createBody(params: string): any {
        switch (this.type) {
            case Foundation.RequestMethod.Post:
                return params;

            default:
                return "";
        }
    }
}