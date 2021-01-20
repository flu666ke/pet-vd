export interface ErrorResponse extends Error {
  httpStatus?: number
  code?: string
}
