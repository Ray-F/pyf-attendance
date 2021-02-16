const ObjectId = require('mongodb').ObjectId


class Event {

  /**
   * @type {string|null}
   */
  id;

  /**
   * @type {string}
   */
  title;

  /**
   * @type {string}
   */
  type;

  /**
   * @type {Date}
   */
  date;

  /**
   * @type {boolean}
   */
  hasAttendanceRecords;

  /**
   *
   * @param {Object} obj - An event object.
   * @param {string} [obj.id] - The ID of the event.
   * @param {string} [obj._id] – The ID of the event.
   * @param {string} obj.title - The title of the event.
   * @param {string} obj.type - The type of event (Project, Training, Meeting).
   * @param {Date|string} obj.date - The date of the event.
   * @param {boolean} obj.hasAttendanceRecords - If the event has attendance records.
   */
  constructor({id, _id, title, type, date, hasAttendanceRecords}) {
    this.id = id || _id || null;
    if (this.id) {
      this.id = this.id.toString();
    }
    this.title = title;
    this.type = type;
    this.date = new Date(date);
    this.hasAttendanceRecords = hasAttendanceRecords;
  }

  /**
   * Returns the object in DTO format to be sent for client-side rendering.
   *
   * @returns {Object}
   */
  toDto() {
    return {
      _id: this.id,
      title: this.title,
      type: this.type,
      date: this.date,
      hasAttendanceRecords: this.hasAttendanceRecords
    }
  }

  /**
   * Returns the object in DBO format to be sent for database storing.
   *
   * @returns {Object}
   */
  toDbo() {
    return {
      _id: this.id ? ObjectId(this.id) : undefined,
      title: this.title,
      type: this.type,
      date: this.date,
      hasAttendanceRecords: this.hasAttendanceRecords
    }
  }
}


module.exports = {
  Event
}