"use strict";
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const authentication_guards_1 = require("../auth/guards/authentication.guards");
const public_decorator_1 = require("../auth/decorators/public.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const authorization_guards_1 = require("../auth/guards/authorization.guards");
// @UseGuards(AuthGuard) //class level
let UserController = (() => {
    let _classDecorators = [(0, common_1.Controller)('users')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getAllStudents_decorators;
    let _getUserById_decorators;
    let _login_decorators;
    let _register_decorators;
    let _updateUserProfile_decorators;
    let _deleteUser_decorators;
    let _getCompletedCourses_decorators;
    let _logout_decorators;
    var UserController = _classThis = class {
        constructor(userService, progressService) {
            this.userService = (__runInitializers(this, _instanceExtraInitializers), userService);
            this.progressService = progressService;
        }
        getAllStudents() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.userService.findAll();
            });
        }
        getUserById(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield this.userService.findById(id);
                return user;
            });
        }
        //Create a new student
        login(loginDto, res) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.userService.login(loginDto, res);
            });
        }
        register(userData) {
            return __awaiter(this, void 0, void 0, function* () {
                // Hash the password before saving
                const passwordHash = yield bcrypt.hash(userData.password_hash, 10);
                userData.password_hash = passwordHash;
                const newUser = yield this.userService.register(userData);
                return newUser;
            });
        }
        // Update a student's details
        updateUserProfile(req, updateData) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("entered function");
                const userId = req.cookies['userId']; // Extract logged-in user's ID from request
                console.log("userId is: ", userId);
                return yield this.userService.update(userId, updateData);
            });
        }
        // Delete a student by ID
        deleteUser(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const deletedUser = yield this.userService.delete(id);
                return deletedUser;
            });
        }
        getCompletedCourses(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.progressService.getCompletedCourses(userId);
            });
        }
        logout(res) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.userService.logout(res);
            });
        }
    };
    __setFunctionName(_classThis, "UserController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getAllStudents_decorators = [(0, common_1.Get)('/all'), (0, roles_decorator_1.Roles)(roles_decorator_1.Role.Instructor, roles_decorator_1.Role.Admin), (0, common_1.UseGuards)(authentication_guards_1.AuthGuard)];
        _getUserById_decorators = [(0, roles_decorator_1.Roles)(roles_decorator_1.Role.Instructor, roles_decorator_1.Role.Admin), (0, common_1.UseGuards)(authorization_guards_1.authorizationGuard), (0, common_1.Get)(':id')];
        _login_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Post)('/login')];
        _register_decorators = [(0, public_decorator_1.Public)(), (0, common_1.Post)('/register')];
        _updateUserProfile_decorators = [(0, common_1.Put)('me')];
        _deleteUser_decorators = [(0, common_1.Delete)(':id')];
        _getCompletedCourses_decorators = [(0, common_1.Get)('completed/:userId')];
        _logout_decorators = [(0, common_1.Post)('logout')];
        __esDecorate(_classThis, null, _getAllStudents_decorators, { kind: "method", name: "getAllStudents", static: false, private: false, access: { has: obj => "getAllStudents" in obj, get: obj => obj.getAllStudents }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUserById_decorators, { kind: "method", name: "getUserById", static: false, private: false, access: { has: obj => "getUserById" in obj, get: obj => obj.getUserById }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _login_decorators, { kind: "method", name: "login", static: false, private: false, access: { has: obj => "login" in obj, get: obj => obj.login }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _register_decorators, { kind: "method", name: "register", static: false, private: false, access: { has: obj => "register" in obj, get: obj => obj.register }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateUserProfile_decorators, { kind: "method", name: "updateUserProfile", static: false, private: false, access: { has: obj => "updateUserProfile" in obj, get: obj => obj.updateUserProfile }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteUser_decorators, { kind: "method", name: "deleteUser", static: false, private: false, access: { has: obj => "deleteUser" in obj, get: obj => obj.deleteUser }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCompletedCourses_decorators, { kind: "method", name: "getCompletedCourses", static: false, private: false, access: { has: obj => "getCompletedCourses" in obj, get: obj => obj.getCompletedCourses }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logout_decorators, { kind: "method", name: "logout", static: false, private: false, access: { has: obj => "logout" in obj, get: obj => obj.logout }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserController = _classThis;
})();
exports.UserController = UserController;
