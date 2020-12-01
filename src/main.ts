import { join } from 'path';

import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// import { createCategory } from 'src/fixtures/categories';
// import { createUsers } from 'src/fixtures/users';
// import { createThreads } from 'src/fixtures/threads';
// import { createScoringLabels } from 'src/fixtures/scoringLabels';
// import { createFakeScoring } from './fixtures/messageVotes';
// import { fakeThreadResponse } from './fixtures/threadMessages';
import { classValidatorErrorFilter } from './utils/filterErrors';
import { createRoles } from './fixtures/roles';
import { Role } from './users/models/role.entity';
// import { Category } from './categories/models/category.entity';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: classValidatorErrorFilter,
    }),
  );

  app.use(helmet());
  app.enableCors();
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 200,
      skip: (req, res) => {

        // Add ssr server ip to avoid 429
        // if (req.ip === '192.168.1.22') {
        //   return true;
        // }
        // TODO Add a white list system for the ssr server maybe with req.ip matching elements in an array
        return false;
      },
    }),
  );
  await app.listen(process.env.PORT || 3000, '0.0.0.0');

  // ROLES CREATION

  try {
      const alreadyCreated = await Role.count();
      if (alreadyCreated === 0) {
        await createRoles();
      }
  } catch (e) {
    console.log(e);
  }

  // FIXTURES DEV

  // try {
  //   const alreadyCreated = await Category.count();
  //   if (alreadyCreated === 0) {
  //     await createCategory();
  //     await createUsers();
  //     await createScoringLabels();
  //     await createThreads();
  //     await fakeThreadResponse();
  //     await createFakeScoring();
  //   }
  // } catch (e) {
  //   console.log(e);
  //   console.log('erreur avec les fixtures');
  // }
}
bootstrap();
