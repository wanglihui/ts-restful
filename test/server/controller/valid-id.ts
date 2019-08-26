import { GetMapping, RequestParam, Restful } from "../../../core/decorator";

@Restful('/valid-id')
export default class ValidIdController {
    $isValidId(id: string) {
        console.log(id);
        console.log(/^\d+$/.test(id))
        return /^\d+$/.test(id);
    }

    @GetMapping("/:id")
    async id(@RequestParam id: string) {
        return {
            id,
        }
    }
}