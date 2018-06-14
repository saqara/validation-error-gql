import { GraphQLError } from 'graphql'

/**
 * @export
 * @class ValidationError
 * @extends {GraphQLError}
 */
export default class ValidationError extends GraphQLError {
  /**
   * Creates an instance of ValidationError.
   * @param {Error|Object} error
   * @memberof ValidationError
   * @throws {TypeError}
   */
  constructor (error) {
    if (!(error instanceof Error || typeof error === 'object')) {
      throw new TypeError('[ValidationError] - `error` must be an error or an object.')
    }

    super(error.message || 'The request is invalid')

    let details = error.invalidKeys ||
      error.reason ||
      (error.sanitizedError && error.sanitizedError.reason) ||
      error.details || []

    this.state = error.state || null
    if (details && !this.state) {
      if (!Array.isArray(details)) {
        details = [ details ]
      }

      this.state = details.reduce((result, error) => {
        if (!error) {
          return result
        }

        const name =
          (typeof error === 'string' || (
            typeof error === 'object' &&
            !Object.prototype.hasOwnProperty.call(error, 'key') &&
            !Object.prototype.hasOwnProperty.call(error, 'name')
          ))
            ? ''
            : error.key || error.name

        if (Object.prototype.hasOwnProperty.call(result, name)) {
          result[ name ].push(error)
        } else {
          result[ name ] = [ error ]
        }

        return result
      }, {})
    }
  }
}
