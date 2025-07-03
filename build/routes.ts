/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
import { container } from 'tsyringe';
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    import { UserController } from './../src/api/controllers/user.controller';
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    import { AuthController } from './../src/api/controllers/auth.controller';
    import { expressAuthentication } from './../src/api/common/auth/express.authentication';
    // @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

    const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    const models: TsoaRoute.Models = {
        "BaseResponse_void_": {
            "dataType": "refObject",
            "properties": {
                "statusCode": {"dataType":"double","default":200},
                "message": {"dataType":"string","default":"Successful"},
                "data": {"dataType":"union","subSchemas":[{"dataType":"void"},{"dataType":"enum","enums":[null]}],"default":null},
            },
            "additionalProperties": false,
        },
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        "ConfirmEmailRequest": {
            "dataType": "refObject",
            "properties": {
                "email": {"dataType":"string","required":true},
                "emailOtp": {"dataType":"string","required":true},
            },
            "additionalProperties": false,
        },
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        "RecoveryPasswordRequest": {
            "dataType": "refObject",
            "properties": {
                "email": {"dataType":"string","required":true},
                "token": {"dataType":"string","required":true},
                "timestamp": {"dataType":"string","required":true},
                "newPassword": {"dataType":"string","required":true},
            },
            "additionalProperties": false,
        },
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        "GetProfileResponse": {
            "dataType": "refObject",
            "properties": {
                "email": {"dataType":"string","required":true},
                "phoneNumber": {"dataType":"string"},
                "dateOfBirth": {"dataType":"datetime"},
                "name": {"dataType":"string"},
            },
            "additionalProperties": false,
        },
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        "BaseResponse_GetProfileResponse_": {
            "dataType": "refObject",
            "properties": {
                "statusCode": {"dataType":"double","default":200},
                "message": {"dataType":"string","default":"Successful"},
                "data": {"dataType":"union","subSchemas":[{"ref":"GetProfileResponse"},{"dataType":"enum","enums":[null]}],"default":null},
            },
            "additionalProperties": false,
        },
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        "RegisterRequest": {
            "dataType": "refObject",
            "properties": {
                "email": {"dataType":"string","required":true},
                "password": {"dataType":"string","required":true},
                "name": {"dataType":"string","required":true},
                "dateOfBirth": {"dataType":"datetime"},
                "phoneNumber": {"dataType":"string"},
            },
            "additionalProperties": false,
        },
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        "TokenResponse": {
            "dataType": "refObject",
            "properties": {
                "accessToken": {"dataType":"string","required":true},
                "refreshToken": {"dataType":"string","required":true},
                "expireAt": {"dataType":"string","required":true},
            },
            "additionalProperties": false,
        },
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        "BaseResponse_TokenResponse_": {
            "dataType": "refObject",
            "properties": {
                "statusCode": {"dataType":"double","default":200},
                "message": {"dataType":"string","default":"Successful"},
                "data": {"dataType":"union","subSchemas":[{"ref":"TokenResponse"},{"dataType":"enum","enums":[null]}],"default":null},
            },
            "additionalProperties": false,
        },
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        "LoginRequest": {
            "dataType": "refObject",
            "properties": {
                "email": {"dataType":"string","required":true},
                "password": {"dataType":"string","required":true},
            },
            "additionalProperties": false,
        },
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        "BaseResponse_string_": {
            "dataType": "refObject",
            "properties": {
                "statusCode": {"dataType":"double","default":200},
                "message": {"dataType":"string","default":"Successful"},
                "data": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"default":null},
            },
            "additionalProperties": false,
        },
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    };
    const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




        export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################



            const argsUserController_register: Record<string, TsoaRoute.ParameterSchema> = {
            body: {"in":"body","name":"body","required":true,"ref":"ConfirmEmailRequest"},
            };
            app.post('/api/users/confirm-email',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.register)),

            async function UserController_register(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_register, request, response });

                const controller = container.resolve(UserController);

            await templateService.apiHandler({
            methodName: 'register',
            controller,
            response,
            next,
            validatedArgs,
            successStatus: 202,
            });
            } catch (err) {
            return next(err);
            }
            });
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            const argsUserController_resendEmail: Record<string, TsoaRoute.ParameterSchema> = {
            body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true}}},
            };
            app.post('/api/users/resend-email',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.resendEmail)),

            async function UserController_resendEmail(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_resendEmail, request, response });

                const controller = container.resolve(UserController);

            await templateService.apiHandler({
            methodName: 'resendEmail',
            controller,
            response,
            next,
            validatedArgs,
            successStatus: 201,
            });
            } catch (err) {
            return next(err);
            }
            });
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            const argsUserController_forgotPassword: Record<string, TsoaRoute.ParameterSchema> = {
            body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true}}},
            };
            app.post('/api/users/forgot-password',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.forgotPassword)),

            async function UserController_forgotPassword(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_forgotPassword, request, response });

                const controller = container.resolve(UserController);

            await templateService.apiHandler({
            methodName: 'forgotPassword',
            controller,
            response,
            next,
            validatedArgs,
            successStatus: 201,
            });
            } catch (err) {
            return next(err);
            }
            });
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            const argsUserController_recoverPassword: Record<string, TsoaRoute.ParameterSchema> = {
            body: {"in":"body","name":"body","required":true,"ref":"RecoveryPasswordRequest"},
            };
            app.put('/api/users/recover-password',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.recoverPassword)),

            async function UserController_recoverPassword(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_recoverPassword, request, response });

                const controller = container.resolve(UserController);

            await templateService.apiHandler({
            methodName: 'recoverPassword',
            controller,
            response,
            next,
            validatedArgs,
            successStatus: 202,
            });
            } catch (err) {
            return next(err);
            }
            });
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            const argsUserController_getProfile: Record<string, TsoaRoute.ParameterSchema> = {
            req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };
            app.get('/api/users/profile',
                authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getProfile)),

            async function UserController_getProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
            validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getProfile, request, response });

                const controller = container.resolve(UserController);

            await templateService.apiHandler({
            methodName: 'getProfile',
            controller,
            response,
            next,
            validatedArgs,
            successStatus: 200,
            });
            } catch (err) {
            return next(err);
            }
            });
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            const argsAuthController_register: Record<string, TsoaRoute.ParameterSchema> = {
            body: {"in":"body","name":"body","required":true,"ref":"RegisterRequest"},
            };
            app.post('/api/auths/register',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.register)),

            async function AuthController_register(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_register, request, response });

                const controller = container.resolve(AuthController);

            await templateService.apiHandler({
            methodName: 'register',
            controller,
            response,
            next,
            validatedArgs,
            successStatus: 201,
            });
            } catch (err) {
            return next(err);
            }
            });
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            const argsAuthController_login: Record<string, TsoaRoute.ParameterSchema> = {
            body: {"in":"body","name":"body","required":true,"ref":"LoginRequest"},
            req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };
            app.post('/api/auths/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_login, request, response });

                const controller = container.resolve(AuthController);

            await templateService.apiHandler({
            methodName: 'login',
            controller,
            response,
            next,
            validatedArgs,
            successStatus: 200,
            });
            } catch (err) {
            return next(err);
            }
            });
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            const argsAuthController_logout: Record<string, TsoaRoute.ParameterSchema> = {
            req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };
            app.post('/api/auths/logout',
                authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.logout)),

            async function AuthController_logout(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_logout, request, response });

                const controller = container.resolve(AuthController);

            await templateService.apiHandler({
            methodName: 'logout',
            controller,
            response,
            next,
            validatedArgs,
            successStatus: 202,
            });
            } catch (err) {
            return next(err);
            }
            });
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            const argsAuthController_renewToken: Record<string, TsoaRoute.ParameterSchema> = {
            req: {"in":"request","name":"req","required":true,"dataType":"object"},
            body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"refreshToken":{"dataType":"string","required":true}}},
            };
            app.post('/api/auths/access-token',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.renewToken)),

            async function AuthController_renewToken(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
            validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_renewToken, request, response });

                const controller = container.resolve(AuthController);

            await templateService.apiHandler({
            methodName: 'renewToken',
            controller,
            response,
            next,
            validatedArgs,
            successStatus: 201,
            });
            } catch (err) {
            return next(err);
            }
            });
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

        function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

        // keep track of failed auth attempts so we can hand back the most
        // recent one.  This behavior was previously existing so preserving it
        // here
        const failedAttempts: any[] = [];
        const pushAndRethrow = (error: any) => {
        failedAttempts.push(error);
        throw error;
        };

        const secMethodOrPromises: Promise<any>[] = [];
        for (const secMethod of security) {
        if (Object.keys(secMethod).length > 1) {
        const secMethodAndPromises: Promise<any>[] = [];

        for (const name in secMethod) {
        secMethodAndPromises.push(
        expressAuthenticationRecasted(request, name, secMethod[name], response)
        .catch(pushAndRethrow)
        );
        }

        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

        secMethodOrPromises.push(Promise.all(secMethodAndPromises)
        .then(users => { return users[0]; }));
        } else {
        for (const name in secMethod) {
        secMethodOrPromises.push(
        expressAuthenticationRecasted(request, name, secMethod[name], response)
        .catch(pushAndRethrow)
        );
        }
        }
        }

        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

        try {
        request['user'] = await Promise.any(secMethodOrPromises);

        // Response was sent in middleware, abort
        if (response.writableEnded) {
        return;
        }

        next();
        }
        catch(err) {
        // Show most recent error as response
        const error = failedAttempts.pop();
        error.status = error.status || 401;

        // Response was sent in middleware, abort
        if (response.writableEnded) {
        return;
        }
        next(error);
        }

        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
        }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa