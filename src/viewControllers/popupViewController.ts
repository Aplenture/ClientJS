import { ViewController } from "../utils";
import { Container } from "../views";

export class PopupViewController extends ViewController {
    public readonly contentView = new Container('content');

    public autoHide = true;

    constructor(...classes: readonly string[]) {
        super(...classes, 'popup');
    }

    public init(): void {
        this.view.appendChild(this.contentView);
        this.view.onClick.on(() => this.autoHide && this.removeFromParent());

        super.init();
    }
}