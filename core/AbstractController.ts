/**
 * Created by wlh on 2017/8/29.
 */


'use strict';
import {IController, ReplyData} from "./IController";



export abstract class AbstractController implements IController {
    abstract $isValidId(id: string) :boolean;
}

