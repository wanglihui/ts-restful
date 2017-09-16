/**
 * Created by wlh on 2017/9/16.
 */


'use strict';
import {Test} from "../model/Test";
import {AutoInject, Restful, Router} from "../../../core/decorator";
import {AbstractController} from "../../../core/AbstractController";

@Restful()
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

    @Router('/index')
    login(req, res, next) {
        res.send(this.test.asyHello());
    }
}