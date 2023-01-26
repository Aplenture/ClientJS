import * as Foundation from "foundationjs";
import { Request } from "./request";

const KEY_ACCESS = 'session.access';

export interface SessionConfig {
    readonly hasAccessURL: string;
}

export class Session {
    public readonly onAccessChanged = new Foundation.Event<Session, Foundation.Access>();

    private readonly _hasAccessRequest: Request<boolean, {
        readonly session: string,
        readonly signature: string,
        readonly timestamp: number
    }>;

    private _access: Foundation.Access = null;

    constructor(config: SessionConfig) {
        this._hasAccessRequest = new Request(config.hasAccessURL, Foundation.parseToBool);
    }

    public get access(): Foundation.Access { return this._access; }

    public async init() {
        const serializedAccess = window.sessionStorage.getItem(KEY_ACCESS)
            || window.localStorage.getItem(KEY_ACCESS);

        if (!serializedAccess)
            return;

        const access = Foundation.Access.fromHex(serializedAccess);

        if (!(await this.hasAccess(access))) {
            window.localStorage.removeItem(KEY_ACCESS);
            window.sessionStorage.removeItem(KEY_ACCESS);
            return;
        }

        this._access = access;

        this.onAccessChanged.emit(this, this._access);
    }

    public updateAccess(access: Foundation.Access, keepLogin = false) {
        const serialization = access.toHex();

        this._access = access;

        if (keepLogin) {
            window.localStorage.setItem(KEY_ACCESS, serialization);
            window.sessionStorage.removeItem(KEY_ACCESS);
        } else {
            window.sessionStorage.setItem(KEY_ACCESS, serialization);
            window.localStorage.removeItem(KEY_ACCESS);
        }

        this.onAccessChanged.emit(this, access);
    }

    public resetAccess() {
        this._access = null;

        window.localStorage.removeItem(KEY_ACCESS);
        window.sessionStorage.removeItem(KEY_ACCESS);

        this.onAccessChanged.emit(this, null);
    }

    private hasAccess(access = this._access): Promise<boolean> {
        const timestamp = Date.now();

        return this._hasAccessRequest.send({
            session: access.id,
            signature: access.sign(timestamp.toString()),
            timestamp
        });
    }
}