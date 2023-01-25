import * as Foundation from "foundationjs";
import { ViewController } from "./viewController";
import { MessageViewController, PopupViewController } from "../viewControllers";
import { JSONRequest } from "../requests";

const DEFAULT_LANGUAGE = "en";

interface ClientConfig {
    readonly defaultLanguage?: string;
}

export abstract class Client {
    public static readonly rootViewController = new ViewController('root');
    public static readonly messageViewController = new MessageViewController(new Foundation.Fifo());

    public static translator: Foundation.Translator;

    public static get title(): string { return document.title; }
    public static set title(value: string) { document.title = value; }

    public static async init(config: ClientConfig) {
        window.addEventListener('unhandledrejection', event => this.messageViewController.push({
            title: this.translator && this.translator.translate('error') || 'Error',
            text: event.reason
        }));

        const translation = await this.loadTranslation(config.defaultLanguage || DEFAULT_LANGUAGE);
        const messagePopupViewController = new PopupViewController('message');

        this.translator = new Foundation.Translator(translation);

        this.messageViewController.onMessage.on(() => messagePopupViewController.view.visible = this.messageViewController.parent == messagePopupViewController);
        this.messageViewController.onDone.on(() => messagePopupViewController.view.visible = false);

        this.rootViewController.appendChild(messagePopupViewController);
        this.rootViewController.init();

        messagePopupViewController.appendChild(this.messageViewController);
        messagePopupViewController.view.visible = false;

        document.body.appendChild((this.rootViewController.view as any)._node);
    }

    private static async loadTranslation(defaultLanguage: string): Promise<NodeJS.ReadOnlyDict<string>> {
        try {
            return await new JSONRequest<NodeJS.ReadOnlyDict<string>, void>(`/${navigator.language}.json`).send();
        } catch (e) {
            return await new JSONRequest<NodeJS.ReadOnlyDict<string>, void>(`/${defaultLanguage}.json`).send();
        }
    }
}