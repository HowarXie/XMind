function parseStr(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
}

function readeFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            resolve(ev.target.result);
        };
        reader.onerror = reject;
        reader.readAsText(file);
    })
}

function parseCSVFile(content) {
    const fileRows = content.split("\n");
    if (!fileRows.length) return [];

    const res = [];
    const splitChar = ',';
    const headers = fileRows[0].split(splitChar);

    for (let i = 1; i < fileRows.length; i++) {
        const fileCols = fileRows[i].split(splitChar);
        const obj = new Object();

        headers.forEach((header, index) => {
            obj[header] = parseStr(fileCols[index]);
        });

        res.push(obj);
    }

    return res;
}