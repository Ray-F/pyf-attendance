import { ObjectId } from 'mongodb';

class Member {

  /**
   * @type {string|null}
   */
  id;

  /**
   * @type {string}
   */
  fullName;

  /**
   * @type {Date}
   */
  startDate;

  /**
   * @type {Date|null}
   */
  endDate;

  /**
   * @param {Object} obj - A member object.
   * @param {string} [obj.id] - The ID of the member.
   * @param {string} obj.fullName - The full name of the member.
   * @param {Date|string} obj.startDate - The starting date of the member.
   * @param {Date|string} [obj.endDate] - the leaving date of the member.
   */
  constructor({ id, _id, fullName, startDate, endDate }) {
    this.id = id || _id || null;
    if (this.id) {
      this.id = this.id.toString();
    }

    this.fullName = fullName;
    this.startDate = new Date(startDate);
    this.endDate = endDate ? new Date(endDate) : null;
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
   * @returns {Object}
   */
  toDbo() {
    return {
      _id: this.id ? ObjectId(this.id) : undefined,
      fullName: this.fullName,
      startDate: this.startDate,
      endDate: this.endDate || undefined,
    };
  }
}


export default Member;
