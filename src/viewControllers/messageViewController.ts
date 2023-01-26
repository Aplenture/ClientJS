import * as Foundation from "foundationjs";
import { Client, ViewController } from "../utils";
import { Button, Label } from "../views";

export class MessageViewController extends ViewController {
    public readonly onMessage = new Foundation.Event<MessageViewController, Foundation.Message>();
    public readonly onDone = new Foundation.Event<MessageViewController, void>();

    public readonly titleLabel = new Label('title');
    public readonly textLabel = new Label('text');
    public readonly doneButton = new Button('done');

    constructor(private readonly _stack: Foundation.Stack<Foundation.Message>, ...classes: readonly string[]) {
        super(...classes, 'message');
    }

    public init() {
        this.view.appendChild(this.titleLabel);
        this.view.appendChild(this.textLabel);
        this.view.appendChild(this.doneButton);

        this.doneButton.text = Client.translator.translate('done');
        this.doneButton.onClick.on(() => this.next());

        super.init();
    }

    public push(message: Foundation.Message): Promise<void> {
        this._stack.push(message);

        if (1 == this._stack.count)
            this.next();

        return new Promise<void>(resolve => this.onDone.once(resolve));
    }

    public next() {
        const message = this._stack.pop();

        this.titleLabel.text = message && message.title || "";
        this.textLabel.text = message && message.text || "";

        if (message)
            this.onMessage.emit(this, message);
        else
            this.onDone.emit(this);
    }
}