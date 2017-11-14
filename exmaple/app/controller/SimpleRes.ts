/**
 * Created by wlh on 2017/11/14.
 */


'use strict';
import {AbstractController} from "../../../core/AbstractController";
import {Restful} from "../../../core/decorator";

@Restful()
export default class SimpleResponseController extends AbstractController {

    $isValidId(id: string) {
        return !!id;
    }

    async get(req, res, next) :Promise<any> {
        return this.simpleReply(res, 0, {id: 1, name: 'test'}, 'test123456');
    }
}