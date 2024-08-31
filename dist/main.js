"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.enableCors({
        origin: 'https://rbms-frontend-6uzv.vercel.app',
        methods: 'GET,POST,DELETE,PUT',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true
    });
    await app.listen(5000);
}
bootstrap();
//# sourceMappingURL=main.js.map