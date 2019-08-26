import { Restful, Group, GetMapping } from "../../../core/decorator";

@Group("admin")
@Restful()
export default class GroupController {

    @GetMapping("/index")
    async index() {
        return 'group'
    }
}