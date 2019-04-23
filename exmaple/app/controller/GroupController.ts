import { AbstractController, Restful, Group } from '../../../index';
import { Api } from '../../../core/swagger';

@Group('manager')
@Restful()
export default class GroupController extends AbstractController { 

    $isValidId(id: string) : boolean{ 
        return true;
    }

    async get(req, res, next) { 
        res.send("group");
    }

    @Api("获取列表")
    find() { 
        return []
    }
}

const group = new GroupController()
export {group}