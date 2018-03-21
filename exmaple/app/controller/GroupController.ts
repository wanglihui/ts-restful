import { AbstractController, Restful, Group } from '../../..';

@Group('manager')
@Restful()
export default class GroupController extends AbstractController { 

    $isValidId(id: string) : boolean{ 
        return true;
    }

    async get(req, res, next) { 
        res.send("group");
    }
}