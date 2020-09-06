import { camelCase, kebabCase, snakeCase, upperFirst } from 'lodash'
import { Format } from './types'

export class Formatter {
  private static getFormatter(format: Format): (value?: string) => string {
    switch (format) {
      case 'camel':
        return camelCase

      case 'kebab':
        return kebabCase

      case 'pascal':
        return (value?: string) => upperFirst(camelCase(value))

      case 'snake':
        return snakeCase
    }
  }

  public static format(value: string, format: Format, removeDots?: boolean): string {
    const formatter = (value: string) => value.split('/').map(this.getFormatter(format)).join('/')

    if (removeDots) {
      return formatter(value)
    }

    return value.split('.').map(formatter).join('.')
  }
}
