import { ApiResponseAddMetadataInterceptor } from './common/interceptors/api-response-add-metadata.interceptor';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentService } from 'src/environment/environment.service';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ApiRequestBodyToCamelCaseTransformPipe } from 'src/common/pipes/api-request-to-camel-case.pipe';
import { ApiResponseToSnakeCaseInterceptor } from 'src/common/interceptors/api-response-to-snake-case.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,X-Requested-With,Accept',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.enableVersioning({ type: VersioningType.URI });

  app.useGlobalPipes(new ApiRequestBodyToCamelCaseTransformPipe());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalInterceptors(new ApiResponseToSnakeCaseInterceptor());
  app.useGlobalInterceptors(new ApiResponseAddMetadataInterceptor());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Competitive programming contest utils')
    .setDescription(
      'The competitive programming contest utils server API description',
    )
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-document', app, documentFactory);

  const environmentService = app.get(EnvironmentService);
  const port: number = environmentService.port;
  await app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
    console.log(`Database host: ${environmentService.postgresHost}`);
    console.log(`Database port: ${environmentService.postgresPort}`);
    console.log(`Database name: ${environmentService.postgresDb}`);
    console.log('Swagger is running at localhost/api-document');
  });
}
bootstrap();
