"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
/**
 * Class for the callback function
 * @class
 * @classdesc Class used to define the callback function.
 */
var CallbackSubscribedEvent = /** @class */ (function () {
    function CallbackSubscribedEvent(callback, once) {
        this.callback = callback;
        this.once = once;
    }
    return CallbackSubscribedEvent;
}());
/**
 * Class event subscribed to the emitter
 * @class
 * @classdesc Class used to store the Event and his callback function.
 */
var SubscribedEvent = /** @class */ (function () {
    function SubscribedEvent() {
        this.callbackSubscribed = [];
        this.subscription = 0;
    }
    /**
     * function use add a CallbackSubscribedEvent to class
     * @function add
     * @param {CallbackSubscribedEvent} callback  -  CallbackSubscribedEvent class
     * @return {number}  -  return number of subscription
     */
    SubscribedEvent.prototype.add = function (callback) {
        this.callbackSubscribed.push(callback);
        this.subscription++;
        return this.subscription;
    };
    ;
    /**
     * function use remove CallbackSubscribedEvent . if the callback is empty delete every CallbackSubscribedEvent.
     * @function remove
     * @param {CallbackSubscribedEvent} callback  -  CallbackSubscribedEvent class
     * @return {number}  -  return number of subscription
     */
    SubscribedEvent.prototype.remove = function (callback) {
        if (callback) {
            this.callbackSubscribed = this.callbackSubscribed.filter(function (event) {
                return event.callback !== callback;
            });
            this.subscription = this.callbackSubscribed.length;
        }
        else {
            this.callbackSubscribed = [];
            this.subscription = 0;
        }
    };
    ;
    /**
     * function use execute the callback.
     * @function execute
     * @param {args} args -  Zero or more arguments to pass to the subscribed functions
     */
    SubscribedEvent.prototype.execute = function (args) {
        this.callbackSubscribed.forEach(function (subscription) {
            subscription.callback.apply(this, args);
            if (subscription.once) {
                this.remove(subscription.callback);
            }
        }, this);
    };
    return SubscribedEvent;
}());
/**
 * Class use to display a message error
 * @class
 * @classdesc Class use to validate the error that extends a Error class.
 */
var ValidationError = /** @class */ (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(message) {
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.name = "Validation  Error";
        return _this;
    }
    return ValidationError;
}(Error));
/**
 * The emitter class provides a publish/subscribe model of communication via events.
 * @class
 * @classdesc Class that implements an Emitter function
 * @implements {Emitter}
 */
var MyEmitter = /** @class */ (function () {
    /**
     * @constructor
     */
    function MyEmitter() {
        this.events = new Object();
    }
    /**
     * Unsubscribe an event name and all its subscribed functions or unsubscribe an event name and the function provided only
     * @function on
     * @param {string} event - A string contain the event name
     * @param {string} callback  -  Function to call when the event name is triggered
     * @return {number}  -  The current number of subscribers for the event name
     * @throws {ValidationError} If the event name is not a string data type or the function is not a function data type.
     */
    MyEmitter.prototype.on = function (event, callback) {
        this.inputParametersValidation(event, callback);
        return this.setSubscription(event, callback, false);
    };
    /**
     * Subscribe a function to be called every time the event name is triggered
     * @function off
     * @param {string} event - A string contain the event name
     * @param {string} callback  -  Function to call when the event name is triggered
     * @return {number}  -  The current number of subscribers for the event name
     * @throws {ValidationError} If the event name is not a string data type or the function is not a function data type.
     */
    MyEmitter.prototype.off = function (event, callback) {
        this.inputParametersValidation(event, callback);
        var totalSubscription = 0;
        if (this.events[event]) {
            this.events[event].remove(callback);
            totalSubscription = this.events[event].subscription;
            if (totalSubscription == 0) {
                delete this.events[event];
            }
            return totalSubscription;
        }
        return totalSubscription;
    };
    /**
     * Subscribe a function to be called only once for when the event name is triggered
     * @function once
     * @param {string} event - A string contain the event name
     * @param {string} callback  -  Function to call when the event name is triggered
     * @return {number}  -  The current number of subscribers for the event name
     * @throws {ValidationError} If the event name is not a string data type or the function is not a function data type.
     */
    MyEmitter.prototype.once = function (event, callback) {
        this.inputParametersValidation(event, callback);
        return this.setSubscription(event, callback, true);
    };
    /**
     * Trigger an event name with optional arguments
     * @function trigger
     * @param {string} event - A string contain the event name
     * @param {args} args  -  Zero or more arguments to pass to the subscribed functions
     * @return {boolean}  -  True, the event name has subscribers; otherwise, false
     * @throws {ValidationError} If the event name is not a string data type.
     */
    MyEmitter.prototype.trigger = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.inputParametersValidation(event);
        if (this.events[event]) {
            this.events[event].execute(args);
            return true;
        }
        return false;
    };
    /**
     * set a subscriber event with his callback and once proprieties
     * @function setSubscription
     * @param {string} eventName - A string contain the event name
     * @param {function} callback  -  Function to call when the event name is triggered
     * @param {boolean} once  -  property use to say if the function can be called only once
     * @return {number}  -  return the number of subscription
     */
    MyEmitter.prototype.setSubscription = function (eventName, callback, once) {
        if (!this.events.hasOwnProperty(eventName)) {
            this.events[eventName] = new SubscribedEvent();
        }
        this.events[eventName].add(new CallbackSubscribedEvent(callback, once));
        return this.events[eventName].subscription;
    };
    /**
     * function use to check the input value
     * @function inputParametersValidation
     * @param {string} eventName - A string contain the event name
     * @param {function} callback  -  Function to call when the event name is triggered
     * @throws {ValidationError} If the event name is not a string data type.
     */
    MyEmitter.prototype.inputParametersValidation = function (eventName, callback) {
        try {
            this.subscriptionName(eventName);
            this.subscriptionFunction(callback);
        }
        catch (err) {
            if (err instanceof ValidationError) {
                alert("Invalid data: " + err.message);
            }
            else {
                throw err; // unknown error, rethrow it
            }
        }
    };
    /**
     * function use to check the input value
     * @function subscriptionName
     * @param {string} eventName - A string contain the event name
     * @return {boolean}  -  return true if everything is ok
     * @throws {ValidationError} If the event name is not a string data type.
     */
    MyEmitter.prototype.subscriptionName = function (eventName) {
        if (typeof eventName !== 'string') {
            throw new ValidationError("event name is not a string");
        }
        return true;
    };
    /**
     * function use to check if the callback function is a function
     * @function subscriptionFunction
     * @param {function} callback  -  Function to call when the event name is triggered
     * @return {boolean}  -  return true if everything is ok
     * @throws {ValidationError}  If the function is not a function data type.
     */
    MyEmitter.prototype.subscriptionFunction = function (callback) {
        if (callback && typeof callback !== 'function') {
            throw new ValidationError("subscription arguments is not a function");
        }
        return true;
    };
    return MyEmitter;
}());
exports["default"] = MyEmitter;
