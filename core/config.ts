/**
 * Created by wlh on 2017/11/14.
 */

'use strict';

import sign from "./sign";

export interface ConfigInterface {
    signKey?: string;
    sign?: (data: any, key: string) => string;
}

let config:ConfigInterface = {
    signKey: null,
    sign: sign,
}

export function setConfig(c: ConfigInterface) {
    if (c.signKey) {
        config.signKey = c.signKey;
    }
    if (c.sign && typeof c.sign == 'function') {
        config.sign = c.sign;
    }
}

export function getConfig() {
    return config;
}