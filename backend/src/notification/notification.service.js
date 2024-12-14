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
exports.NotificationService = void 0;
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
let NotificationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var NotificationService = _classThis = class {
        constructor(notificationModel, messageModel) {
            this.notificationModel = notificationModel;
            this.messageModel = messageModel;
        }
        // Notify about a new course creation
        notifyCourseCreation(userId, courseId, courseName) {
            return __awaiter(this, void 0, void 0, function* () {
                const message = `A new course "${courseName}" has been created.`;
                try {
                    const notification = new this.notificationModel({
                        userId,
                        message,
                        relatedMessageId: courseId, // Link the course ID for tracking
                    });
                    return yield notification.save();
                }
                catch (error) {
                    console.error('Error creating course notification:', error);
                    throw new Error('Failed to create course notification');
                }
            });
        }
        // Create a generic notification
        createNotification(userId, message, relatedMessageId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // If a relatedMessageId is provided, append its content to the notification
                    if (relatedMessageId) {
                        const relatedMessage = yield this.messageModel.findById(relatedMessageId).lean();
                        if (relatedMessage && relatedMessage.content) {
                            message += `: "${relatedMessage.content}"`;
                        }
                    }
                    const notification = new this.notificationModel({
                        userId,
                        message,
                        relatedMessageId,
                    });
                    return yield notification.save();
                }
                catch (error) {
                    console.error('Error creating notification:', error);
                    throw new Error('Failed to create notification');
                }
            });
        }
        // Get all notifications for a user
        getUserNotifications(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec();
            });
        }
        // Mark a notification as read
        markAsRead(notificationId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.notificationModel.findByIdAndUpdate(notificationId, { read: true }, { new: true });
            });
        }
        // Get notifications with additional message content
        getUserNotificationsWithMessages(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.notificationModel
                    .find({ userId })
                    .sort({ createdAt: -1 })
                    .populate('relatedMessageId', 'content createdAt userId') // Populate message fields
                    .exec();
            });
        }
        // Get unread notifications for a user
        getUnreadNotifications(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.notificationModel
                    .find({ userId: new mongoose_1.Types.ObjectId(userId), read: false })
                    .select('message createdAt read')
                    .exec();
            });
        }
    };
    __setFunctionName(_classThis, "NotificationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationService = _classThis;
})();
exports.NotificationService = NotificationService;
