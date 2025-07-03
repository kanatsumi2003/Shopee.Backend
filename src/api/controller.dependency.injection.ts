import {container} from "tsyringe";
import {AuthController} from "./controllers/auth.controller";
import {registerServiceDependencies} from "./services/service.dependency.injection";
import {UserController} from "./controllers/user.controller";

export async function registerControllerDependencies() {
    container.register<AuthController>(AuthController, { useClass: AuthController })
    container.register<UserController>(UserController, { useClass: UserController })
}