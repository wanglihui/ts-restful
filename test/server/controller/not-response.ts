import { Restful, NotRepsonse, HttpResponse } from "../../../core/decorator";
import { GetMapping } from '../../../dist';

@Restful('/not-response')
export default class NotResponseController {

    @NotRepsonse
    @GetMapping("/")
    async index(@HttpResponse res: any) {
        res.redirect("http://www.baidu.com")
    }
}