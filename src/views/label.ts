import * as Aplenture from "aplenturejs";
import { View } from "../utils";

export class Label extends View {
    protected readonly label = document.createElement('label');

    constructor(...classes: readonly string[]) {
        super(...classes, 'label');

        this.div.appendChild(this.label);
    }

    public get text(): string { return this.label.innerText; }
    public set text(value: string) { this.label.innerText = Aplenture.Localization.translate(value); }
}