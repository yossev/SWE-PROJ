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
exports.TopicSchema = exports.Topic = void 0;
/* eslint-disable prettier/prettier */
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongoose_3 = require("mongoose");
let Topic = (() => {
    let _classDecorators = [(0, mongoose_1.Schema)({ timestamps: true })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = mongoose_2.Document;
    let _topicTitle_decorators;
    let _topicTitle_initializers = [];
    let _topicTitle_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _forum_id_decorators;
    let _forum_id_initializers = [];
    let _forum_id_extraInitializers = [];
    var Topic = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.topicTitle = __runInitializers(this, _topicTitle_initializers, void 0); // Title of the Topic (representing the topic)
            this.description = (__runInitializers(this, _topicTitle_extraInitializers), __runInitializers(this, _description_initializers, void 0)); // Description of the Topic
            this.forum_id = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _forum_id_initializers, void 0));
            __runInitializers(this, _forum_id_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Topic");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _topicTitle_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _description_decorators = [(0, mongoose_1.Prop)({ required: true })];
        _forum_id_decorators = [(0, mongoose_1.Prop)({ type: mongoose_3.Schema.Types.ObjectId, ref: 'Forum', required: true })];
        __esDecorate(null, null, _topicTitle_decorators, { kind: "field", name: "topicTitle", static: false, private: false, access: { has: obj => "topicTitle" in obj, get: obj => obj.topicTitle, set: (obj, value) => { obj.topicTitle = value; } }, metadata: _metadata }, _topicTitle_initializers, _topicTitle_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _forum_id_decorators, { kind: "field", name: "forum_id", static: false, private: false, access: { has: obj => "forum_id" in obj, get: obj => obj.forum_id, set: (obj, value) => { obj.forum_id = value; } }, metadata: _metadata }, _forum_id_initializers, _forum_id_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Topic = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Topic = _classThis;
})();
exports.Topic = Topic;
exports.TopicSchema = mongoose_1.SchemaFactory.createForClass(Topic);
