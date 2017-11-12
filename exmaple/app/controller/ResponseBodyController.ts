import { Restful, ResponseBody } from '../../../';
import { AbstractController } from '../../../';

@Restful()
export class ResponseBodyController extends AbstractController { 

    constructor() { 
        super();
    }

    $isValidId(id: string) { 
        return true;
    }

    @ResponseBody()
    async get(ctx): Promise<any> { 
        console.log(this)
        let ret = this.reply(0, {
            id: "1",
            name: "王大拿"
        })
        return ret;
    }
}