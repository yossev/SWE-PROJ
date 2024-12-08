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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
let MessageService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MessageService = _classThis = class {
        constructor(messageModel, roomModel, notificationModel, notificationService, userService, roomService) {
            this.messageModel = messageModel;
            this.roomModel = roomModel;
            this.notificationModel = notificationModel;
            this.notificationService = notificationService;
            this.userService = userService;
            this.roomService = roomService;
        }
        // Save a new message to the database
        saveMessage(userId, content, roomId) {
            return __awaiter(this, void 0, void 0, function* () {
                const newMessage = new this.messageModel({ userId, content, roomId });
                return yield newMessage.save();
            });
        }
        // Retrieve all messages from a specific room
        getMessagesByRoom(roomId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.messageModel.find({ roomId }).sort({ createdAt: 1 }); // Sorted by timestamp
            });
        }
        // Send and notify users
        sendMessage(userId, content, roomId, chatType, recipientId) {
            return __awaiter(this, void 0, void 0, function* () {
                const savedMessage = yield this.saveMessage(userId, content, roomId);
                if (chatType === 'group') {
                    yield this.notifyUsersInRoom(roomId, userId, savedMessage);
                }
                if (chatType === 'individual' && recipientId) {
                    yield this.notificationService.createNotification(recipientId.toString(), `New message from ${userId}`, savedMessage._id.toString());
                }
                return savedMessage;
            });
        }
        // Notify all users in the room except the sender
        notifyUsersInRoom(roomId, userId, message) {
            return __awaiter(this, void 0, void 0, function* () {
                const room = yield this.roomModel.findById(roomId).populate('users');
                const usersInRoom = room.user_id.filter(user => user._id.toString() !== userId.toString());
                for (const user of usersInRoom) {
                    yield this.notificationService.createNotification(user._id.toString(), `New message in room ${roomId}: ${message.content}`, message._id.toString());
                }
            });
        }
    };
    __setFunctionName(_classThis, "MessageService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MessageService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MessageService = _classThis;
})();
exports.MessageService = MessageService;
