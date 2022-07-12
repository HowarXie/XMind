const gridEl = document.querySelector("#grid");
const mouthEl = document.querySelector("#mouth");
const categoryEl = document.querySelector("#category");
const dialogCategoryEl = document.querySelector("#dialogCategory");
const incomeEl = document.querySelector("#income");
const expensesEl = document.querySelector("#expenses");
const canvasEl = document.querySelector("#canvas");

let grid;
let chart;
const conditions = {
    mouth: "all",
    category: "all"
}

// render bill table if bill data loaded
eventEmitter.on(BILL_FILE_LOADED, () => {
    const filteredBills = filterBills(bills);
    const gridOptions = {
        cloumnDefs: [
            {
                field: "time",
                label: "时间"
            },
            {
                field: "type",
                label: "类型"
            },
            {
                field: "category",
                label: "分类"
            },
            {
                field: "amount",
                label: "数量"
            }
        ],
        rowData: filteredBills
    }

    grid = new HGrid(gridEl, gridOptions);
    insertCategoryOptions(bills);
    calcAndUpdateAmount(filteredBills);
    chart = new Chart(canvasEl);
    drawExpensesChart();
})

mouthEl.addEventListener("change", ev => {
    conditions.mouth = ev.target.value;
    updateGrid();
    drawExpensesChart();
})

categoryEl.addEventListener("change", ev => {
    conditions.category = ev.target.value;
    updateGrid();
})

function updateGrid() {
    if (grid) {
        const filteredBills = filterBills(bills)
        grid.setRowData(filteredBills);
        calcAndUpdateAmount(filteredBills);
    }
}

function filterBills(bills) {
    let filtered = bills;

    if (conditions.mouth !== "all") {
        filtered = filtered.filter(bill => {
            const date = new Date(bill.time);
            return date.getMonth() === +conditions.mouth;
        })
    }

    if (conditions.category !== "all") {
        filtered = filtered.filter(bill => bill.category === conditions.category);
    }

    return filtered;
}

function calcAndUpdateAmount(filteredBills) {
    let sum = filteredBills.filter(bill => bill.type === 1).reduce((pre, cur) => pre + (+cur.amount), 0);
    incomeEl.innerText = sum.toFixed(2);

    sum = filteredBills.filter(bill => bill.type === 0).reduce((pre, cur) => pre + (+cur.amount), 0);
    expensesEl.innerText = sum.toFixed(2);
}


function drawExpensesChart() {
    if (chart) {
        chart.draw(countExpenses());
    }
}

// count expenses by mouth and category
function countExpenses() {
    let filtered = bills.filter(bill => bill.type === 0);

    if (conditions.mouth !== "all") {
        filtered = filtered.filter(bill => {
            const date = new Date(bill.time);
            return date.getMonth() === +conditions.mouth;
        })
    }

    const countRes = new Map();

    for (const bill of filtered) {
        if (countRes.has(bill.category)) {
            countRes.get(bill.category).value += (+bill.amount);
        } else {
            countRes.set(bill.category, {
                value: +bill.amount,
                label: bill.category
            });
        }
    }

    return Array.from(countRes.values()).sort((a, b) => a.value - b.value);
}

function insertCategoryOptions(bills) {
    const categories = new Set(bills.map(b => b.category));

    for (const category of categories) {
        const optionEl = document.createElement("option");
        optionEl.setAttribute("value", category);
        optionEl.innerText = category;
        categoryEl.appendChild(optionEl);
        dialogCategoryEl.appendChild(optionEl.cloneNode(true));
    }
}

//#region add new bill
const popupEl = document.querySelector("#popup");

function showAddDialog() {
    if (!grid) return;

    popupEl.style.display = "flex";
}

function cancelAdd() {
    popupEl.style.display = "none";
}

function addBill(ev) {
    const typeInputEls = document.querySelectorAll("input[name='type']");
    let type = 1;
    for (const el of typeInputEls) {
        if (el.checked) {
            type = +el.value;
            break;
        }
    }

    const newBill = {
        type: type,
        time: new Date().toISOString(),
        category: document.querySelector("#dialogCategory").value,
        amount: (+document.querySelector("#amount").value).toFixed(2),
    }
    bills.push(newBill);

    cancelAdd();
    updateGrid();
    drawExpensesChart();
}
//#endregion