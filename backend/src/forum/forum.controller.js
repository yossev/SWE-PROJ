"use strict";
/* eslint-disable prettier/prettier */
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
exports.ForumController = void 0;
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("src/auth/decorators/roles.decorator");
let ForumController = (() => {
    let _classDecorators = [(0, common_1.Controller)('forums')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getForums_decorators;
    let _deleteForum_decorators;
    let _createReply_decorators;
    let _createForum_decorators;
    var ForumController = _classThis = class {
        constructor(forumService) {
            this.forumService = (__runInitializers(this, _instanceExtraInitializers), forumService);
        }
        // Endpoint to get all forums
        getForums() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.forumService.getForums();
            });
        }
        deleteForum(id, creatorId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.forumService.deleteForum(id, creatorId);
            });
        }
        /*
        // Endpoint to create a folder (Restricted to Instructor role)
        @Roles(Role.Instructor)
        @Post('folder')
        async createFolder(@Body() createFolderDto: CreateFolderDto) {
          return this.forumService.createFolder(createFolderDto);
        }
          */
        /*
        // Endpoint to create a thread (Restricted to Instructor and Student roles)
        @Roles(Role.Instructor, Role.Student)
        @Post('thread')
        async createThread(@Body() createThreadDto: CreateThreadDto) {
          return this.forumService.createThread(createThreadDto);
        }
          */
        // Endpoint to create a reply (Restricted to Instructor and Student roles)
        createReply(createReplyDto) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.forumService.createReply(createReplyDto);
            });
        }
        // Endpoint to create a forum (Restricted to Instructor role)
        createForum(createForumDto) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.forumService.createForum(createForumDto);
            });
        }
    };
    __setFunctionName(_classThis, "ForumController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getForums_decorators = [(0, roles_decorator_1.Roles)(roles_decorator_1.Role.Instructor, roles_decorator_1.Role.Student), (0, common_1.Get)()];
        _deleteForum_decorators = [(0, common_1.Delete)('delete')];
        _createReply_decorators = [(0, roles_decorator_1.Roles)(roles_decorator_1.Role.Instructor, roles_decorator_1.Role.Student), (0, common_1.Post)('reply')];
        _createForum_decorators = [(0, roles_decorator_1.Roles)(roles_decorator_1.Role.Instructor), (0, common_1.Post)('create')];
        __esDecorate(_classThis, null, _getForums_decorators, { kind: "method", name: "getForums", static: false, private: false, access: { has: obj => "getForums" in obj, get: obj => obj.getForums }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteForum_decorators, { kind: "method", name: "deleteForum", static: false, private: false, access: { has: obj => "deleteForum" in obj, get: obj => obj.deleteForum }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createReply_decorators, { kind: "method", name: "createReply", static: false, private: false, access: { has: obj => "createReply" in obj, get: obj => obj.createReply }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createForum_decorators, { kind: "method", name: "createForum", static: false, private: false, access: { has: obj => "createForum" in obj, get: obj => obj.createForum }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ForumController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ForumController = _classThis;
})();
exports.ForumController = ForumController;
