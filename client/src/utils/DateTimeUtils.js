export const getDisplayDate = (date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear().toString().padStart(4, '0');

  return `${year}-${month}-${day}`;
};

export const getDateFromDisplay = (date) => new Date(date);

export const getNiceDate = (date) => {
  const dateObj = new Date(date);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
};
