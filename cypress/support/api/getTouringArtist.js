Cypress.Commands.add('getTouringArtist', ({ page, artist }) => {
  // Get random genre
  cy.request({
    method: 'GET',
    url: `https://www.festicket.com/api/v1/artists/${
      page !== undefined ? page : artist
    }`,
    headers: {
      Authorization: Cypress.env('EXTERNAL_API'),
    },
    failOnStatusCode: false,
  });
});
