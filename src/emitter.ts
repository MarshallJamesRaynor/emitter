/**
 * Interface with a emitter declaration
 *
 * @interface Emitter
 */
interface Emitter {
    /**
     * Unsubscribe an event name and all its subscribed functions or unsubscribe an event name and the function provided only
     * @function on
     * @param {string} event - A string contain the event name
     * @param {string} callback  -  Function to call when the event name is triggered
     * @return {number}  -  The current number of subscribers for the event name
     * @throws {ValidationError} If the event name is not a string data type or the function is not a function data type.
     */
    on(event:string,callback:any) : number;

    /**
     * Subscribe a function to be called every time the event name is triggered
     * @function off
     * @param {string} event - A string contain the event name
     * @param {string} callback  -  Function to call when the event name is triggered
     * @return {number}  -  The current number of subscribers for the event name
     * @throws {ValidationError} If the event name is not a string data type or the function is not a function data type.
     */
    off(event:string,callback:any): number;

    /**
     * Subscribe a function to be called only once for when the event name is triggered
     * @function once
     * @param {string} event - A string contain the event name
     * @param {string} callback  -  Function to call when the event name is triggered
     * @return {number}  -  The current number of subscribers for the event name
     * @throws {ValidationError} If the event name is not a string data type or the function is not a function data type.
     */
    once(event:string,callback:any): number;

    /**
     * Trigger an event name with optional arguments
     * @function trigger
     * @param {string} event - A string contain the event name
     * @param {args} any  -  Zero or more arguments to pass to the subscribed functions
     * @return {boolean}  -  True, the event name has subscribers; otherwise, false
     * @throws {ValidationError} If the event name is not a string data type .
     */
    trigger(event:string,...args:any): boolean;
}

/**
 * Class for the callback function
 * @class
 * @classdesc Class used to define the callback function.
 */
class CallbackSubscribedEvent {
    callback:any;
    once:boolean;
    constructor(callback:any, once:boolean) {
        this.callback = callback;
        this.once = once;
    }
}

/**
 * Class event subscribed to the emitter
 * @class
 * @classdesc Class used to store the Event and his callback function.
 */
class SubscribedEvent {
    callbackSubscribed: CallbackSubscribedEvent[];
    subscription:number;
    constructor() {
        this.callbackSubscribed = [];
        this.subscription = 0;
    }

    /**
     * function use add a CallbackSubscribedEvent to class
     * @function add
     * @param {CallbackSubscribedEvent} callback  -  CallbackSubscribedEvent class
     * @return {number}  -  return number of subscription
     */
    add(callback ?: CallbackSubscribedEvent){
        this.callbackSubscribed.push(callback);
        this.subscription ++;
        return this.subscription;
    };
    /**
     * function use remove CallbackSubscribedEvent . if the callback is empty delete every CallbackSubscribedEvent.
     * @function remove
     * @param {CallbackSubscribedEvent} callback  -  CallbackSubscribedEvent class
     * @return {number}  -  return number of subscription
     */
    remove(callback ?: CallbackSubscribedEvent){
        if(callback) {
            this.callbackSubscribed = this.callbackSubscribed.filter(function (event) {
                return event.callback !== callback;
            });
            this.subscription = this.callbackSubscribed.length;
        }else{
            this.callbackSubscribed = [];
            this.subscription = 0;
        }
    };
    /**
     * function use execute the callback.
     * @function execute
     * @param {args} args -  Zero or more arguments to pass to the subscribed functions
     */
    execute(args){
        this.callbackSubscribed.forEach(function(subscription){
            subscription.callback.apply(this, args);
            if(subscription.once){
                this.remove(subscription.callback);
            }
        },this);
    }
}

/**
 * Class use to display a message error
 * @class
 * @classdesc Class use to validate the error that extends a Error class.
 */
class ValidationError extends Error {
    name:string;
    constructor(public message: string) {
        super(message);
        this.name = "Validation  Error";
    }
}


/**
 * The emitter class provides a publish/subscribe model of communication via events.
 * @class
 * @classdesc Class that implements an Emitter function
 * @implements {Emitter}
 */
export default class MyEmitter implements Emitter{
    /**
     * private variabile use to store all the events
     * @private
     * @type {Object}
     */
    private events: Object;

