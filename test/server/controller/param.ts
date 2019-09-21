import { Restful, QueryStringParam, GetMapping, RequestParam, PostMapping, RequestBody, RequestBodyParam, Header, Cookie, HttpRequest, HttpResponse, NextFunction } from "../../../core/decorator";
import { AbstractController } from '../../../core/AbstractController';
import { Response } from 'express-serve-static-core';

@Restful('/param')
export default class ParamController extends AbstractController {

    $isValidId(id: string) {
        return /^\d+$/.test(id);
    }

    @GetMapping('/index')
    async index(@QueryStringParam id: string) {
        return {id};
    }

    @GetMapping('/:id')
    async id(@RequestParam id: string) {
        return {id};
    }

    @PostMapping('/post-body')
    async postBody(@RequestBody data: any) {
        return data;
    }

    @PostMapping('/post-param')
    async requestBodyParam(@RequestBodyParam id: any) {
        return {id};
    }

    @GetMapping('/header-param')
    async headerParam(@Header id: any) {
        return {id};
    }

    @GetMapping('/cookie-param')
    async cookieParam(@Cookie id: any) {
        return {id};
    }

    @GetMapping('/httprequest')
    async httprequest(@HttpRequest req: any) {
        let id = req.query.id;
        return {id};
    }

    @GetMapping('/httpresponse')
    async httpresponse(@HttpResponse res: Response) {
        res.status(201);
        return true;
    }

    @GetMapping('/next')
    async injectnext(@NextFunction next: any) {
        if (!next || typeof next !== 'function') {
            throw new Error("not inject next");
        }
        return true;
    }


    @GetMapping('/muti-param/:id')
    async mutiParam(@QueryStringParam qs: string, @QueryStringParam data: string, @RequestParam id: string) {
        return {
            qs,
            data,
            id,
        }
    }

    @GetMapping('/over-three-param')
    async overThreeParam(@QueryStringParam qs: string, @QueryStringParam data: string, @QueryStringParam id: string, @QueryStringParam three: string) {
        return {
            qs,
            data,
            id,
            three,
        }
    }
}