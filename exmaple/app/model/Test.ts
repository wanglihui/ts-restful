/**
 * Created by wlh on 2017/9/16.
 */


'use strict';
import {Service} from "../../../core/decorator";


@Service()
export class Test {
    private a: string;
    constructor() {
        this.a = 'hello world';
    }

    asyHello() {
        return this.a;
    }
}