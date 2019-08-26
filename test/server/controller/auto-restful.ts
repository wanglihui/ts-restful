import { Restful , AbstractController} from "../../../";

@Restful('/auto-restful')
export class AutoRestfulController extends AbstractController {
    $isValidId(id: string): boolean {
        return /^\d+$/.test(id);
    }

    async get() {
        return 'get';
    }

    async find() {
        return 'find'
    }

    async add() {
        return 'add'
    }

    async delete() {
        return 'delete'
    }
    async update() {
        return 'update';
    }
}