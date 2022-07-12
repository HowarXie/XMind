class Comp {
    el;

    constructor() {

    }

    queryByRef(ref) {
        return this.el?.querySelector(`[ref=${ref}]`);
    }
}

const H_GRID_TEMP = `<table class="h-grid">
    <thead class="h-grid-header" ref="headRef"></thead>
    <tbody class="h-grid-body" ref="bodyRef"></tbody>
</table>`;

class HGrid extends Comp {
    headEl;
    bodyEl;

    constructor(el, options) {
        super();
        this.el = el;
        this.options = options;
        this.render();
    }

    render() {
        if (!this.el) {
            throw new Error("Elment error");
        }

        this.el.innerHTML = H_GRID_TEMP;
        this.headEl = this.queryByRef("headRef");
        this.bodyEl = this.queryByRef("bodyRef");

        if (this.options?.cloumnDefs) {
            this.renderHead();

            if (this.options?.rowData) {
                this.renderBody();
            }
        }
    }

    renderHead() {
        const headTrEL = new HGridRow(null, []);
        this.headEl.appendChild(headTrEL.el);

        this.options.cloumnDefs.forEach(cloumnDef => {
            const header = new HGridHeader(cloumnDef);
            headTrEL.el.appendChild(header.el);
        });
    }

    renderBody() {
        this.bodyEl.innerHTML = "";
        this.options.rowData.forEach(data => {
            const row = new HGridRow(data, this.options.cloumnDefs);
            this.bodyEl.appendChild(row.el);
        })
    }

    insertRows(data) {
        data.forEach(d => {
            const row = new HGridRow(d, this.options.cloumnDefs);
            this.bodyEl.appendChild(row.el);
        })
    }

    setRowData(data) {
        this.options.rowData = data;
        this.renderBody();
    }
}

class HGridHeader extends Comp {
    constructor(cloumnDef) {
        super();
        this.options = cloumnDef;
        this.render();
    }

    render() {
        this.el = document.createElement("th");
        this.el.innerText = this.options?.label || this.options?.field;
        this.el.classList.add("h-grid-header");
    }
}

class HGridRow extends Comp {
    constructor(data, cloumnDefs) {
        super();
        this.data = data;
        this.render(cloumnDefs);
    }

    render(cloumnDefs) {
        this.el = document.createElement("tr");
        this.el.classList.add("h-grid-row");
        cloumnDefs.forEach(cloumnDef => {
            const col = new HGridCol(this.data[cloumnDef.field]);
            this.el.appendChild(col.el);
        })
    }
}

class HGridCol extends Comp {
    constructor(data) {
        super();
        this.data = data;

        this.render();
    }

    render() {
        this.el = document.createElement("td");
        this.el.classList.add("h-grid-col");
        this.el.innerText = this.data;
    }
}