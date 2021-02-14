const ObjectId = require('mongodb').ObjectId


class Attendance {
  /**
   * @type {string}
   */
  id;

  /**
   * @type {string}
   */
  memberId;

  /**
   * @type {string}
   */
  fullName;

  /**
   * @type {boolean}
   */
  isLate;

  /**
   * @type {boolean}
   */
  isAbsent;

  /**
   * @type {boolean}
   */
  isExcused;

  /**
   * @type {string}
   */
  excuseReason;

  /**
   * @type {Integer|null}
   */
  capacity;

  /**
   * @type {string}
   */
  eventId;

  /**
   * @type {string}
   */
  eventType;

  /**
   * @param {Object} obj - An attendance object.
   * @param {string} [obj.id] - The ID of the attendance object.
   * @param {string} obj.memberId - The ID of the member who this attendance belongs to.
   * @param {string} obj.fullName - The full name of the member who this attendance belongs to.
   * @param {string} obj.eventId - The ID of the event who this attendance is for.
   * @param {string} obj.eventType - The type of event this attendance is for.
   * @param {boolean} obj.isLate - If member was late to arrive or early to leave.
   * @param {boolean} obj.isAbsent - If member was absent.
   * @param {boolean} obj.isExcused - If member was excused.
   * @param {string} obj.excuseReason - The excuse reason if they were excused.
   * @param {Integer} obj.capacity - The capacity of the member if applicable.
   */
  constructor({id, memberId, fullName, eventId, eventType, isLate, isAbsent, isExcused, excuseReason, capacity}) {
    this.id = id || new ObjectId().toString()
    this.isLate = isLate;
    this.isAbsent = isAbsent;
    this.isExcused = isExcused;
    this.excuseReason = excuseReason;
    this.capacity = capacity;
    this.memberId = memberId;
    this.fullName = fullName;
    this.eventId = eventId;
    this.eventType = eventType;

    if ([
      this.memberId, this.fullName, this.eventId,
      this.eventType, this.isAbsent, this.isLate, this.isExcused,
      this.excuseReason, this.capacity].includes(undefined)) {
      console.log(this)
      throw new Error("IllegalArgumentException: Missing parameter for attendance object!")
    }
  }

  /**
   * Returns the object in DTO format to be sent for client side rendering.
   *
   * @returns {Object}
   */
  toDto() {
    return {
      id: this.id,
      memberId: this.memberId,
      fullName: this.fullName,
      eventId: this.eventId,
      eventType: this.eventType,
      isShort: this.isLate,
      isAbsent: this.isAbsent,
      isExcused: this.isExcused,
      excuseReason: this.excuseReason,
      capacity: this.capacity
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

      event: {
        eventId: ObjectId(this.eventId),
        type: this.eventType
      },
      member: {
        memberId: ObjectId(this.memberId),
        fullName: this.fullName
      },

      isLate: this.isLate,
      isAbsent: this.isAbsent,
      isExcused: this.isExcused,
      excuseReason: this.excuseReason,
      capacity: this.capacity
    }
  }
}


module.exports = {
  Attendance
}