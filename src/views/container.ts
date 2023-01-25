import { Node, View } from "../utils";

export class Container extends View {
    public readonly contentView = new View('content');

    constructor(...classes: string[]) {
        super(...classes, 'container');

        super.appendChild(this.contentView);
    }

    public get children(): readonly Node<'div'>[] { return this.contentView.children; }
    public get firstChild(): Node<'div'> { return this.contentView.firstChild; }
    public get lastChild(): Node<'div'> { return this.contentView.lastChild; }

    public focus() {
        this.contentView.focus();
    }

    public appendChild(controller: View): void {
        this.contentView.appendChild(controller);
    }

    public removeChild(controller: View): void {
        this.contentView.removeChild(controller);
    }

    public removeAllChildren(): void {
        this.contentView.removeAllChildren();
    }
}