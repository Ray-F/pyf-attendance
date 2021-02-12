const ObjectId = require('mongodb').ObjectId


class Attendance {
  /**
   * @type string
   */
  id;

  /**
   * @type string
   */
  memberId;

  /**
   * @type String
   */
  fullName;

  /**
   * @type boolean
   */
  isLate;

  /**
   * @type boolean
   */
  isAbsent;

  /**
   * @type boolean
   */
  isExcused;

  /**
   * @type string
   */
  excuseReason;

  /**
   * @type {Integer | null}
   */
  capacity;

  /**
   * @type string
   */
  eventId;

  /**
   * @type EventType
   */
  eventType;

  constructor(id, memberId, fullName, eventId, eventType, isLate, isAbsent, isExcused, excuseReason, capacity) {
    this.id = id
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

  static fromDto({ _id, memberId, fullName, eventId, eventType, isLate, isAbsent, isExcused, excuseReason, capacity }) {
    return new Attendance(
      _id ? _id.toString() : undefined,
      memberId.toString(),
      fullName,
      eventId.toString(),
      eventType,
      (isLate === "true" || isLate === true),
      (isAbsent === "true" || isAbsent === true),
      (isExcused === "true" || isExcused === true),
      excuseReason,
      parseInt(capacity)
    )
  }

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

  static fromDbo(dboObject) {
    return new Attendance(
      dboObject._id.toString(),
      dboObject.member.memberId.toString(),
      dboObject.member.fullName,
      dboObject.event.eventId.toString(),
      dboObject.event.type,
      (dboObject.isLate === "true" || dboObject.isLate === true),
      (dboObject.isAbsent === "true" || dboObject.isAbsent === true),
      (dboObject.isExcused === "true" || dboObject.isExcused === true),
      dboObject.excuseReason,
      dboObject.capacity
    )
  }

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