import swaggerUi from 'swagger-ui-express';
//import swaggerDocument from './swagger-output.json';
import swaggerDocument from '../../build/swagger.json'

function setupSwagger(app: any) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

export default setupSwagger;