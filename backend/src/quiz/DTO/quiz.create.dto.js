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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateQuizDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const quiz_question_dto_1 = require("./quiz.question.dto");
const quiz_question_dto_2 = require("./quiz.question.dto");
let CreateQuizDto = (() => {
    var _a;
    let _moduleId_decorators;
    let _moduleId_initializers = [];
    let _moduleId_extraInitializers = [];
    let _questionType_decorators;
    let _questionType_initializers = [];
    let _questionType_extraInitializers = [];
    let _questions_decorators;
    let _questions_initializers = [];
    let _questions_extraInitializers = [];
    let _numberOfQuestions_decorators;
    let _numberOfQuestions_initializers = [];
    let _numberOfQuestions_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _questionIds_decorators;
    let _questionIds_initializers = [];
    let _questionIds_extraInitializers = [];
    return _a = class CreateQuizDto {
            constructor() {
                this.moduleId = __runInitializers(this, _moduleId_initializers, void 0);
                this.questionType = (__runInitializers(this, _moduleId_extraInitializers), __runInitializers(this, _questionType_initializers, void 0));
                this.questions = (__runInitializers(this, _questionType_extraInitializers), __runInitializers(this, _questions_initializers, void 0));
                this.numberOfQuestions = (__runInitializers(this, _questions_extraInitializers), __runInitializers(this, _numberOfQuestions_initializers, void 0));
                this.userId = (__runInitializers(this, _numberOfQuestions_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.questionIds = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _questionIds_initializers, void 0));
                __runInitializers(this, _questionIds_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _moduleId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _questionType_decorators = [(0, class_validator_1.IsEnum)(quiz_question_dto_1.QuestionType)];
            _questions_decorators = [(0, class_validator_1.IsArray)(), (0, class_transformer_1.Type)(() => quiz_question_dto_2.QuestionDto), (0, class_validator_1.IsOptional)()];
            _numberOfQuestions_decorators = [(0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsNumber)()];
            _userId_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _questionIds_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _moduleId_decorators, { kind: "field", name: "moduleId", static: false, private: false, access: { has: obj => "moduleId" in obj, get: obj => obj.moduleId, set: (obj, value) => { obj.moduleId = value; } }, metadata: _metadata }, _moduleId_initializers, _moduleId_extraInitializers);
            __esDecorate(null, null, _questionType_decorators, { kind: "field", name: "questionType", static: false, private: false, access: { has: obj => "questionType" in obj, get: obj => obj.questionType, set: (obj, value) => { obj.questionType = value; } }, metadata: _metadata }, _questionType_initializers, _questionType_extraInitializers);
            __esDecorate(null, null, _questions_decorators, { kind: "field", name: "questions", static: false, private: false, access: { has: obj => "questions" in obj, get: obj => obj.questions, set: (obj, value) => { obj.questions = value; } }, metadata: _metadata }, _questions_initializers, _questions_extraInitializers);
            __esDecorate(null, null, _numberOfQuestions_decorators, { kind: "field", name: "numberOfQuestions", static: false, private: false, access: { has: obj => "numberOfQuestions" in obj, get: obj => obj.numberOfQuestions, set: (obj, value) => { obj.numberOfQuestions = value; } }, metadata: _metadata }, _numberOfQuestions_initializers, _numberOfQuestions_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _questionIds_decorators, { kind: "field", name: "questionIds", static: false, private: false, access: { has: obj => "questionIds" in obj, get: obj => obj.questionIds, set: (obj, value) => { obj.questionIds = value; } }, metadata: _metadata }, _questionIds_initializers, _questionIds_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateQuizDto = CreateQuizDto;