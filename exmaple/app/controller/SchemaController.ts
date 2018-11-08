import { SchemaFilter, Restful, Router } from '../../../core/decorator';
import { AbstractController } from '../../../core/AbstractController';


@Restful('/schema')
export class SchemaController extends AbstractController{ 

    $isValidId(id: string) { 
        return true;
    }

    @SchemaFilter({ id: 'string', age: 'number' })
    @Router("/test")
    test(req, res, next) { 
        res.json({
            id: '1',
            username: 'test',
            password: 'password',
            age: 16
        })
    }

    @SchemaFilter({ id: 'string', age: 'number' }, false)
    @Router("/test3")
    test3(req, res, next) {
        res.json({
            id: '1',
            username: 'test',
            password: 'password',
            age: 16
        })
    }

    @Router("/test2")
    test2(req, res, next) { 
        res.json({});
    }
}