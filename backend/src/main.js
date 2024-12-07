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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-require-imports */
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const jwtAuthGuard_guard_1 = require("./auth/guards/jwtAuthGuard.guard");
const mongoose = require('mongoose');
const express = require('express');
console.log('JWT_SECRET2:', process.env.JWT_SECRET);
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        yield mongoose.connect(process.env.DATABASE_URL, {}).then(() => {
            console.log('Connected');
        }).catch((err) => {
            console.error('MongoDB connection error:', err);
        });
        app.use(express.json());
        const reflector = app.get(core_1.Reflector);
        app.useGlobalGuards(new jwtAuthGuard_guard_1.JwtAuthGuard(reflector)); // Respect @Public()
        app.listen(3000);
    });
}
bootstrap();
