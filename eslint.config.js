import { srcRules, testRules } from '@eslint-aeria/config'

export default [
  {
    ...srcRules,
    rules: {
      ...srcRules.rules,
      'ts/naming-convention': 'off',
    }
  },
  testRules,
]

