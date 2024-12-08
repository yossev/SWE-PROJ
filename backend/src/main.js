"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
require('dotenv').config();
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = __importStar(require("cookie-parser"));
const authentication_guards_1 = require("./auth/guards/authentication.guards");
const jwt_1 = require("@nestjs/jwt");
const mongoose = require('mongoose');
const express = require('express');
const url = "mongodb://localhost:27017/";
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Database URL:", process.env.DATABASE);
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        yield mongoose.connect(process.env.DATABASE, {}).then(() => {
            console.log('Connected');
        }).catch((err) => {
            console.error('MongoDB connection error:', err);
            return;
        });
        app.use(express.json());
        const reflector = app.get(core_1.Reflector);
        console.log('Reflector in main.ts:', reflector);
        app.useGlobalGuards(new authentication_guards_1.AuthGuard(new jwt_1.JwtService(), reflector));
        app.use(cookieParser());
        app.listen(3000);
    });
}
bootstrap();
