import * as Foundation from "foundationjs";

export class View {
    public readonly onClick = new Foundation.Event<View, void>();

    public propaginateClickEvents = false;

    private readonly _node = document.createElement('div');
    private readonly _children: View[] = [];

    private _parent: View;

    constructor(...classes: readonly string[]) {
        classes.forEach(c => this._node.classList.add(c));

        this._node.id = classes.join('_');
        this._node.addEventListener('mousedown', event => event.detail > 1 && event.preventDefault(), false);
        this._node.addEventListener('click', event => {
            this.onClick.emit(this);

            if (!this.propaginateClickEvents)
                event.stopPropagation();
        });
    }

    public get id(): string { return this._node.id; }
    public get parent(): View { return this._parent; }
    public get children(): readonly View[] { return this._children; }

    public get hidden(): boolean { return this._node.hidden; }
    public set hidden(value: boolean) { this._node.hidden = value; }

    public get visible(): boolean { return !this.hidden; }
    public set visible(value: boolean) { this.hidden = !value; }

    public get enabled(): boolean { return !this.disabled; }
    public set enabled(value: boolean) { this.disabled = !value; }

    public get disabled(): boolean { return this._node.classList.contains('disabled'); }
    public set disabled(value: boolean) {
        if (value)
            this._node.classList.add('disabled');
        else
            this._node.classList.remove('disabled');
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

    public focus() {
        this._node.focus();
        this.children.forEach(child => child.focus());
    }

    public click() {
        this.onClick.emit(this);
    }

    public addClass(value: string) {
        this._node.classList.add(value);
    }

    public removeClass(value: string) {
        this._node.classList.remove(value);
    }

    public appendChild(child: View) {
        if (child.parent)
            child.parent.removeChild(child);

        child._parent = this;

        this._node.appendChild(child._node);
        this._children.push(child);
    }

    public removeChild(child: View) {
        this._node.childNodes.forEach((node, index) => {
            if (node !== child._node)
                return;

            this._node.removeChild(child._node);
            this._children.splice(index, 1);

            child._parent = null;
        });
    }

    public removeAllChildren() {
        this._node.childNodes.forEach(node => this._node.removeChild(node));

        this._children.forEach(child => child._parent = null);
        this._children.splice(0, this._children.length);
    }

    public removeFromParent() {
        if (!this._parent)
            return;

        this._parent.removeChild(this);
    }
}