import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { createCategory } from 'src/fixtures/categories';
import { createUsers } from 'src/fixtures/users';
import { createThreads } from 'src/fixtures/threads';
import { createScoringLabels } from 'src/fixtures/scoringLabels';
import { createFakeScoring } from './fixtures/messageVotes';
import { fakeThreadResponse } from './fixtures/threadMessages';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(3000);

  // await createCategory();
  // await createUsers();
  // await createScoringLabels();
  // await createThreads();
  // await fakeThreadResponse()
  // await createFakeScoring();
}
bootstrap();
