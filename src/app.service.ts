import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  constructor(
    //@Inject('SEQUELIZE') private readonly sequelizeProvider,
  ) {}
  getHello(): string {
    //console.log(this.sequelizeProvider);
    return 'Hello World!';
  }
}
