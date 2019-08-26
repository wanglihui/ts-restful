import { GetMapping, RequestParam, Restful } from "../../../core/decorator";

@Restful('/valid-id')
export default class ValidIdController {
    $isValidId(id: string) {
        return /^\d+$/.test(id);
    }

    @GetMapping("/:id")
    async id(@RequestParam id: string) {
        return {
            id,
        }
    }

    @GetMapping("/not-id")
    async testNotId() {
        return 'not-id'
    }
}