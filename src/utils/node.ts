export class Node<T extends keyof HTMLElementTagNameMap> {
    protected readonly _node: HTMLElementTagNameMap[T];
    private readonly _children: Node<T>[] = [];

    private _parent: Node<T>;

    constructor(tagName: T, ...classes: readonly string[]) {
        this._node = document.createElement(tagName);

        classes.forEach(c => this._node.classList.add(c));

        this._node.id = classes.join('_');
    }

    public get id(): string { return this._node.id; }
    public get parent(): Node<T> { return this._parent; }

    public get children(): readonly Node<T>[] { return this._children; }
    public get firstChild(): Node<T> { return this._children.length ? this._children[0] : null; }
    public get lastChild(): Node<T> { return this._children.length ? this._children[this._children.length - 1] : null; }

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

    public focus() {
        this._node.focus();
        this.children.forEach(child => child.focus());
    }

    public addClass(value: string) {
        this._node.classList.add(value);
    }

    public removeClass(value: string) {
        this._node.classList.remove(value);
    }

    public appendChild(child: Node<T>) {
        if (child.parent)
            child.parent.removeChild(child);

        child._parent = this;

        this._node.appendChild(child._node);
        this._children.push(child);
    }

    public removeChild(child: Node<T>) {
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