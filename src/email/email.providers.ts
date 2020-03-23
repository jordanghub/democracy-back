import nodemailer from 'nodemailer';

export const emailProviders = [
  {
    provide: 'MAILER_PROVIDER',
    useFactory: async () => {
      const provider = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'democracyemailvalidation@gmail.com',
          pass: 'coucou1.5',
        },
      });

      return provider;
    },
  },
];
