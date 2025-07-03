"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_1 = __importDefault(require("./src/swagger/swagger"));
require("reflect-metadata");
const repository_dependency_injection_1 = require("./src/api/repositories/repository.dependency.injection");
dotenv_1.default.config();
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, repository_dependency_injection_1.registerRepositoryDependencies)();
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        // Use swagger
        (0, swagger_1.default)(app);
        // Expose app port using
        app.listen(process.env.PORT || 3000);
    });
}
bootstrap();
