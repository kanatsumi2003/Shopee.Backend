import {IQueueConsumer} from "./runner/queue.consumer.interface";
import {inject, injectable} from "tsyringe";
import {QUEUE_TOKENS, SERVICE_TOKENS} from "../constants/service.token.constant";
import {IRabbitmqClient} from "../rabbitmq/rabbitmq.client.interface";
import {ForgotPasswordEmailEvent} from "../events/forgot.password.email.event";
import {MailHelper} from "../../common/helpers/mail.helper";

@injectable()
export class ForgotPasswordEmailConsumer implements IQueueConsumer {
    constructor(@inject(SERVICE_TOKENS.IRabbitmqClient) private readonly rabbitMqClient: IRabbitmqClient) {
    }

    async start(): Promise<void> {
        await this.rabbitMqClient.consume<ForgotPasswordEmailEvent>(QUEUE_TOKENS.FORGOT_PASSWORD_EMAIL, async (data: ForgotPasswordEmailEvent) => {
            await MailHelper.sendMail({
                to: data.email,
                subject: "Forgot password",
                template: 'forgot.password.email.template',
                context: {
                    email: data.email,
                    resetLink: `${process.env.REACT_APP_ROOT}/forgot-password?email=${data.email}&token=${data.resetPasswordToken}&timestamp=${data.expiryTimeStamp}`,
                }
            })
        })
    }


}