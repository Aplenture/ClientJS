import * as Foundation from "foundationjs";
import { View } from "../utils";

export class TitledLabel extends View {
    protected readonly titleLabel = document.createElement('label');
    protected readonly valueLabel = document.createElement('label');

    constructor(...classes: readonly string[]) {
        super(...classes, 'titled', 'label');

        this.div.appendChild(this.titleLabel);
        this.div.appendChild(this.valueLabel);
    }

    public get title(): string { return this.titleLabel.innerText; }
    public set title(value: string) { this.titleLabel.innerText = Foundation.Localization.translate(value); }

    public get text(): string { return this.valueLabel.innerText; }
    public set text(value: string) { this.valueLabel.innerText = Foundation.Localization.translate(value); }
}