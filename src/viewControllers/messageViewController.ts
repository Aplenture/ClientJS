import * as Foundation from "foundationjs";
import { ViewController } from "../utils";
import { Button, Label } from "../views";

export class MessageViewController extends ViewController {
    public static readonly onMessage = new Foundation.Event<MessageViewController, Foundation.Message>();
    public static readonly onDone = new Foundation.Event<MessageViewController, void>();

    public readonly titleLabel = new Label('title');
    public readonly textLabel = new Label('text');
    public readonly doneButton = new Button('done');

    private readonly stack = new Foundation.Fifo<Foundation.Message>();

    private currentMessage: Foundation.Message;

    constructor(...classes: readonly string[]) {
        super(...classes, 'message');
    }

    public init() {
        this.view.appendChild(this.titleLabel);
        this.view.appendChild(this.textLabel);
        this.view.appendChild(this.doneButton);

        this.doneButton.text = '#_done';

        Button.onClick.on(() => this.next(), { sender: this.doneButton });

        super.init();
    }

    public push(message: Foundation.Message): Promise<void> {
        this.stack.push(message);

        if (!this.currentMessage)
            this.next();

        return new Promise<void>(resolve => MessageViewController.onDone.once(resolve, { sender: this }));
    }

    public next() {
        this.currentMessage = this.stack.pop();

        this.titleLabel.text = this.currentMessage && this.currentMessage.title || "";
        this.textLabel.text = this.currentMessage && this.currentMessage.text || "";

        if (this.currentMessage)
            MessageViewController.onMessage.emit(this, this.currentMessage);
        else
            MessageViewController.onDone.emit(this);
    }
}