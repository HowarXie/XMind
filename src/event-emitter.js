class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(ev, fn) {
        if (this.events.has(ev)) {
            const fns = this.events.get(ev);
            const index = fns.findIndex(f => f === fn);

            if (index === -1) {
                fns.push(fn);
            }
        } else {
            this.events.set(ev, [fn]);
        }

        const destory = () => {
            const fns = this.events.get(ev);
            const index = fns.findIndex(f => f === fn);
            fns.splice(index, 1);

            if (fns.length === 0) {
                this.events.delete(ev);
            }
        };

        return destory;
    }

    emit(ev, ...args) {
        if (this.events.has(ev)) {
            const fns = this.events.get(ev);

            fns.forEach(fn => {
                fn(...args);
            });
        }
    }
}

const eventEmitter = new EventEmitter();
const BILL_FILE_LOADED = "billFileLoaded";