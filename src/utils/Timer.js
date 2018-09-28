export default class Timer {
  /**
   * @constructor
   * @param {Function} callback
   * @param {Number} timerInterval = 1000
   */
  constructor(callback, timerInterval = 1000) {
    this.timer = null;
    this.callback = callback;
    this.timerInterval = timerInterval;
  }
  start() {
    if (!this.timer) {
      this.timer = setInterval(() => {
        if (this.timer) {
          this.callback();
        }
      }, this.timerInterval);
    }
    return this;
  }
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
