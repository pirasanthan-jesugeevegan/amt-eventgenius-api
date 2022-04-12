Cypress.Commands.add('getRandomGenre', () => {
  // Get random genre
  cy.request({
    method: 'GET',
    url: 'https://binaryjazz.us/wp-json/genrenator/v1/genre/1',
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.statusText).to.eq('OK');
  });
});
