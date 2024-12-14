"use strict";
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
/* eslint-disable prettier/prettier */
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
        // Login existing user
        /*async login(loginDto: LoginDto, res: Response) {
          console.log('Logging in');
           const { email, password } = loginDto;
      
             // 1. Find the user by email
           const user = await this.userModel.findOne({ email });
            if (!user) {
              throw new UnauthorizedException('User not found');
           }
           const id=user._id;
      
           // 2. Check if the password is correct
           const isPasswordValid = await bcrypt.compare(password, user.password_hash);
           if (!isPasswordValid) {
             throw new UnauthorizedException('Invalid credentials');
           }
      
           // 3. Generate tokens
            const accessToken = this.jwtService.sign(
              { email: user.email, userId: user._id },
              { secret: process.env.JWT_SECRET, expiresIn: '1h' },
            );
            console.log('entering refresh token');
            const refreshToken = await this.authService.generateRefreshToken(user._id.toString());
            console.log('finshing refresh token');
          // 4. Set tokens as cookies
          res.cookie('AccessToken', accessToken, {
             httpOnly: true,
              //secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
              maxAge: 60 * 60 * 1000, // 1 hour
           });
           console.log('finished first');
          res.cookie('RefreshToken', refreshToken, {
              httpOnly: true,
              //secure: process.env.NODE_ENV === 'production',
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });
      console.log('finished cookies');
          // 5. Return response (if needed)
            return { message: 'Login successful', userId: id };
          }*/
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
                return this.userModel.findOne({ email }).exec(); // Ensure `_id` is included (default behavior)
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
                if (!mongoose_1.Types.ObjectId.isValid(instructorId)) {
                    throw new common_1.BadRequestException('Invalid instructor ID');
                }
                const validInstructorId = new mongoose_1.Types.ObjectId(instructorId);
                // Find courses taught by this instructor
                const courses = yield this.courseModel.find({ instructor: validInstructorId }).exec();
                if (courses.length === 0) {
                    return []; // Return an empty list if the instructor has no courses
                }
                const courseIds = courses.map((course) => course._id); // Extract course IDs
                // Find students enrolled in these courses
                return yield this.userModel.find({ role: 'student', course: { $in: courseIds } }).exec();
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
        /* async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
           const userId = await this.authService.findRefreshToken(
             refreshAccessTokenDto.refreshToken
           );
           const user = await this.userModel.findById(userId);
           if (!user) {
             throw new BadRequestException('Bad request');
           }
           return {
             accessToken: await this.authService.createAccessToken(user._id.toString()),
           };
         }*/
        logout(res) {
            return __awaiter(this, void 0, void 0, function* () {
                res.clearCookie('AccessToken');
                res.clearCookie('RefreshToken');
                return { message: 'Logout successful' };
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
// ngebha men courses
// async findAllCourses(): Promise<Course[]> {
//     return await this.courseModel.find(); // Fetch all courses
// }
// async findEnrolledCourses(): Promise<Course[]> {
//     return await this.courseModel.find(); // Fetch all courses
// }
// async login(req: Request, loginDto: LoginDto): Promise<{ user: User, jwtToken: string, refreshToken: string }> {
//     const user = await this.findByEmail(loginDto.email);
//     await this.checkPassword(loginDto.password, user.password_hash);
//     const result = {
//       user,
//       jwtToken: await this.authService.createAccessToken(user._id.toString()),
//       refreshToken: await this.authService.createRefreshToken(req, user._id),
//     };
//     return result;
//   }
//   async checkPassword(password: string, hashPassword: string) {
//     const match = await bcrypt.compare(password, hashPassword);
//     if (!match) {
//       throw new UnauthorizedException('Wrong email or password.');
//     }
//   }
//   async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
//     const userId = await this.authService.findRefreshToken(
//       refreshAccessTokenDto.refreshToken,
//     );
//     const user = await this.userModel.findById(userId);
//     if (!user) {
//       throw new BadRequestException('Bad request');
//     }
//     return {
//       accessToken: await this.authService.createAccessToken(user._id),
//     };
//   }
