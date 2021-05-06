/**
 * This polyfill file is support matrix-js-sdk
 * Source: https://gist.github.com/moeinrahimi/c1f30a94be6cbc7a0fd5a3eb14b7cb4c#file-poly-js
 */
import { EventEmitter } from "fbemitter";

const existsConsoleError = console.error;
console.error = (...params) => {
  // Disable WebRTC is available
  if (
    typeof params[0] === "string" &&
    params[0].includes("WebRTC is not supported in this browser / environment")
  ) {
    return;
  }

  existsConsoleError(...params);
};

String.prototype.normalize = function normalize(form) {
  return require("unorm")[String(form).toLowerCase()](this);
};

class Document {
  constructor() {
    this.emitter = new EventEmitter();
    this.addEventListener = this.addEventListener.bind(this);
    this.removeEventListener = this.removeEventListener.bind(this);
    this._checkEmitter = this._checkEmitter.bind(this);
  }

  createElement(tagName) {
    return {};
  }

  _checkEmitter() {
    if (
      !this.emitter ||
      !(
        this.emitter.on ||
        this.emitter.addEventListener ||
        this.emitter.addListener
      )
    )
      this.emitter = new EventEmitter();
  }

  addEventListener(eventName, listener) {
    this._checkEmitter();
    if (this.emitter.on) {
      this.emitter.on(eventName, listener);
    } else if (this.emitter.addEventListener) {
      this.emitter.addEventListener(eventName, listener);
    } else if (this.emitter.addListener) {
      this.emitter.addListener(eventName, listener);
    }
  }

  removeEventListener(eventName, listener) {
    this._checkEmitter();
    if (this.emitter.off) {
      this.emitter.off(eventName, listener);
    } else if (this.emitter.removeEventListener) {
      this.emitter.removeEventListener(eventName, listener);
    } else if (this.emitter.removeListener) {
      this.emitter.removeListener(eventName, listener);
    }
  }
}

window.document = window.document ?? new Document();
window.addEventListener = window.document.addEventListener;
window.removeEventListener = window.document.removeEventListener;
