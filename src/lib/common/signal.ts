/**
 * Typed signals, allowing to define strongly typed observer pattern implementations.
 */
import _ from 'lodash'

/**
 * Signal class, allowing to be notified of events in a strongly-typed way.
 * @param THandler Type of the handler that can be attached to this signal.
 */
export class Signal<THandler extends (...args: any) => void> {

  /**
   * Attach an handler to this signal, so it'll be called when the signal is raised.
   * @param handler The handler function to attach to this signal.
   */
  attach(handler: THandler) {
    this._handlers.push(handler)
  }  

  /**
   * Raise the signal, calling all attached handlers.
   * @param args The arguments to forward to all handlers.
   */
  raise(args: Parameters<THandler>) {
    for(const handler of this._handlers) {
      handler(args)
    }
  }

  /**
   * Detach a given handler.
   * @param handler The handler to disconnect from the Signal.
   */
  detach(handler: THandler) {
    _.remove(this._handlers, handler) 
  }

  private readonly _handlers: THandler[] = []
}