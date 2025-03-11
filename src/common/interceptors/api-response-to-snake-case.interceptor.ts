import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isDate } from 'class-validator';
import { mapKeys, isObject, isArray } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const toSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const convertToSnakeCase = (obj: Record<string, any>): any => {
  const objKeys = Object.keys(obj);
  const objValues = Object.values(obj);
  const snakeCaseKeys: string[] = [];
  const snakeCaseValues: any[] = [];
  objKeys.forEach((key: string, index: number) => {
    snakeCaseKeys.push(toSnakeCase(key));

    if (isArray(objValues.at(index))) {
      snakeCaseValues.push(
        objValues[index].map((data: any) => convertToSnakeCase(data)),
      );
    } else if (isDate(objValues.at(index)) || !isObject(objValues.at(index))) {
      snakeCaseValues.push(objValues.at(index));
    } else if (isObject(objValues.at(index))) {
      snakeCaseValues.push(convertToSnakeCase(objValues.at(index)));
    }
  });
  const transformedObject = Object.fromEntries(
    snakeCaseKeys.map((key: string, index: number) => [
      key,
      snakeCaseValues[index],
    ]),
  );

  return transformedObject;
};

@Injectable()
export class ApiResponseToSnakeCaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return convertToSnakeCase(data);
      }),
    );
  }
}
