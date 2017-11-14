/**
 * Created by wlh on 2017/11/14.
 */


'use strict';
import {AbstractController} from "../../../core/AbstractController";
import {Restful} from "../../../core/decorator";

@Restful()
export class SignController extends AbstractController {

    $isValidId(id: string) {
        return /^\d+$/.test(id);
    }

    async get(req, res, next) :Promise<any> {
        let data = {
            id: 1,
            name: '王希望'
        };
        return res.json(this.reply(0, data, 'testkey'));
    }
}