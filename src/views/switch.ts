import * as Foundation from "foundationjs";
import { View } from "../utils";

export class Switch extends View {
    public static readonly onChange = new Foundation.Event<Switch, boolean>();

    protected readonly label = document.createElement('label');
    protected readonly input = document.createElement('input');

    constructor(...classes: readonly string[]) {
        super(...classes, 'switch');

        const label = document.createElement('label');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');

        this.input.type = 'checkbox';
        this.input.addEventListener('change', () => Switch.onChange.emit(this, this.input.checked));

        label.appendChild(this.input);
        label.appendChild(span1);

        span1.appendChild(span2);

        this.div.appendChild(this.label);
        this.div.appendChild(label);
    }

    public get title(): string { return this.label.innerText; }
    public set title(value: string) { this.label.innerText = Foundation.Localization.translate(value); }

    public get enabled(): boolean { return this.input.checked; }
    public set enabled(value: boolean) { this.input.checked = value; }

    public get value(): boolean { return this.input.checked; }
    public set value(value: boolean) { this.input.checked = value; }

    public focus() {
        this.input.focus();
    }
}