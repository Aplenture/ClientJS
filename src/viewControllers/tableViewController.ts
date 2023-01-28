import * as Foundation from "foundationjs";
import { View, ViewController } from "../utils";

export enum TableViewControllerSelectionMode {
    None,
    Clickable,
    Single,
    Multiple
}

export interface TableViewControllerSource<TCell extends View> {
    numberOfCategories?(): number;
    numberOfCells(category: number): number;
    createHeader(): View;
    createCategory?(index: number): View | null;
    createCell(category: number): TCell;
    updateCell(cell: TCell, row: number, category: number): void;
}

export class TableViewController<TCell extends View> extends ViewController {
    public static readonly onSelected = new Foundation.Event<TableViewController<any>, number>();
    public static readonly onDeselected = new Foundation.Event<TableViewController<any>, number>();

    private _header: View;

    private readonly _cells: TCell[] = [];
    private readonly _selectedRows: number[] = [];

    private _selectionMode = TableViewControllerSelectionMode.None;

    constructor(public source: TableViewControllerSource<TCell>, ...classes: string[]) {
        super(...classes);
    }

    public get header(): View { return this._header; }

    public get cells(): readonly TCell[] { return this._cells; }
    public get selectedRows(): readonly number[] { return this._selectedRows; }

    public get selectionMode(): TableViewControllerSelectionMode { return this._selectionMode; }
    public set selectionMode(value: TableViewControllerSelectionMode) {
        this._selectionMode = value;
        this.cells.forEach(cell => cell.clickable = value != TableViewControllerSelectionMode.None);
    }

    public get alternatingBackgroundColor(): boolean { return this.view.hasClass('alternatingBackgroundColor'); }
    public set alternatingBackgroundColor(value: boolean) {
        if (value)
            this.view.addClass('alternatingBackgroundColor');
        else
            this.view.removeClass('alternatingBackgroundColor');
    }

    public async update(): Promise<void> {
        this.render();

        await super.update();
    }

    public async render(): Promise<void> {
        const numCategories = this.source.numberOfCategories && this.source.numberOfCategories() || 1;

        this._header = this.source.createHeader();

        this._cells.splice(0, this._cells.length);

        this.deselectAllRows();

        this.view.removeAllChildren();
        this.view.appendChild(this._header);

        for (let i = 0; i < numCategories; ++i) {
            const numCells = this.source.numberOfCells(i);
            const category = this.source.createCategory && this.source.createCategory(i);

            if (category) {
                if (!category.hasClass('category'))
                    category.addClass('category');

                this.view.appendChild(category);
            }

            for (let j = 0; j < numCells; ++j) {
                const cell = this.reuseCell(i);

                if (!cell.hasClass('cell'))
                    cell.addClass('cell');

                this.source.updateCell(cell, j, i);

                this.view.appendChild(cell);
                this._cells.push(cell);
            }
        }
    }

    public isRowSelected(row: number): boolean {
        return -1 != this._selectedRows.indexOf(row);
    }

    public deselectAllRows(): void {
        if (!this._selectedRows.length)
            return;

        this._cells.forEach(child => child.selected = false);

        this._selectedRows.forEach(index => TableViewController.onDeselected.emit(this, index));
        this._selectedRows.splice(0, this._selectedRows.length);
    }

    public deselectRow(row: number): void {
        const index = this._selectedRows.indexOf(row);

        if (- 1 == index)
            return;

        this._cells[row].selected = false;
        this._selectedRows.splice(index, 1);
        TableViewController.onDeselected.emit(this, row);
    }

    public selectRow(row: number): void {
        if (this._selectionMode == TableViewControllerSelectionMode.None)
            return;

        if (this.isRowSelected(row))
            return;

        if (this._selectionMode == TableViewControllerSelectionMode.Single)
            this.deselectAllRows();

        if (this._selectionMode != TableViewControllerSelectionMode.Clickable) {
            this._cells[row].selected = true;

            if (!this._selectedRows.includes(row))
                this._selectedRows.push(row);
        }

        TableViewController.onSelected.emit(this, row);
    }

    public cellIndex(cell: TCell): number {
        return this._cells.indexOf(cell);
    }

    private reuseCell(category: number): TCell {
        const cell = this.source.createCell(category);

        cell.clickable = this._selectionMode != TableViewControllerSelectionMode.None;

        View.onClick.on(() => {
            if (this._selectionMode == TableViewControllerSelectionMode.None)
                return;

            const row = this.cellIndex(cell);

            if (this.isRowSelected(row))
                this.deselectRow(row);
            else
                this.selectRow(row);
        }, { sender: cell });

        return cell;
    }
}