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
        let ret = this.reply(0, {
            id: "1",
            name: "王大拿"
        })
        return ret;
    }
}