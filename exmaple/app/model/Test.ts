/**
 * Created by wlh on 2017/9/16.
 */


'use strict';
import {Service} from "../../../core/decorator";



@Service()
export class Test {
    private a: string;
    public b: string = 'x';
    constructor() {
        this.a = 'hello world';
        this.b = 'hello';
    }

    asyHello() {
        return this.a;
    }
}