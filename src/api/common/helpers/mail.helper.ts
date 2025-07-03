import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

export class MailHelper {

    private static transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    static async renderTemplate(templateName: string, data: Record<string, any>): Promise<string> {
        const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.ejs`);
        return await ejs.renderFile(templatePath, data);
    }

    static async sendMail({to, subject, template, context}: {
        to: string;
        subject: string;
        template: string;
        context: Record<string, any>;
    }) {
        const html = await this.renderTemplate(template, context);

        return this.transporter.sendMail({
            from: process.env.MAIL_FROM || '"No Reply" <no-reply@example.com>',
            to,
            subject,
            html,
        });
    }
}
