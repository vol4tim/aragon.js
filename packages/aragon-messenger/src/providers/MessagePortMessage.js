import Provider from './Provider'
import { Observable } from 'rxjs/Rx'

/**
 * A provider that communicates through the [MessageChannel PostMessage API](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/postMessage).
 *
 * @param {Object} [target=self] The object (that implements the
 * [MessageChannel PostMessage API](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/postMessage)) to send messages to.
 * Example: a WebWorker instance.
 *
 * @class MessagePortMessage
 * @extends {Provider}
 */
export default class MessagePortMessage extends Provider {
  // eslint-disable-next-line no-undef
  constructor (target = self) {
    super()
    this.target = target
  }

  /**
   * An observable of messages being sent to this provider.
   *
   * @memberof MessagePortMessage
   * @instance
   * @returns {Observable} An [RxJS observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html)
   */
  messages () {
    return Observable.fromEvent(this.target, 'message', false)
      .filter((event) =>
        // We can't use event.source in WebWorker messages as it seems to be null
        // However, the fallback to check the target should always be true
        (event.source || event.target) === this.target)
      .pluck('data')
  }

  /**
   * Send a payload to the underlying target of this provider.
   *
   * @param {Object} payload
   * @memberof MessagePortMessage
   * @instance
   */
  send (payload) {
    this.target.postMessage(payload)
  }
}
