import { ErrorResponse } from './error.interfaces'
import { ErrorCodeEnum } from './errorResponse.enum'

export default class ErrorService {
  public badRequest(message: string) {
    const err: ErrorResponse = new Error(message)
    err.httpStatus = 400
    err.code = ErrorCodeEnum.BAD_REQUEST
    throw err
  }

  public unauthorized(message: string) {
    const err: ErrorResponse = new Error(message)
    err.httpStatus = 401
    err.code = ErrorCodeEnum.UNAUTHORIZED
    throw err
  }

  public notFound(message: string) {
    const err: ErrorResponse = new Error(message)
    err.httpStatus = 404
    err.code = ErrorCodeEnum.NOT_FOUND
    throw err
  }
}
