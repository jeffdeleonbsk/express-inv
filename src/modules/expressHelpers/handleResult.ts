import { Response } from "express";
import { Result } from "../common/result";

export function genericHandleViewResult<T, U>(
    response: Response,
    req: T,
    result: Result<U>,
    viewName: string,
    layout: string= ""
): void {
    if (result.isSuccess) {
        response.render(viewName, {
            errors: null,
            layout,
            result: result.result
        });
    } else {
        if (result.code === Result.VALIDATION_FAILED) {
            response.render(viewName, {
                errors: result.validationErrors,
                layout,
                previous: req,
                result: null
            });
        } else {
            response.status(422).json(result);
        }
    }
}
export function genericHandleJsonResult<T, U>(
    response: Response,
    req: T,
    result: Result<U>
): void {
    response.status(result.isSuccess ? 200 : 422).json(result);

}
