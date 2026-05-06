const calculateStartDate = (dateRange) => {
  const currentDate = new Date();
  switch (dateRange) {
    case "day":
      return setToStartOfDay(
        new Date(currentDate.setDate(currentDate.getDate() - 1))
      );
    case "week":
      return setToStartOfDay(
        new Date(currentDate.setDate(currentDate.getDate() - 7))
      );
    case "two-weeks":
      return setToStartOfDay(
        new Date(currentDate.setDate(currentDate.getDate() - 14))
      );
    case "month":
      return setToStartOfDay(
        new Date(currentDate.setDate(currentDate.getDate() - 30))
      );
    default:
      throw new Error("Invalid dateRange");
  }
};

const setToStartOfDay = (date) => {
  return new Date(date.setHours(0, 0, 0, 0));
};

const getRandomDateWithinLastMonth = () => {
  const currentDate = new Date();
  const randomDaysAgo = Math.floor(Math.random() * 30);
  return setToStartOfDay(
    new Date(currentDate.setDate(currentDate.getDate() - randomDaysAgo))
  );
};

module.exports = {
  calculateStartDate,
  setToStartOfDay,
  getRandomDateWithinLastMonth,
};
