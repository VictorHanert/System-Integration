console.log(new Date()); // UTC Current date and time
console.log(Date()); // Local date
console.log(Date.now()); // Unix epoch time

const date = new Date();
const danishDate = new Intl.DateTimeFormat('da-DK').format(date);
console.log(danishDate);

const americanDate = new Intl.DateTimeFormat('en-US').format(date);
console.log(americanDate);