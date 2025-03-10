import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { mapKeys } from 'lodash';

@Injectable()
export class ApiRequestBodyToCamelCaseTransformPipe implements PipeTransform {
  transform(value: Record<string, any>, metadata: ArgumentMetadata) {
    if (typeof value !== 'object' || value === null) {
      return value;
    }

    const convertToCamelCase = (
      obj: Record<string, any>,
    ): Record<string, any> => {
      return mapKeys(obj, (_, key) =>
        key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
      );
    };

    const transformedValue = convertToCamelCase(value);
    console.log(
      '🚀 ~ ApiRequestBodyTransformPipe ~ transform:',
      transformedValue,
    );
    return transformedValue;
  }
}
