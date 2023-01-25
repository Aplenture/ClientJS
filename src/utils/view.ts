import * as Foundation from "foundationjs";
import { Node } from "./node";

export class View extends Node<'div'> {
    public readonly onClick = new Foundation.Event<View, void>();

    public propaginateClickEvents = false;

    constructor(...classes: readonly string[]) {
        super('div', ...classes, 'view');

        this._node.addEventListener('mousedown', event => event.detail > 1 && event.preventDefault(), false);
        this._node.addEventListener('click', event => {
            this.onClick.emit(this);

            if (!this.propaginateClickEvents)
                event.stopPropagation();
        });
    }

    public get selected(): boolean { return this._node.classList.contains('selected'); }
    public set selected(value: boolean) {
        if (value)
            this._node.classList.add('selected');
        else
            this._node.classList.remove('selected');
    }

    public get clickable(): boolean { return this._node.classList.contains('clickable'); }
    public set clickable(value: boolean) {
        if (value)
            this._node.classList.add('clickable');
        else
            this._node.classList.remove('clickable');
    }

    public click() {
        this.onClick.emit(this);
    }
}