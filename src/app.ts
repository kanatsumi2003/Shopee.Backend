import 'reflect-metadata'
import './config/env.config'
import express from 'express'
import setupSwagger from "./swagger/swagger.config";
import {registerRepositoryDependencies} from "./api/repositories/repository.dependency.injection";
import {registerServiceDependencies} from "./api/services/service.dependency.injection";
import {registerControllerDependencies} from "./api/controller.dependency.injection";
// @ts-ignore
import {RegisterRoutes} from '../build/routes'
import {GlobalExceptionMiddleware} from "./api/common/middlewares/global.exception.middleware";
import {AuthenticationMiddleware} from "./api/common/middlewares/authentication.middleware";
import {container} from "tsyringe";
import {ConsumerRunner} from "./api/services/consumers/runner/runner.consumer";
import cors from 'cors'

async function bootstrap() {
    await registerRepositoryDependencies();
    await registerServiceDependencies();
    await registerControllerDependencies();

    // Start all consumers
    const runner = container.resolve(ConsumerRunner);
    await runner.startAll();

    const app = express()
    app.use(cors());
    app.use(express.json());

    // const { default: authRoute } = await import('./api/routes/auth.route');
    // app.use('/auth', authRoute);
    RegisterRoutes(app);
    app.use(GlobalExceptionMiddleware);
    //app.use(AuthenticationMiddleware());

    // Use swagger
    setupSwagger(app);

    // Expose app port using
    app.listen(process.env.PORT || 3000)
}

bootstrap();