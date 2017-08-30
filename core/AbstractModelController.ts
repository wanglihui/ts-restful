/**
 * Created by wlh on 2017/8/29.
 */

'use strict';
import {AbstractController} from "./AbstractController";

export abstract class AbstractModelController extends AbstractController {

    constructor(private model: any) {
        super();
    }

    async get(req, res, next) {
        let {id} = req.params;
        let instance = await this.model.get(id);
        res.json(this.reply(0, instance));
    }

    async find(req, res, next) {
        let {p, pz, order} = req.query;
        let offset = p * pz;
        let options: {
            [index: string]: any;
        } = {
            limit: pz,
            offset: offset
        }
        if (order) {
            options.order = order;
        }
        let pager = await this.model.find({where: {}}, options);
        res.json(pager);
    }
}