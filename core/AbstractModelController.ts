/**
 * Created by wlh on 2017/8/29.
 */

'use strict';
import {AbstractController} from "./AbstractController";

export interface ModelObjectInterface<T> { 
    get(id: string): Promise<T>;
    find(options): Promise<Array<T>>;
    update(obj: T): Promise<T>;
    destroy(obj: T): Promise<any>;
    create(obj: T): T;
}

export interface PropertyInterface { 
    [index: string]: any;
}

export interface ObjectInterface { 
    save(): Promise<this>;
    destroy(): Promise<any>;
}

export abstract class AbstractModelController<T extends ObjectInterface> extends AbstractController {

    constructor(protected model: ModelObjectInterface<T>, private property: PropertyInterface) {
        super();
    }

    $isValidId(id: string) :boolean {
        return /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/.test(id);
    }

    async get(req, res, next) {
        let {id} = req.params;
        let instance = await this.model.get(id);
        res.json(this.reply(0, instance));
    }

    async find(req, res, next) {
        let params = req.query;
        let {p, pz, order} = params;
        pz = pz || 20;
        p = p || 0;
        let query = {where:{}};
        for(let key in params){
            if(this.property.indexOf(key) >= 0){
                query.where[key] = params[key];
            }
        }
        let offset = p * pz;
        let options: {
            [index: string]: any;
        } = {
            limit: pz,
            offset: offset
        }
        if (order) {
            options.order = order;
        }else{
            options.order = [["createdAt", "desc"]];
        }
        if(!options.limit)
            options.limit = pz;

        options.where = query.where;
        let pager = await this.model.find(options);
        // res.json(pager);
        res.json(this.reply(0, pager));
    }

    async update(req, res, next) {
        let params = req.body;
        let id = req.params.id;
        if(!id) {
            res.json(this.reply(0, null));
        }
        let obj = await this.model.get(id);

        for(let key in params){
            if(this.property.indexOf(key) >= 0){
                obj[key] = params[key];
            }
        }
        obj = await obj.save();
        res.json(this.reply(0, obj));
    }


    async add(req, res, next) {
        let params = req.body;
        let properties = {};
        for(let key in params){
            if(this.property.indexOf(key) >= 0){
                properties[key] = params[key];
            }
        }
        let obj = this.model.create(properties as T);
        obj = await obj.save();
        res.json(this.reply(0, obj));
    }

    async delete(req, res, next) {
        let params = req.params;
        let id = params.id;
        if(!id) {
            res.json(this.reply(0, null));
        }
        let obj = await this.model.get(id);
        if(obj){
            let isDeleted = await obj.destroy();
            res.json(this.reply(0, isDeleted));
        }else{
            res.json(this.reply(0, null));
        }
    }
}