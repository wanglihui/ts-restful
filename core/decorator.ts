/**
 * Created by wlh on 2017/8/28.
 */

'use strict';

import fs = require("fs")
import path = require("path");

const controllers = {};
export function getControllers() {
    return controllers;
}

export function Router(url: string, method?: string) {
    return function(target, propertyKey, desc) {
        let fn = desc.value;
        fn.$url = url;
        fn.$method = method || 'GET';
    }
}

export function Restful(mountUrl?: string) {
    return function(target) {
        target.prototype.$isValidId = target.prototype.$isValidId || function(id) {
            return /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/.test(id.toString());
        };

        if (!mountUrl) {
            mountUrl = '/' + target.name.replace(/Controller/, '').toLowerCase();
        }
        controllers[mountUrl] = target;
    }
}

export function scannerControllers(dir: string, ignores?: string[]) {
    let files = fs.readdirSync(dir);
    for(let f of files) {
        let extReg = /\.ts|\.js$/;
        if (ignores && ignores.indexOf(f.replace(extReg, '')) >= 0) {
            continue;
        }
        let p = path.join(dir, f);
        let stat = fs.statSync(p);
        if (stat.isDirectory()) {
            scannerControllers(p);
            continue;
        }
        if (!extReg.test(p)) {
            continue;
        }
        p = p.replace(extReg, '');
        require(p);
    }
}