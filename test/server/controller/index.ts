import { Restful, GetMapping } from "../../../core/decorator";

@Restful("/index")
export default class IndexTestController {

    @GetMapping("/index")
    async index() {
        return {};
    }
}