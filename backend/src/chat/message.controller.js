"use strict";
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
exports.MessageController = void 0;
const websockets_1 = require("@nestjs/websockets");
const mongoose_1 = require("mongoose");
let MessageController = (() => {
    let _classDecorators = [(0, websockets_1.WebSocketGateway)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _server_decorators;
    let _server_initializers = [];
    let _server_extraInitializers = [];
    let _handleMessage_decorators;
    let _handleJoinRoom_decorators;
    let _handleLeaveRoom_decorators;
    let _handleGetHistory_decorators;
    var MessageController = _classThis = class {
        constructor(messageService, roomService, userService, notificationService, jwtService) {
            this.messageService = (__runInitializers(this, _instanceExtraInitializers), messageService);
            this.roomService = roomService;
            this.userService = userService;
            this.notificationService = notificationService;
            this.jwtService = jwtService;
            this.server = __runInitializers(this, _server_initializers, void 0);
            __runInitializers(this, _server_extraInitializers);
            this.messageService = messageService;
            this.roomService = roomService;
            this.userService = userService;
            this.notificationService = notificationService;
            this.jwtService = jwtService;
        }
        // Handle sending messages (both group and private)
        // message.controller.ts
        handleMessage(createMessageDto, client) {
            return __awaiter(this, void 0, void 0, function* () {
                const { userId, content, roomId, chatType, recipientId } = createMessageDto;
                const sender = yield this.userService.findById(userId);
                if (!sender) {
                    throw new Error('Sender not found.');
                }
                // Ensure roomId and recipientId are valid ObjectIds
                const savedMessage = yield this.messageService.sendMessage(new mongoose_1.Types.ObjectId(userId), // Ensure userId is an ObjectId
                content, new mongoose_1.Types.ObjectId(roomId), // Ensure roomId is an ObjectId
                chatType, recipientId ? new mongoose_1.Types.ObjectId(recipientId) : undefined);
                // Broadcast the message
                if (chatType === 'group') {
                    client.to(roomId).emit('receive_message', savedMessage);
                }
                else if (chatType === 'individual') {
                    const privateRoomId = yield this.roomService.generatePrivateRoomId(new mongoose_1.Types.ObjectId(userId), new mongoose_1.Types.ObjectId(recipientId));
                    client.to(privateRoomId).emit('receive_message', savedMessage);
                    yield this.notificationService.createNotification(recipientId, `New message from ${sender.name}`, savedMessage._id.toString());
                }
                return { event: 'receive_message', data: savedMessage };
            });
        }
        // Join a room (group chat)
        handleJoinRoom(roomId, client) {
            client.join(roomId); // Join the room
        }
        // Leave a room
        handleLeaveRoom(roomId, client) {
            client.leave(roomId); // Leave the room
        }
        // Get chat history for a room
        handleGetHistory(roomId, client) {
            return __awaiter(this, void 0, void 0, function* () {
                const messages = yield this.messageService.getMessagesByRoom(new mongoose_1.Types.ObjectId(roomId));
                client.emit('chat_history', messages);
            });
        }
    };
    __setFunctionName(_classThis, "MessageController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _server_decorators = [(0, websockets_1.WebSocketServer)()];
        _handleMessage_decorators = [(0, websockets_1.SubscribeMessage)('send_message')];
        _handleJoinRoom_decorators = [(0, websockets_1.SubscribeMessage)('join_room')];
        _handleLeaveRoom_decorators = [(0, websockets_1.SubscribeMessage)('leave_room')];
        _handleGetHistory_decorators = [(0, websockets_1.SubscribeMessage)('get_chat_history')];
        __esDecorate(_classThis, null, _handleMessage_decorators, { kind: "method", name: "handleMessage", static: false, private: false, access: { has: obj => "handleMessage" in obj, get: obj => obj.handleMessage }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleJoinRoom_decorators, { kind: "method", name: "handleJoinRoom", static: false, private: false, access: { has: obj => "handleJoinRoom" in obj, get: obj => obj.handleJoinRoom }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleLeaveRoom_decorators, { kind: "method", name: "handleLeaveRoom", static: false, private: false, access: { has: obj => "handleLeaveRoom" in obj, get: obj => obj.handleLeaveRoom }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleGetHistory_decorators, { kind: "method", name: "handleGetHistory", static: false, private: false, access: { has: obj => "handleGetHistory" in obj, get: obj => obj.handleGetHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _server_decorators, { kind: "field", name: "server", static: false, private: false, access: { has: obj => "server" in obj, get: obj => obj.server, set: (obj, value) => { obj.server = value; } }, metadata: _metadata }, _server_initializers, _server_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MessageController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MessageController = _classThis;
})();
exports.MessageController = MessageController;