import { EventDboMapper } from '../infrastructure/mapper/EventMapper';

class Event {

  id: string;
  title: string;
  type: string;
  date: Date;

  hasAttendanceRecords: boolean;

  constructor(id: string, title: string, type: string, date: Date, hasAttendanceRecords: boolean) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.date = date;
    this.hasAttendanceRecords = hasAttendanceRecords;
  }

  /**
   * Returns the object in DTO format to be sent for client-side rendering.
   *
   * @returns {Object}
   * @deprecated
   */
  toDto(): any {
    return {
      _id: this.id,
      title: this.title,
      type: this.type,
      date: this.date,
      hasAttendanceRecords: this.hasAttendanceRecords,
    };
  }

  /**
   * @deprecated
   */
  toDbo() {
    return new EventDboMapper().toDbo(this);
  }

}


export {
  Event
}
