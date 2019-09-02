import { ILog } from './router';

export default class Logger {
    public logger: ILog;
    constructor(logger: ILog| boolean | undefined) {
        if (logger === false) {
            this.logger = {
                debug: (...args) => {},
                info: (...args) => {},
                error: (...args) => {},
            }
        } else if (logger === undefined || logger === true) {
            this.logger = console;
        } else {
            this.logger = logger;
        }
    }
    info(...args) {
        return this.logger.info(...args);
    }
    debug(...args) {
        return this.logger.debug(...args);
    }
    error(...args) {
        return this.logger.error(...args);
    }
    log(...args) {
        return this.logger.info(...args);
    }
}