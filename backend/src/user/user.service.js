"use strict";
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
const common_1 = require("@nestjs/common");
// import { Course } from 'src/models/course-schema';
const mongoose_1 = require("mongoose");
// import { LoginDto } from './dto/loginDto.dto';
// import { RefreshAccessTokenDto } from './dto/refreshAccessTokenDto.dto';
let UserService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UserService = _classThis = class {
        constructor(jwtService, userModel, courseModel, progressService, authService) {
            this.jwtService = jwtService;
            this.userModel = userModel;
            this.courseModel = courseModel;
            this.progressService = progressService;
            this.authService = authService;
        }
        create(userData) {
            return __awaiter(this, void 0, void 0, function* () {
                const newUser = new this.userModel(userData); // Create a new student document
                const user = yield newUser.save();
                return user; // Save it to the database
            });
        }
        findAll() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.userModel.find().exec();
            });
        }
        findByName(name) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.userModel.findOne({ name, role: 'instructor' }); // Filter by role
            });
        }
        findByEmail(email) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.userModel.findOne({ email }); // Ensure `_id` is included (default behavior)
            });
        }
        findAllInstructors() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.userModel.find({ role: 'instructor' }).exec();
            });
        }
        findAllByRole(role) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.userModel.find({ role }).exec();
            });
        }
        // instructor or admin Get all students
        findStudentsByInstructor(instructorId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const instructor = this.userModel.findById(instructorId);
                    const courses = yield this.courseModel.find({ instructor: instructorId }).exec();
                    if (courses.length === 0) {
                        return []; // Return an empty list if the instructor has no courses
                    }
                    const courseIds = courses.map((course) => course._id); // Extract course IDs
                    // Find students enrolled in these courses
                    return yield this.userModel.find({ role: 'student', course: { $in: courseIds } }).exec();
                }
                catch (error) {
                    console.error('Token verification failed:', error);
                    throw new common_1.UnauthorizedException('Instructor invalid ');
                }
            });
        }
        // Get a student by ID malhash lazma
        findById(id) {
            return __awaiter(this, void 0, void 0, function* () {
                const student = yield this.userModel.findById(new mongoose_1.Types.ObjectId(id)); // Fetch a student by ID
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
        logout(res) {
            return __awaiter(this, void 0, void 0, function* () {
                res.clearCookie('token');
                res.clearCookie('RefreshToken');
                res.clearCookie('jwt');
                return yield { message: 'Logout successful' };
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
