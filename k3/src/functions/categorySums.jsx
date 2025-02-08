const calculateCategorySums = (array) => {
  const categorySums = array.reduce((accumulator, item) => {
    const category = item.maksuluokka;
    const sum = parseFloat(item.summa); // Convert sum to a number

    if (!accumulator[category]) {
      accumulator[category] = 0; // Initialize category sum if it doesn't exist
    }

    accumulator[category] += sum; // Add the sum to the category
    return accumulator;
  }, {});

  // Convert the object into an array of objects
  return Object.entries(categorySums).map(([luokka, summa]) => ({
    luokka,
    summa,
  }));
};

export default calculateCategorySums;
