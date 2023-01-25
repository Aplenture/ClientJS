import * as Foundation from "foundationjs";
import { Route } from "../models";

export interface RouterRoute extends Route {
    readonly name: string;
    readonly isPrivate: boolean;
    readonly action: () => void;

    index?: number;
}

export class Router {
    public readonly onRouteChanged = new Foundation.Event<Router, Route>();

    private _route: RouterRoute = null;

    private readonly _routes: readonly RouterRoute[];

    public get route(): Route { return this._route; }

    constructor(...routes: readonly RouterRoute[]) {
        this._routes = routes;

        window.addEventListener('popstate', async () => this.init());
    }

    public init() {
        const parts = window.location.pathname
            .substring(1)
            .split('/');

        this._route = this.findRoute(parts[0], parseInt(parts[1]));

        if (this._route)
            this._route.action();

        this.onRouteChanged.emit(this, this._route);
    }

    public changeRoute(name: string, index?: number) {
        this._route = this.findRoute(name, index);

        window.history.pushState({}, name, index ? `/${name}/${index}` : `/${name}`);

        this.onRouteChanged.emit(this, this._route);
    }

    private findRoute(name: string, index?: number): RouterRoute {
        const route = this._routes.find(route => route.name == name);

        if (!route)
            return null;

        route.index = index && !isNaN(index)
            ? index
            : null;

        return route;
    }
}