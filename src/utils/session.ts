import * as Foundation from "foundationjs";

const KEY_ACCESS = 'session.access';

export class Session {
    public readonly onAccessChanged = new Foundation.Event<Session, Foundation.Access>();

    private _access: Foundation.Access;

    public get access(): Foundation.Access { return this._access; }

    public init() {
        const serializedAccess = window.sessionStorage.getItem(KEY_ACCESS)
            || window.localStorage.getItem(KEY_ACCESS);

        if (!serializedAccess)
            return;

        const access = Foundation.Access.fromHex(serializedAccess);

        if (!access)
            return;

        this._access = access;

        this.onAccessChanged.emit(this, this._access);
    }

    public updateAccess(access: Foundation.Access, keepLogin = false) {
        const serialization = access.toHex();

        this._access = access;

        if (keepLogin) {
            localStorage.setItem(KEY_ACCESS, serialization);
            sessionStorage.removeItem(KEY_ACCESS);
        } else {
            sessionStorage.setItem(KEY_ACCESS, serialization);
            localStorage.removeItem(KEY_ACCESS);
        }

        this.onAccessChanged.emit(this, access);
    }

    public resetAccess() {
        this._access = null;

        localStorage.removeItem(KEY_ACCESS);
        sessionStorage.removeItem(KEY_ACCESS);

        this.onAccessChanged.emit(this, null);
    }
}