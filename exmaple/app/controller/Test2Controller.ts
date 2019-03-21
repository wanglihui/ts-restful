import { Restful, RequestMapping } from '../../../core/decorator';

@Restful('/test2')
export default class Test2Controller { 

    @RequestMapping('/:id')
    get(req, res, next) { 

    }
}