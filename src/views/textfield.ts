import * as Foundation from "foundationjs";
import { View } from "../utils";

export class Textfield extends View {
    public readonly onReturn = new Foundation.Event<Textfield, void>();
    public readonly onChange = new Foundation.Event<Textfield, string>();

    protected readonly label = document.createElement('label');
    protected readonly input = document.createElement('input');

    constructor(...classes: readonly string[]) {
        super(...classes, 'textfield');

        this.div.appendChild(this.label);
        this.div.appendChild(this.input);

        this.input.type = 'text';

        this.input.addEventListener("keydown", event => {
            if (event.key != 'Enter')
                return;

            event.preventDefault();
            this.onReturn.emit(this);
        });

        this.input.addEventListener("input", (event: InputEvent) => this.onChange.emit(this, event.data));
    }

    public get title(): string { return this.label.innerText; }
    public set title(value: string) { this.label.innerText = value; }

    public get text(): string { return this.input.value; }
    public set text(value: string) { this.input.value = value; }

    public get placeholder(): string { return this.input.placeholder; }
    public set placeholder(value: string) { this.input.placeholder = value; }

    public get selectionStart() { return this.input.selectionStart; }
    public get selectionRange() { return this.input.selectionEnd - this.input.selectionStart; }

    public focus() {
        this.input.focus();
    }

    public selectRange(start?: number, end = this.text.length) {
        this.input.setSelectionRange(start, end);
    }
}