import { AbstractController, Restful, Group } from '../../../index';
import { Api } from '../../../core/swagger';
import { GetMapping } from '../../../index';

@Group('manager')
@Restful()
export default class GroupController extends AbstractController { 

    $isValidId(id: string) : boolean{ 
        return /^\d+$/.test(id);
    }

    async get() { 
        return "group";
    }

    @Api("获取列表")
    find() { 
        return []
    }

    @GetMapping("/test")
    test() {
        throw new Error("test")
    }
}

const group = new GroupController()
export {group}