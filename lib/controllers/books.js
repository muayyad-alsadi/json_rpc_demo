import {proj} from "../proj";
import {FieldValidationError} from "@alsadi/json_rpc_server";

/**
 * @async
 * @param {Object} params
 * @param {number} params.page required - page number
 * @return {Object} ret
 * @return {Array} ret.items
 */
export async function action_list({page}) {
    console.log("** got ", typeof page, JSON.stringify(page));
    if (!page || page<1) {
        throw new FieldValidationError("page", "invalid value for page");
    }
    const per_page = 10;
    const offset = (page-1)*per_page;
    const rows = await proj.query("SELECT id, title FROM books LIMIT $per_page OFFSET $offset", {
        $per_page: per_page,
        $offset: offset,
    });
    return {items: rows};
}
