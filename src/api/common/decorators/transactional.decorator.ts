import {IUnitOfWork} from "../../repositories/interfaces/unitofwork.interface";
export function Transactional(): MethodDecorator {
    return function (target, propertyKey, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]): Promise<any> {
            const context = this as { unitOfWork: IUnitOfWork };

            if (!context.unitOfWork || typeof context.unitOfWork.start !== 'function') {
                throw new Error(
                    `@Transactional: Missing or invalid unitOfWork on class method ${String(propertyKey)}`
                );
            }

            await context.unitOfWork.start();

            try {
                return await originalMethod.apply(context, args);
            } catch (err) {
                await context.unitOfWork.abort();
                throw err;
            } finally {
                await context.unitOfWork.end();
            }
        };

        return descriptor;
    };
}