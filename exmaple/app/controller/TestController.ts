/**
 * Created by wlh on 2017/9/16.
 */


'use strict';
import {Test} from "../model/Test";
import {AutoInject, Restful, Router, RequestMapping} from "../../../core/decorator";
import {AbstractController} from "../../../core/AbstractController";

@Restful('/test-1')
export class TestController extends AbstractController{

    constructor() {
        super();
    }

    $isValidId(id: string) : boolean{
        return /^\d+$/.test(id);
    }

    @AutoInject()
    get test(): Test {
        return null;
    }
    set test(test: Test) {
    }

    @RequestMapping('/index', {doc: "测试首页"})
    login(req, res, next) {
        res.send(this.test.asyHello());
    }

    get(req, res, next) {
        res.send("/get");
    }

    find(req, res, next) {
        res.send("/find");
    }
}