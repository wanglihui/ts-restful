/**
 * Created by wlh on 2017/11/14.
 */

'use strict';

export interface ConfigInterface {
    signKey: string;
}

const config:ConfigInterface = {
    signKey: null,
}

export function initConfig(c: ConfigInterface) {
    config = c;
}

export function getConfig() {
    return config;
}