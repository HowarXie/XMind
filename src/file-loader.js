let bills = [];
const categories = new Map();
const fileInputEl = document.querySelector("#fileInput");

fileInputEl.addEventListener("change", function () {
    const fileList = Array.from(this.files);

    Promise.all(fileList.map(readeFileAsText))
        .then(texts => texts.map(parseCSVFile))
        .then(fileObjs => getBills(fileObjs))
})

function getBills(fileObjs) {
    const billFields = ["type", "time", "category", "amount"];
    const categoryFields = ["id", "type", "name"];

    fileObjs.forEach(objs => {
        if (!objs.length) return;

        const obj = objs[0];

        if (billFields.every(field => obj.hasOwnProperty(field))) {
            bills = objs.map(o => {
                const date = new Date();
                date.setTime(o.time);

                return {
                    type: o.type,
                    time: date.toISOString(),
                    category: o.category,
                    amount: o.amount.toFixed(2)
                }
            })
        }

        if (categoryFields.every(field => obj.hasOwnProperty(field))) {
            objs.forEach(o => categories.set(o.id, o.name));
        }
    })

    if (bills.length && categories.size) {
        bills.forEach(bill => {
            bill.category = categories.get(bill.category) ?? bill.category;
        })

        eventEmitter.emit(BILL_FILE_LOADED, bills);
    }
}