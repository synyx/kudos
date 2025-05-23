export function preventDefault<T extends Event, U, F extends (event: T) => any>(handler: F) {
  return function (this: U, event: T) {
    event.preventDefault();
    handler.call(this, event);
  };
}
