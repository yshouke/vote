import { MailerOptions } from "@nestjs-modules/mailer";

// import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
export const mailerConfig: MailerOptions = {
    transport: {
        host: 'smtp.126.com',
        port: 25,
        ignoreTLS: true,
        secure: false,
        auth: {
            user: 'yshouke@126.com',
            pass: 'NCIFANOFQIQAESLD',
        },
    },
    defaults: {
        from: '"选举投票" <yshouke@126.com>',
    },
    preview: false,
    // template: {
    //     dir: './template/',
    //     adapter: new PugAdapter(),
    //     options: {
    //         strict: true,
    //     },
    // },
}