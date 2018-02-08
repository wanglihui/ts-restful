/**
 * Created by wlh on 2017/8/29.
 */


'use strict';

import { Request, Response, NextFunction } from 'express-serve-static-core';
export interface ReplyData {
    code: number;
    data: any;
    responseTime: number;
    msg?: string;
    sign?: string;
}

export interface IController {
    $isValidId(id: string): boolean;
    $before?: (req: Request, res: Response, next?: NextFunction)=> Promise<any>;
    reply(code: number, data: any): ReplyData;
}