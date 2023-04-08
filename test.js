const { faker } = require('@faker-js/faker');

const message = `${faker.name.fullName()} from ${faker.name.jobArea()} assigned a new order:${faker.address.zipCode('####')}, Job location is ${faker.address.streetAddress()}. Please email him ${faker.internet.email()} in case of any questions. Tap on the message to get the detail on the screen`;
console.log(message);


