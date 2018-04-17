import { has } from 'lodash'

export const confirmVersion = (schema) => {
  if (has(schema, 'debug')) {
    return 1;
  }
  return [2, 3, 4];
}

