const createNanoEvents = () => ({
  events: {},
  on(event, cb) {
    (this.events[event] ||= []).push(cb);
    return () => this.off(event, cb);
  },
  emit(event, ...args) {
    const callbacks = this.events[event] || [],
      length = callbacks.length;
    for (let i = 0; i < length; i++) {
      callbacks[i](...args);
    }
  },
  once(event, cb) {
    const fn = (...args) => {
      cb(...args);
      this.off(event, fn);
    };
    this.on(event, fn);
  },
  off(event, cb) {
    let events = this.events[event];
    if (!Array.isArray(events) || !events.length) {
      return;
    }
    this.events[event] = events.filter(i => cb !== i);
  }
});

const events = createNanoEvents();
function fn(a) {
  console.log(a);
}
events.events.add = [value => console.log(++value)];
const offLog = events.on('log', () => console.log('log...'));

events.on('log', fn);
events.emit('log', 1, 2); // log... 1
events.emit('add', 2, 3); // 3
events.off('log', fn);
events.emit('log', 3); // log...

events.once('log', fn);
events.emit('log', 4); // log...  4
events.emit('log', 5); // log...

offLog();
events.emit('log', 6);
