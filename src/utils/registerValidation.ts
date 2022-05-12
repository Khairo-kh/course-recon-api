import { UsernamePasswordInput } from '../resolvers/FieldInputAndError';
import validator from 'validator';

export const registerValidation = (options: UsernamePasswordInput) => {
  if (!validator.isEmpty(options.email) && !validator.isEmail(options.email)) {
    return [
      {
        field: 'email',
        message: 'must register with a valid email',
      },
    ];
  }
  if (options.username.length <= 2) {
    return [
      {
        field: 'username',
        message: 'username must be at least 3 characters',
      },
    ];
  }

  if (options.username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'username cannot include "@" character',
      },
    ];
  }

  if (options.password.length < 8) {
    return [
      {
        field: 'password',
        message: 'password must at least be 8 characters',
      },
    ];
  }
  return null;
};
