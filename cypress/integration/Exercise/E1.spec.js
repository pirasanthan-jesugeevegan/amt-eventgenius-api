/// <reference types="cypress" />

context('Get Random generated music genre', () => {
  let randomName;

  it('Get random genre - 200', () => {
    cy.getRandomGenre().then((response) => {
      randomName = response.body;
      assert.isString(response.body, 'val is string');
      cy.log(`The hottest new trend is ${randomName}`);
    });
  });

  it('New genre is polled every time', () => {
    cy.getRandomGenre().then((response) => {
      assert.notEqual(randomName, response.body, 'vals not equal');
    });
  });
});
