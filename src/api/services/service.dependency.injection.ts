import {container} from "tsyringe";
import {IAuthService} from "./interfaces/auth.service.interface";
import {CONSUMER_TOKENS, SERVICE_TOKENS} from "./constants/service.token.constant";
import {AuthService} from "./services/auth.service";
import {ITokenService} from "./interfaces/token.service.interface";
import {TokenService} from "./services/token.service";
import {IJwtSettings, JwtSettings,} from "./models/settings/jwt.setting";
import {IUserService} from "./interfaces/user.service.interface";
import {UserService} from "./services/user.service";
import {RabbitmqClient} from "./rabbitmq/rabbitmq.client";
import {IRabbitmqClient} from "./rabbitmq/rabbitmq.client.interface";
import {IQueueConsumer} from "./consumers/runner/queue.consumer.interface";
import {SendEmailOtpConsumer} from "./consumers/send.email.otp.consumer";
import {ForgotPasswordEmailConsumer} from "./consumers/forgot.password.email.consumer";

export async function registerServiceDependencies() {
    container.register<IJwtSettings>(SERVICE_TOKENS.JwtSettings, { useValue: JwtSettings })
    container.registerSingleton<IRabbitmqClient>(SERVICE_TOKENS.IRabbitmqClient, RabbitmqClient);

    // Connect RabbitMQ right after registration
    const rabbit = container.resolve<IRabbitmqClient>(SERVICE_TOKENS.IRabbitmqClient);
    await rabbit.connect();

    container.register<IAuthService>(SERVICE_TOKENS.IAuthService, { useClass: AuthService });
    container.register<ITokenService>(SERVICE_TOKENS.ITokenService, { useClass: TokenService });
    container.register<IUserService>(SERVICE_TOKENS.IUserService, { useClass: UserService });

    await registerConsumers();
}

export async function registerConsumers() {
    container.registerSingleton<IQueueConsumer>(CONSUMER_TOKENS.SendEmailOtpConsumer, SendEmailOtpConsumer);
    container.registerSingleton<IQueueConsumer>(CONSUMER_TOKENS.ForgotPasswordEmailConsumer, ForgotPasswordEmailConsumer);

    container.registerInstance<IQueueConsumer[]>(CONSUMER_TOKENS.AllConsumers, [
        container.resolve<IQueueConsumer>(CONSUMER_TOKENS.SendEmailOtpConsumer),
        container.resolve<IQueueConsumer>(CONSUMER_TOKENS.ForgotPasswordEmailConsumer)
    ])
}
