import { Restful, RequestMapping, PostMapping } from '../../../core/decorator';

@Restful('/test2')
export default class Test2Controller { 

    @RequestMapping('/:id', {doc: "返回一个字符串"})
    get(ctx: { req: any, res: any }) :string { 
        return 'test';
    }

    @PostMapping("/:id", { doc: "POST返回一个boolean"})
    test2(): boolean{ 
        return false;
    }
}