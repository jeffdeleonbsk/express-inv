export class Result<T> {
    public static readonly SUCCESS = 0;
    public static readonly DOMAIN_FAILED = 600;
    public static readonly VALIDATION_FAILED = 501;
    public static readonly APP_FAILED = 500;
    public static readonly EXCEPTION = 502;

    public static readonly SUCCESS_STR = "SUCCESS";
    public static readonly DOMAIN_FAILED_STR = "DOMAIN_FAILED";
    public static readonly VALIDATION_FAILED_STR = "VALIDATION_FAILED";
    public static readonly APP_FAILED_STR = "APP_FAILED";
    public static readonly EXCEPTION_STR = "ESCEPTION";
    public static Ok<T>(result: T, message: string= "Success"): Result<T> {
        const res = new Result<T>();
        res.isSuccess = true;
        res.message = message;
        res.code = Result.SUCCESS;
        res.codeName = Result.SUCCESS_STR;
        res.result = result;
        return res;
    }
    public static domainFailed<T>(message: string) {
        const res = new Result<T>();
        res.isSuccess = false;
        res.message = message;
        res.code = Result.DOMAIN_FAILED;
        res.codeName = Result.DOMAIN_FAILED_STR;
        return res;
    }
    public static validationFailed<T>(
        validationErrors: any,
        message: string= "Validation failed"
    ): Result<T> {
        const res = new Result<T>();
        res.isSuccess = false;
        res.message = message;
        res.code = Result.VALIDATION_FAILED;
        res.codeName = Result.VALIDATION_FAILED_STR;
        res.validationErrors = validationErrors;
        return res;
    }
    public static appFailed<T>(applicationErrors: any, message: string= "Application failed"): Result<T> {
        const res = new Result<T>();
        res.isSuccess = false;
        res.message = message;
        res.code = Result.APP_FAILED;
        res.codeName = Result.APP_FAILED_STR;
        res.applicationErrors = applicationErrors;
        return res;
    }
    public static Exception<T>(
        applicationErrors: string[],
        exceptionCode: number= 0,
        message: string= "Exception"
    ): Result<T> {
        const res = new Result<T>();
        res.isSuccess = false;
        res.message = message;
        res.code = Result.EXCEPTION;
        res.codeName = Result.EXCEPTION_STR;
        res.exceptionCode = exceptionCode;
        res.applicationErrors = applicationErrors;
        return res;
    }
    public isSuccess = false;
    public code = Result.EXCEPTION;
    public codeName = Result.EXCEPTION_STR;
    public message = "";
    public result: T = null!;
    public validationErrors: any = null!;
    public applicationErrors: any = null!;
    public exceptionCode = 0;

}
