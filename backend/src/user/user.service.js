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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
/* eslint-disable prettier/prettier */
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
// import { LoginDto } from './dto/loginDto.dto';
// import { RefreshAccessTokenDto } from './dto/refreshAccessTokenDto.dto';
let UserService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UserService = _classThis = class {
        constructor(jwtService, userModel, courseModel) {
            this.jwtService = jwtService;
            this.userModel = userModel;
            this.courseModel = courseModel;
        }
        register(createUserDto) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log('Registering user:', createUserDto);
                const user = new this.userModel(createUserDto); // Create a new student document
                yield this.isEmailUnique(createUserDto.email);
                return yield user.save(); // Save it to the database
            });
        }
        // Login existing user
        login(loginDto) {
            return __awaiter(this, void 0, void 0, function* () {
                const { email, password } = loginDto;
                // 1. Find the user by email
                const user = yield this.userModel.findOne({ email });
                const userId = user._id;
                // 2. Check if the user exists
                if (!user) {
                    throw new common_1.UnauthorizedException('user invalid');
                }
                // 3. Check if the password is correct (e.g., using bcrypt to compare the hashed password)
                const isPasswordValid = yield bcrypt.compare(password, user.password_hash);
                console.log('loginDto.password:', loginDto.password);
                console.log('user.password (hashed):', user.password_hash);
                if (!isPasswordValid) {
                    throw new common_1.UnauthorizedException('Invalid credentials');
                }
                // Generate JWT token
                const token = this.jwtService.sign({ email: user.email, userId: user._id }, { secret: process.env.JWT_SECRET, expiresIn: '1h' }); // Secret key from environment variable
                console.log("Returner control");
                return { token, userId }; // Return the token to the client
            });
        }
        findByName(username) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.userModel.findOne({ username, role: 'instructor' }); // Filter by role
            });
        }
        findByEmail(email) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield this.userModel.findOne({ email });
                return user; // Fetch a student by username
            });
        }
        // instructor or admin Get all students
        findAll(role, instructorId) {
            return __awaiter(this, void 0, void 0, function* () {
                let filter = {};
                if (role === 'student') {
                    // Students should see all instructors
                    filter = { role: 'instructor' };
                }
                else if (role === 'instructor' && instructorId) {
                    if (role === 'instructor' && instructorId) {
                        const courses = yield this.courseModel.find({ instructor: instructorId });
                        const courseIds = courses.map(course => course._id);
                        filter = { role: 'student', course: { $in: courseIds } };
                    }
                    // Instructors should see students in their courses
                    // Assuming "courseInstructor" is a field in the "students" user model
                    filter = { role: 'student', courseInstructor: instructorId };
                }
                else {
                    // Optional: Handle other cases if needed or throw an error
                    throw new Error('Invalid role or missing instructor ID');
                }
                return yield this.userModel.find(filter).exec(); // Execute the query
            });
        }
        // will register
        isEmailUnique(email) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield this.userModel.findOne({ email });
                if (user) {
                    throw new common_1.BadRequestException('Email must be unique.');
                }
            });
        }
        // Get a student by ID malhash lazma
        findById(id) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(id);
                const student = yield this.userModel.findById(id); // Fetch a student by ID
                return student;
            });
        }
        // Update a user's details by ID 
        update(id, updateData) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.userModel.findByIdAndUpdate(id, updateData, { new: true }); // Find and update the student
            });
        }
        // Delete a user  by ID admin bas aw user y delete his account
        delete(currentUserId) {
            return __awaiter(this, void 0, void 0, function* () {
                // Proceed with deleting the user
                const deletedUser = yield this.userModel.findByIdAndDelete(currentUserId);
                if (!deletedUser) {
                    throw new common_1.UnauthorizedException('User not found or deletion failed');
                }
                return deletedUser;
            });
        }
    };
    __setFunctionName(_classThis, "UserService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserService = _classThis;
})();
exports.UserService = UserService;