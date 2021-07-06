import { ObjectId } from 'mongodb';
import { Event } from '../../models/Event';
import { IDboMapper } from '../../domain/common/IDboMapper';
import { Dbo } from '../../domain/common/Dbo';

interface EventDbo extends Dbo {
  _id: ObjectId;
  title: string;
  type: string;
  date: Date;
  hasAttendanceRecords: boolean;
}

class EventDboMapper implements IDboMapper<Event> {

  toDbo(event: Event): EventDbo {
    return {
      _id: event.id ? new ObjectId(event.id) : new ObjectId(),
      title: event.title,
      type: event.type,
      date: event.date,
      hasAttendanceRecords: event.hasAttendanceRecords,
    };
  }

  fromDbo(dbo: EventDbo): Event {
    return new Event(String(dbo._id),
                     dbo.title,
                     dbo.type,
                     dbo.date,
                     dbo.hasAttendanceRecords);
  }

}


export {
  EventDbo,
  EventDboMapper,
};
