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
exports.CreateThreadDto = void 0;
/* eslint-disable prettier/prettier */
const class_validator_1 = require("class-validator");
//import { Types } from 'mongoose';
let CreateThreadDto = (() => {
    var _a;
    let _threadId_decorators;
    let _threadId_initializers = [];
    let _threadId_extraInitializers = [];
    let _threadTitle_decorators;
    let _threadTitle_initializers = [];
    let _threadTitle_extraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _content_extraInitializers = [];
    let _forum_decorators;
    let _forum_initializers = [];
    let _forum_extraInitializers = [];
    let _createdBy_decorators;
    let _createdBy_initializers = [];
    let _createdBy_extraInitializers = [];
    let _topics_decorators;
    let _topics_initializers = [];
    let _topics_extraInitializers = [];
    return _a = class CreateThreadDto {
            constructor() {
                this.threadId = __runInitializers(this, _threadId_initializers, void 0); // The title of the thread
                this.threadTitle = (__runInitializers(this, _threadId_extraInitializers), __runInitializers(this, _threadTitle_initializers, void 0)); // The title of the thread
                this.content = (__runInitializers(this, _threadTitle_extraInitializers), __runInitializers(this, _content_initializers, void 0)); // The content of the thread
                this.forum = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _forum_initializers, void 0));
                this.createdBy = (__runInitializers(this, _forum_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0)); // The user who created the thread
                this.topics = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _topics_initializers, void 0));
                __runInitializers(this, _topics_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _threadId_decorators = [(0, class_validator_1.IsMongoId)(), (0, class_validator_1.IsNotEmpty)()];
            _threadTitle_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _content_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _forum_decorators = [(0, class_validator_1.IsMongoId)(), (0, class_validator_1.IsNotEmpty)()];
            _createdBy_decorators = [(0, class_validator_1.IsMongoId)(), (0, class_validator_1.IsNotEmpty)()];
            _topics_decorators = [(0, class_validator_1.IsMongoId)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _threadId_decorators, { kind: "field", name: "threadId", static: false, private: false, access: { has: obj => "threadId" in obj, get: obj => obj.threadId, set: (obj, value) => { obj.threadId = value; } }, metadata: _metadata }, _threadId_initializers, _threadId_extraInitializers);
            __esDecorate(null, null, _threadTitle_decorators, { kind: "field", name: "threadTitle", static: false, private: false, access: { has: obj => "threadTitle" in obj, get: obj => obj.threadTitle, set: (obj, value) => { obj.threadTitle = value; } }, metadata: _metadata }, _threadTitle_initializers, _threadTitle_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _forum_decorators, { kind: "field", name: "forum", static: false, private: false, access: { has: obj => "forum" in obj, get: obj => obj.forum, set: (obj, value) => { obj.forum = value; } }, metadata: _metadata }, _forum_initializers, _forum_extraInitializers);
            __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: obj => "createdBy" in obj, get: obj => obj.createdBy, set: (obj, value) => { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
            __esDecorate(null, null, _topics_decorators, { kind: "field", name: "topics", static: false, private: false, access: { has: obj => "topics" in obj, get: obj => obj.topics, set: (obj, value) => { obj.topics = value; } }, metadata: _metadata }, _topics_initializers, _topics_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CreateThreadDto = CreateThreadDto;
