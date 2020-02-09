import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { createCategory } from 'src/fixtures/categories';
import { createUsers } from 'src/fixtures/users';
import { createThreads } from 'src/fixtures/threads';
import { createScoringLabels } from 'src/fixtures/scoringLabels';
import { createFakeScoring } from './fixtures/messageVotes';
import { fakeThreadResponse } from './fixtures/threadMessages';
import { classValidatorErrorFilter } from './utils/filterErrors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: classValidatorErrorFilter,
  }));
  app.enableCors({ origin: 'http://127.0.0.1:8000', credentials: true});
  app.use(cookieParser());

  await app.listen(3000);

  // await createCategory();
  // await createUsers();
  // await createScoringLabels();
  // await createThreads();
  // await fakeThreadResponse();
  // await createFakeScoring();
}
bootstrap();