    /**
     * @constructor
     */
    constructor(){
        this.events  = new Object();
    }

    /**
     * Unsubscribe an event name and all its subscribed functions or unsubscribe an event name and the function provided only
     * @function on
     * @param {string} event - A string contain the event name
     * @param {string} callback  -  Function to call when the event name is triggered
     * @return {number}  -  The current number of subscribers for the event name
     * @throws {ValidationError} If the event name is not a string data type or the function is not a function data type.
     */
    on(event:string,callback?:any){
        this.inputParametersValidation(event,callback);
        return this.setSubscription(event,callback,false);
    }

    /**
     * Subscribe a function to be called every time the event name is triggered
     * @function off
     * @param {string} event - A string contain the event name
     * @param {string} callback  -  Function to call when the event name is triggered
     * @return {number}  -  The current number of subscribers for the event name
     * @throws {ValidationError} If the event name is not a string data type or the function is not a function data type.
     */
    off(event:string,callback?:any){
        this.inputParametersValidation(event,callback);
        let totalSubscription = 0;
        if(this.events[event]) {
            this.events[event].remove(callback);
            totalSubscription  = this.events[event].subscription;
            if(totalSubscription == 0 ){
                delete this.events[event];
            }
            return totalSubscription;
        }
        return totalSubscription;
    }

    /**
     * Subscribe a function to be called only once for when the event name is triggered
     * @function once
     * @param {string} event - A string contain the event name
     * @param {string} callback  -  Function to call when the event name is triggered
     * @return {number}  -  The current number of subscribers for the event name
     * @throws {ValidationError} If the event name is not a string data type or the function is not a function data type.
     */
    once(event:string,callback?:any){
        this.inputParametersValidation(event,callback);
        return this.setSubscription(event,callback,true);
    }

    /**
     * Trigger an event name with optional arguments
     * @function trigger
     * @param {string} event - A string contain the event name
     * @param {args} args  -  Zero or more arguments to pass to the subscribed functions
     * @return {boolean}  -  True, the event name has subscribers; otherwise, false
     * @throws {ValidationError} If the event name is not a string data type.
     */
    trigger(event:string,...args:any){
        this.inputParametersValidation(event);
        if(this.events[event]){
            this.events[event].execute(args);
            return true;
        }
        return false;
    }

    /**
     * set a subscriber event with his callback and once proprieties
     * @function setSubscription
     * @param {string} eventName - A string contain the event name
     * @param {function} callback  -  Function to call when the event name is triggered
     * @param {boolean} once  -  property use to say if the function can be called only once
     * @return {number}  -  return the number of subscription
     */
    setSubscription(eventName,callback,once){
        if(!this.events.hasOwnProperty(eventName)){
            this.events[eventName] = new SubscribedEvent();
        }
        this.events[eventName].add(new CallbackSubscribedEvent(callback,once));
        return this.events[eventName].subscription;
    }

    /**
     * function use to check the input value
     * @function inputParametersValidation
     * @param {string} eventName - A string contain the event name
     * @param {function} callback  -  Function to call when the event name is triggered
     * @throws {ValidationError} If the event name is not a string data type.
     */
    inputParametersValidation(eventName:string,callback?:any){
        try {
            this.subscriptionName(eventName);
            this.subscriptionFunction(callback);
        } catch (err) {
            if (err instanceof ValidationError) {
                alert("Invalid data: " + err.message);
            }else {
                throw err; // unknown error, rethrow it
            }
        }
    }

    /**
     * function use to check the input value
     * @function subscriptionName
     * @param {string} eventName - A string contain the event name
     * @return {boolean}  -  return true if everything is ok
     * @throws {ValidationError} If the event name is not a string data type.
     */
    subscriptionName(eventName:string) {
        if (typeof eventName !== 'string'){
            throw new ValidationError("event name is not a string");
        }
        return true;
    }
    /**
     * function use to check if the callback function is a function
     * @function subscriptionFunction
     * @param {function} callback  -  Function to call when the event name is triggered
     * @return {boolean}  -  return true if everything is ok
     * @throws {ValidationError}  If the function is not a function data type.
     */
    subscriptionFunction(callback?:any) {
        if (callback && typeof callback !== 'function'){
            throw new ValidationError("subscription arguments is not a function");
        }
        return true;
    }
}

