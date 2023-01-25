import { Node, View } from "../utils";

export class Label extends View {
    protected readonly _label = new Node('span', 'label');

    constructor(...classes: readonly string[]) {
        super('span', ...classes, 'label');

        this.appendChild(this._label as any);
    }

    public get text(): string { return (this._label as any)._node.text; }
    public set text(value: string) { (this._label as any)._node.text = value; }
}