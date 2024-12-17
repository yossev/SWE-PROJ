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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseSchema = exports.Course = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Course = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _difficulty_level_decorators;
    let _difficulty_level_initializers = [];
    let _difficulty_level_extraInitializers = [];
    let _created_by_decorators;
    let _created_by_initializers = [];
    let _created_by_extraInitializers = [];
    let _created_at_decorators;
    let _created_at_initializers = [];
    let _created_at_extraInitializers = [];
    let _version_decorators;
    let _version_initializers = [];
    let _version_extraInitializers = [];
    var Course = _classThis = class {
        constructor() {
            this.title = __runInitializers(this, _title_initializers, void 0);
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.difficulty_level = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _difficulty_level_initializers, void 0));
            this.created_by = (__runInitializers(this, _difficulty_level_extraInitializers), __runInitializers(this, _created_by_initializers, void 0));
            this.created_at = (__runInitializers(this, _created_by_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
            this.version = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            __runInitializers(this, _version_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Course");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _title_decorators = [(0, mongoose_1.Prop)({ type: String, required: true, minLength: 3, maxLength: 100 })];
        _description_decorators = [(0, mongoose_1.Prop)({ type: String, required: true, minLength: 10, maxLength: 10000 })];
        _category_decorators = [(0, mongoose_1.Prop)({ type: String, required: true, minLength: 2, maxLength: 50 })];
        _difficulty_level_decorators = [(0, mongoose_1.Prop)({ type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })];
        _created_by_decorators = [(0, mongoose_1.Prop)({ type: String, required: true, minLength: 20, maxLength: 500 })];
        _created_at_decorators = [(0, mongoose_1.Prop)({ type: Date, default: new Date(), required: true })];
        _version_decorators = [(0, mongoose_1.Prop)({ type: Boolean, required: true })];
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _difficulty_level_decorators, { kind: "field", name: "difficulty_level", static: false, private: false, access: { has: obj => "difficulty_level" in obj, get: obj => obj.difficulty_level, set: (obj, value) => { obj.difficulty_level = value; } }, metadata: _metadata }, _difficulty_level_initializers, _difficulty_level_extraInitializers);
        __esDecorate(null, null, _created_by_decorators, { kind: "field", name: "created_by", static: false, private: false, access: { has: obj => "created_by" in obj, get: obj => obj.created_by, set: (obj, value) => { obj.created_by = value; } }, metadata: _metadata }, _created_by_initializers, _created_by_extraInitializers);
        __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: obj => "created_at" in obj, get: obj => obj.created_at, set: (obj, value) => { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: obj => "version" in obj, get: obj => obj.version, set: (obj, value) => { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Course = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Course = _classThis;
})();
exports.Course = Course;
exports.CourseSchema = mongoose_1.SchemaFactory.createForClass(Course);
// 
exports.CourseSchema.index({ title: 'text', description: 'text' });
