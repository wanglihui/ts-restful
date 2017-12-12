/**
 * Created by wlh on 2017/8/29.
 */

'use strict';
import {getControllers} from "../decorator";
import express = require("express");
import _ = require("lodash");

export interface RegisterControllerOptions {
    isShowUrls?: boolean;
    urlsPath?: string;
    kebabCase?: boolean; //default false
}

export function registerControllerToRouter(router: express.Router, options?: RegisterControllerOptions) {
    let controllers = getControllers();
    let urls = [];
    for (let url in controllers) {
        
        let Controller = controllers[url];
        let methods = getAllMethods(Controller);

        if (options.kebabCase) {
            url = _.kebabCase(url);
        }

        let cls = new Controller();
        if (cls.$before && typeof cls.$before == 'function') {
            router.use(url, wrapNextFn.bind(cls)(cls.$before));
        }

        methods = methods.filter((fnName) => {
            return ['get', 'update', 'delete', 'add', 'find'].indexOf(fnName) >= 0
                || (typeof cls[fnName] == 'function' && cls[fnName].$url )
        });

        methods.forEach( (fnName) => {
            let curUrl = url;
            let method = 'get';

            if (fnName == 'get') {
                curUrl += '/:id'
            }

            if (fnName == 'update') {
                curUrl += '/:id';
                method = 'put';
            }

            if (fnName == 'delete') {
                curUrl += '/:id';
                method = 'delete';
            }

            if (fnName == 'add') {
                method = 'post';
            }

            let fn = cls[fnName];
            if (fn.$url) {
                curUrl += fn.$url;
            }

            if (fn.$method) {
                method = fn.$method;
            }
            let methodDoc = '';
            if (fn.$doc) {
                methodDoc = fn.$doc;
            }

            //验证ID是否合法
            fn = wrapVerifyIdFn.bind(cls)(fn);
            //统一处理async错误
            fn = wrapNextFn.bind(cls)(fn);

            method = method.toLowerCase();
            router[method](curUrl, fn.bind(cls));
            urls.push(method.toUpperCase() + '  ' + curUrl + '  ' + methodDoc);
        })
    }

    if (options && options.isShowUrls) {
        let urlsPath = options.urlsPath || '/~urls';
        router.use(urlsPath, function(req, res, next) {
            res.json(urls);
        })
    }
    return router;
}

function getAllMethods(Cls) {
    let methods = [];
    let prototype = Cls.prototype;
    do {
        if (prototype) {
            methods = methods.concat(Object.getOwnPropertyNames(prototype));
        }
        prototype = Object.getPrototypeOf(prototype)
    } while(prototype);


    return methods;
}

function wrapVerifyIdFn(fn) {
    let self = this;
    return (req, res, next) => {
        let id = req.params.id;
        if (!id) {
            return fn.bind(self)(req, res, next);
        }
        if (!self.$isValidId.bind(self)(id)) {
            if (next && typeof next == 'function') {
                return next();
            }
            return res.send('Invalid Id');
        }
        return fn.bind(self)(req, res, next)
    }

}

function wrapNextFn(fn) {
    let self = this;
    return (req, res, next) => {
        let ret = fn.bind(self)(req, res, next);
        if (ret && ret.then && typeof ret.then == 'function') {
            return ret.catch(next);
        }
        return ret;
    }
}