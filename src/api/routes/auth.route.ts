import {Router} from "express";
import {container} from "tsyringe";
import {AuthController} from "../controllers/auth.controller";
import {RegisterRequest} from "../services/models/requests/auth/register.request";

const router = Router();

const authController = container.resolve(AuthController);

//router.post('/register', authController.register.bind(authController));

export default router;