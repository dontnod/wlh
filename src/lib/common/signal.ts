/**
 * Typed signals, allowing to define strongly typed observer pattern implementations.
 */
import _ from 'lodash'

/**
 * Base class for signals, allowing to be notified of events in a strongly-typed way.
 * @param THandler Type of the handler that can be attached to this signal.
 */
export abstract class SignalBase<THandler extends (...args: any) => any> {

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
  abstract raise(...args: Parameters<THandler>) : any

  /**
   * Detach a given handler.
   * @param handler The handler to disconnect from the Signal.
   */
  detach(handler: THandler) {
    this._handlers = this._handlers.filter(it => it != handler)
  }

  protected _handlers: THandler[] = []
}

/**
 * Signal class, allowing to be notified of events in a strongly-typed way.
 * @param THandler Type of the handler that can be attached to this signal.
 */
export class Signal<THandler extends (...args: any[]) => void = () => void> extends SignalBase<THandler> {
  raise(...args: Parameters<THandler>) {
    for(const handler of this._handlers) {
      handler(...args)
    }
  }
}

/**
 * Async signal, allowing to use asynchronous handlers.
 * @param THandler Type of the handler that can be attached to this signal.
 */
export class AsyncSignal<THandler extends (...args: any[]) => Promise<void>> extends SignalBase<THandler> {
  async raise(...args: Parameters<THandler>) : Promise<void> {
    for(const handler of this._handlers) {
      await handler(...args)
    }
  }
}