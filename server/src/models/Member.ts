import { MemberDboMapper } from '../infrastructure/mapper/MemberMapper';

class Member {

  id: string;
  fullName: string;
  startDate: Date;
  endDate: Date;

  /**
   * @param id The ID of the member.
   * @param fullName The full name of the member.
   * @param startDate The starting date of the member.
   * @param endDate The leaving date of the member.
   */
  constructor(id: string, fullName: string, startDate: Date, endDate: Date) {
    this.id = id;
    this.fullName = fullName;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  /**
   * Returns the object in DTO format to be sent for client-side rendering.
   *
   * @returns {Object}
   */
  toDto() {
    return {
      _id: this.id,
      fullName: this.fullName,
      startDate: this.startDate,
      endDate: this.endDate || undefined,
    };
  }

  /**
   * Returns the object in DBO format to be sent for database storing.
   *
   * @deprecated Use MemberDboMapper
   */
  toDbo() {
    return new MemberDboMapper().toDbo(this);
  }
}


export default Member;
