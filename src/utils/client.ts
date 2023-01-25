import * as Foundation from "foundationjs";
import { ViewController } from "./viewController";
import { MessageViewController, PopupViewController } from "../viewControllers";
import { Router, RouterRoute } from "./router";
import { Route } from "../models";
import { Session } from "./session";
import { Request } from "./request";

const DEFAULT_LANGUAGE = "en";

interface ClientConfig {
    readonly defaultRoute: string;
    readonly unauthorizedRoute: string;
    readonly defaultLanguage?: string;
}

export enum ClientState {
    None,
    Init,
    Ready
}

export abstract class Client {
    public static readonly rootViewController = new ViewController('root');
    public static readonly messageViewController = new MessageViewController(new Foundation.Fifo());

    public static session = new Session();

    private static _config: ClientConfig;
    private static _state = ClientState.None;
    private static _translator: Foundation.Translator;
    private static _router: Router;

    public static get title(): string { return document.title; }
    public static set title(value: string) { document.title = value; }

    public static get state(): ClientState { return this._state; }
    public static get translator(): Foundation.Translator { return this._translator; }
    public static get router(): Router { return this._router; }

    public static async init(routes: readonly RouterRoute[], config: ClientConfig) {
        if (ClientState.None != this._state)
            throw new Error('client is already initialized');

        this._config = config;
        this._state = ClientState.Init;

        window.addEventListener('unhandledrejection', event => this.messageViewController.push({
            title: this._translator && this._translator.translate('error') || 'Error',
            text: event.reason
        }));

        const translation = await this.loadTranslation(config.defaultLanguage || DEFAULT_LANGUAGE);
        const messagePopupViewController = new PopupViewController('message');

        this._translator = new Foundation.Translator(translation);

        this._router = new Router(...routes);
        this._router.onRouteChanged.on(route => this.handleChangedRoute(route));

        this.session.onAccessChanged.on(access => this.handleChangedAccess(access));

        this.messageViewController.onMessage.on(() => messagePopupViewController.view.visible = this.messageViewController.parent == messagePopupViewController);
        this.messageViewController.onDone.on(() => messagePopupViewController.view.visible = false);

        messagePopupViewController.appendChild(this.messageViewController);
        messagePopupViewController.view.visible = false;

        this.rootViewController.appendChild(messagePopupViewController);
        this.rootViewController.init();

        document.body.appendChild((this.rootViewController.view as any)._node);
        (window as any).client = this;

        if (document.readyState === "complete")
            await this.handleLoaded();
        else
            window.addEventListener('load', () => this.handleLoaded());
    }

    private static async handleLoaded() {
        this.session.init();
        this._router.init();

        this._state = ClientState.Ready;

        await this.rootViewController.update();
    }

    private static handleChangedRoute(route?: Route) {
        if (!route)
            return this._router.changeRoute(this._config.defaultRoute);

        if (route.isPrivate && !this.session.access)
            return this._router.changeRoute(this._config.unauthorizedRoute);
    }

    private static handleChangedAccess(access?: Foundation.Access) {
        if (this._router.route.isPrivate && !access)
            return this._router.changeRoute(this._config.defaultRoute);
    }

    private static async loadTranslation(defaultLanguage: string): Promise<NodeJS.ReadOnlyDict<string>> {
        try {
            return await new Request<NodeJS.ReadOnlyDict<string>, void>(`/${navigator.language}.json`, JSON.parse).send();
        } catch (e) {
            return await new Request<NodeJS.ReadOnlyDict<string>, void>(`/${defaultLanguage}.json`, JSON.parse).send();
        }
    }
}