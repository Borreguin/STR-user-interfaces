import moment from "moment";

export const random = n => {
  return Math.ceil(Math.random() * n);
};

export const generateData = () => {
  const genData = [];
  for (let i = 1; i < 11; ++i) {
    genData.push({
      date: new Date((2000 + i).toString()),
      point1: random(100),
      point2: random(100)
    });
  }
  return genData;
};

export const simpleData = () => {
  const data = [];
  for (let i = 0; i < 11; ++i) {
    data.push({
      x: moment()
        .subtract(i, "seconds")
        .format(),
      y: random(100)
    });
  }
  return data.reverse();
};

export const addOneSec = date => {
  return moment(date)
    .add(1, "second")
    .format();
};

export const nivoData = () => {
  return [
    {
      id: "catagory-1",
      data: simpleData().map(({ x, y }) => ({ x: new Date(x), y }))
    },
    {
      id: "catagory-2",
      data: simpleData().map(({ x, y }) => ({ x: new Date(x), y }))
    }
  ];
};