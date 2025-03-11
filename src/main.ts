import { ApiResponseAddMetadataInterceptor } from './interceptors/api-response-add-metadata.interceptor';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentService } from 'src/environment/environment.service';
import { ValidationPipe } from '@nestjs/common';
import { ApiRequestBodyToCamelCaseTransformPipe } from 'src/pipes/api-request-to-camel-case.pipe';
import { ApiResponseToSnakeCaseInterceptor } from 'src/interceptors/api-response-to-snake-case.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ApiRequestBodyToCamelCaseTransformPipe());
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new ApiResponseToSnakeCaseInterceptor());
  app.useGlobalInterceptors(new ApiResponseAddMetadataInterceptor());

  const environmentService = app.get(EnvironmentService);

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Competitive programming contest utils')
    .setDescription(
      'The competitive programming contest utils server API description',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  console.log('Swagger is running at localhost/api');

  const port: number = environmentService.port;
  await app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
    console.log(`Database host: ${environmentService.postgresHost}`);
    console.log(`Database port: ${environmentService.postgresPort}`);
    console.log(`Database name: ${environmentService.postgresDb}`);
  });
}
bootstrap();
