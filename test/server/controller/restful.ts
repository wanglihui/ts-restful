import { Restful, GetMapping, PostMapping, RequestMapping, Router } from '../../../core/decorator';

@Restful
export default class RestfulController {
    @GetMapping("/")
    async index() {
        return {}
    }
}

@Restful
export class UrlController {
    @GetMapping("/")
    async index() {
        return {}
    }

    @GetMapping("/get-mapping")
    async getMapping() {
        return true;
    }

    @PostMapping("/post-mapping")
    async postMapping() {
        return true;
    }
    @RequestMapping('/request-mapping', 'delete', {doc: "DELETE MAPPING"})
    async deleteMapping() {
        return 'delete-mapping';
    }
    @RequestMapping('/put-mapping', 'put')
    async putMapping() {
        return 'put-mapping'
    }
    @Router('/router-get', 'get')
    async routerGet() {
        return 'router-get'
    }
    @Router('/router-post', 'post')
    async routerPost() {
        return 'router-post'
    }

    @Router('/error', 'get')
    async error() { 
        throw new Error("error");
    }
}