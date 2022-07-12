class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class Chart {
    constructor(canvasEl) {
        this.ctx = canvasEl.getContext("2d");
        this.padding = {
            top: 10,
            right: 20,
            bottom: 20,
            left: 20
        };
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        this.arrowSize = 4; // arrow size
        this.topGap = 5;
        this.color = "#fb4747";
        this.text = {
            color: "#333",
            size: 10,
            gap: 3
        }
    }

    /*
    interface data {
        value: number;
        label: string;
    }
    */
    draw(data) {
        this.clear();
        this.drawXAxis();
        this.drawYAxis();
        this.drawNodes(data);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawXAxis() {
        const start = new Point(this.padding.left, this.height - this.padding.bottom);
        const end = new Point(this.width - this.padding.right, this.height - this.padding.bottom);

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.moveTo(end.x - this.arrowSize, end.y - this.arrowSize);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.moveTo(end.x - this.arrowSize, end.y + this.arrowSize);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawYAxis() {
        const start = new Point(this.padding.left, this.height - this.padding.bottom);
        const end = new Point(this.padding.left, this.padding.top);

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.moveTo(end.x - this.arrowSize, end.y + this.arrowSize);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.moveTo(end.x + this.arrowSize, end.y + this.arrowSize);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawNodes(data) {
        if (!data || !data.length) {
            return;
        }

        const gap = (this.width - this.padding.left - this.padding.right) / (data.length * 2 + 1);
        const maxHeight = this.height - this.padding.top - this.padding.bottom - this.topGap;
        const maxValue = Math.max.apply(this, data.map(d => d.value));

        this.ctx.save();
        this.ctx.fillStyle = this.color;

        for (let i = 0; i < data.length; i++) {
            const start = new Point();
            start.x = gap * (i * 2 + 1) + this.padding.left;
            const height = data[i].value / maxValue * maxHeight;
            start.y = this.height - this.padding.bottom - height;
            this.ctx.fillRect(start.x, start.y, gap, height);

            this.drawLabel(data[i].label, start.x + gap / 2, this.height - this.padding.bottom + this.text.gap, "top");
            this.drawLabel(data[i].value, start.x + gap / 2, start.y - this.text.gap);
        }

        this.ctx.restore();
    }

    drawLabel(label, x, y, baseline = "bottom") {
        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = baseline;
        this.ctx.fillStyle = this.text.color;
        this.ctx.font = `${this.text.size}px`;
        this.ctx.fillText(label, x, y);
        this.ctx.restore();
    }
}