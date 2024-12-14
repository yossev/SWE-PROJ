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
exports.CourseService = void 0;
/* eslint-disable prettier/prettier */
const common_1 = require("@nestjs/common");
let CourseService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CourseService = _classThis = class {
        constructor(courseModel, notificationService // Inject NotificationService
        ) {
            this.courseModel = courseModel;
            this.notificationService = notificationService;
        }
        // Create a new course and notify the user
        create(createCourseDto) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const createdCourse = new this.courseModel(createCourseDto);
                    const savedCourse = yield createdCourse.save();
                    // Notify the course creator
                    const userId = createCourseDto.created_by; // Use the `created_by` property as userId
                    const courseName = createCourseDto.title; // Use the `title` property as the course name
                    yield this.notificationService.notifyCourseCreation(userId, // Creator of the course
                    savedCourse._id.toString(), // Saved course ID
                    courseName // Course title
                    );
                    return savedCourse;
                }
                catch (error) {
                    console.error('Error creating course:', error);
                    throw new Error('Failed to create course');
                }
            });
        }
        // Find all courses
        findAll() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.courseModel.find().exec();
            });
        }
        // Find a course by ID
        findOne(id) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.courseModel.findById(id).exec();
            });
        }
        // Update an existing course
        update(id, updateCourseDto) {
            return __awaiter(this, void 0, void 0, function* () {
                const course = yield this.courseModel.findById(id).exec();
                if (course) {
                    course.versions.push(JSON.stringify(course)); // Track changes
                    Object.assign(course, updateCourseDto); // Apply updates
                    return course.save();
                }
                return null;
            });
        }
        // Search for courses based on a search term
        search(searchTerm) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.courseModel
                    .find({
                    $text: { $search: searchTerm }, // Use full-text search
                })
                    .exec();
            });
        }
        // Delete a course by ID
        delete(id) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.courseModel.findByIdAndDelete(id).exec();
            });
        }
    };
    __setFunctionName(_classThis, "CourseService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CourseService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CourseService = _classThis;
})();
exports.CourseService = CourseService;
