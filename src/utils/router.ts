import * as Foundation from "foundationjs";
import { Route } from "../models";

export class RouterConfig {
    readonly defaultRoute?: string;
}

export class Router {
    public static readonly onRouteChanged = new Foundation.Event<Router, Route>();

    public routes: readonly Route[];

    private readonly defaultRoute: string;

    private _route: Route = null;
    private _index: number;

    constructor(config: RouterConfig) {
        this.defaultRoute = config.defaultRoute;

        window.addEventListener('popstate', async () => this.init());
    }

    public get route(): Route { return this._route; }
    public get index(): number { return this._index; }

    public init() {
        const parts = window.location.pathname
            .substring(1)
            .split('/');

        const index = parseInt(parts[1]);

        this._route = this.findRoute(parts[0]);
        this._index = index && !isNaN(index)
            ? index
            : null;

        Router.onRouteChanged.emit(this, this._route);
    }

    public changeRoute(name: string, index: number = null) {
        this._route = this.findRoute(name);
        this._index = index;

        window.history.pushState({}, this._route.name, index ? `/${this._route.name}/${index}` : `/${this._route.name}`);

        Router.onRouteChanged.emit(this, this._route);
    }

    private findRoute(name: string) {
        return this.routes.find(route => route.name == name)
            || this.routes.find(route => route.name == this.defaultRoute)
            || this.routes[0];
    }
}