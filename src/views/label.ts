import { View } from "../utils";

export class Label extends View {
    protected readonly _label = document.createElement('span');

    constructor(...classes: readonly string[]) {
        super(...classes, 'label');

        this._label.classList.add('label');
        this._label.id = classes.join('_');

        (this as any)._node.appendChild(this._label);
    }

    public get text(): string { return this._label.innerText; }
    public set text(value: string) { this._label.innerText = value; }
}