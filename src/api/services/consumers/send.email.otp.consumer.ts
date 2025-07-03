import {IQueueConsumer} from "./runner/queue.consumer.interface";
import {inject, injectable} from "tsyringe";
import {QUEUE_TOKENS, SERVICE_TOKENS} from "../constants/service.token.constant";
import {IRabbitmqClient} from "../rabbitmq/rabbitmq.client.interface";
import {SendEmailOtpEvent} from "../events/send.email.otp.event";
import {MailHelper} from "../../common/helpers/mail.helper";

@injectable()
export class SendEmailOtpConsumer implements IQueueConsumer{
    constructor(@inject(SERVICE_TOKENS.IRabbitmqClient) private readonly rabbitmqClient: IRabbitmqClient) {
    }
    async start(): Promise<void> {
        await this.rabbitmqClient.consume<SendEmailOtpEvent>(QUEUE_TOKENS.SEND_EMAIL_OTP, async (data: SendEmailOtpEvent) => {
            await MailHelper.sendMail({
                to: data.toEmail,
                subject: 'Email Otp verification',
                template: 'otp.email.template',
                context: {
                    email: data.toEmail,
                    otp: data.emailOtp,
                }
            })
        })
    }

}