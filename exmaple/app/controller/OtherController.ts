/**
 * Created by wlh on 2017/11/1.
 */


'use strict';
import {AbstractController} from "../../../core/AbstractController";
import {Restful} from "../../../core/decorator";

@Restful()
export class OtherController extends AbstractController {

    $isValidId(id: string) {
        return /^\d+$/.test(id);
    }

    get(req, res, next) {
        res.send("other get");
    }
}