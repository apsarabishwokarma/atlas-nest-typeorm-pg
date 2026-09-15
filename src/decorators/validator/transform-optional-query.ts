import { Transform } from 'class-transformer';
import { ValidateIf, ValidationOptions } from 'class-validator';

export function TransformOptionalQuery(validationOptions?: ValidationOptions) {
  return function (target: any, propertyKey: string) {
    Transform(({ value }) =>
      value === 'null' ? null : value === 'undefined' ? undefined : value,
    )(target, propertyKey);

    ValidateIf((obj, value) => {
      return (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        value !== 'null' &&
        value !== 'undefined'
      );
    }, validationOptions)(target, propertyKey);
  };
}
