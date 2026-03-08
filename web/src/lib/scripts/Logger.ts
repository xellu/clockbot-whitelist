const COLORS = {
    info: "#44b2f4",
    ok: "#b2d942 ",
    warn: "#ffa01b ",
    error: "#ff0546 ",
    debug: "#eb44f4"
}

class Logger {
    private prefix: string;
    private _debug: boolean;

    constructor(prefix: string, debug?: boolean) {
        this.prefix = prefix.toLocaleUpperCase();
        this._debug = debug || false;
    }

    log(message: string) {
        console.log(`%c[${this.prefix}] %c${message}`, `color: ${COLORS.info}`, "color: #fff");
    }

    ok(message: string) {
        console.log(`%c[${this.prefix}] %c${message}`, `color: ${COLORS.ok}`, "color: #fff");
    }
    success(message: string) { this.ok(message); }

    warn(message: string) {
        console.warn(`%c[${this.prefix}] %c${message}`, `color: ${COLORS.warn}`, "color: #fff");
    }
    warning(message: string) { this.warn(message); }

    error(message: string) {
        console.error(`%c[${this.prefix}] %c${message}`, `color: ${COLORS.error}`, "color: #fff");
    }
    fail(message: string) { this.error(message); }
    fatal(message: string) { this.error(message); }

    debug(message: string) {
        if (this._debug) {
            console.log(`%c[${this.prefix}] %c${message}`, `color: ${COLORS.debug}`, "color: #fff");
        }
    }
}

export { Logger };