import { Restful } from '../../../index';
import { AbstractController } from '../../../index';

@Restful()
export class ResponseBodyController extends AbstractController { 

    constructor() { 
        super();
    }

    $isValidId(id: string) { 
        return true;
    }

    async get(ctx): Promise<any> { 
        console.log(this)
        return {
            id: "1",
            name: "王大拿"
        }
    }
}