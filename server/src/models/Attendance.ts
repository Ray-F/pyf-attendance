import { AttendanceDboMapper } from '../infrastructure/mapper/AttendanceMapper';

class Attendance {

  id: string;

  memberId: string;
  fullName: string;

  eventId: string;
  eventType: string;

  isLate: boolean;
  isAbsent: boolean;
  isExcused: boolean;
  excuseReason: string;

  capacity: number;

  /**
   * @param id The ID of the attendance object.
   * @param memberId The ID of the member who this attendance belongs to.
   * @param fullName The full name of the member who this attendance belongs to.
   * @param eventId The ID of the event who this attendance is for.
   * @param eventType The type of event this attendance is for.
   * @param isLate If member was late to arrive or early to leave.
   * @param isAbsent If member was absent.
   * @param isExcused If member was excused.
   * @param excuseReason The excuse reason if they were excused.
   * @param capacity The capacity of the member if applicable.
   */
  constructor(id: string,
              memberId: string,
              fullName: string,
              eventId: string,
              eventType: string,
              isLate: boolean,
              isAbsent: boolean,
              isExcused: boolean,
              excuseReason: string,
              capacity: number) {
    this.id = id;
    this.memberId = memberId;
    this.fullName = fullName;
    this.eventId = eventId;
    this.eventType = eventType;
    this.isLate = isLate;
    this.isAbsent = isAbsent;
    this.isExcused = isExcused;
    this.excuseReason = excuseReason;
    this.capacity = capacity;

    if ([
      this.memberId, this.fullName, this.eventId,
      this.eventType, this.isAbsent, this.isLate, this.isExcused,
      this.excuseReason, this.capacity].includes(undefined)) {
      throw new TypeError('Missing required parameter for attendance object');
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
      capacity: this.capacity,
    };
  }

  /**
   * Returns the object in DBO format to be sent for database storing.
   *
   * @returns {Object}
   * @deprecated
   */
  toDbo() {
    return new AttendanceDboMapper().toDbo(this);
  }
}


export {
  Attendance,
}
