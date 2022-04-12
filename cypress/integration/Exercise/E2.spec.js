/// <reference types="cypress" />

context('Get details of a touring artist', () => {
  let randomArtist;

  it('Get details of a touring artist - 200', () => {
    cy.getTouringArtist({ page: '?page=1' }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.statusText).to.eq('OK');
      expect(response.body.next).to.eq(
        'https://www.festicket.com/api/v1/artists/?page=2'
      );
      expect(response.body).to.have.all.keys(
        'count',
        'next',
        'previous',
        'results'
      );
      assert.isNumber(response.body.count, 'val is number');
      assert.isString(response.body.next, 'val is string');
      assert.notExists(response.body.previous, 'val is null or undefined');
      assert.isArray(response.body.results, 'val is array');
    });
  });

  it('Get details of a touring artist - 404 - Invalid Page number', () => {
    cy.getTouringArtist({ page: '?page=Invalid' }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.statusText).to.eq('Not Found');
    });
  });

  it('Get details of a touring artist - 404 - Invalid artist pk number', () => {
    cy.getTouringArtist({ artist: 'Invalid' }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.statusText).to.eq('Not Found');
    });
  });

  it('Get details of a touring artist - 403 - Invalid Authorization ID', () => {
    cy.request({
      method: 'GET',
      url: 'https://www.festicket.com/api/v1/artists/',
      headers: {
        Authorization: Cypress.env('Invalid'),
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(403);
      expect(response.statusText).to.eq('Forbidden');
    });
  });

  it('Get details of a touring artist - 403 - Empty Authorization ID', () => {
    cy.request({
      method: 'GET',
      url: 'https://www.festicket.com/api/v1/artists/',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(403);
      expect(response.statusText).to.eq('Forbidden');
    });
  });

  it('Get details of a touring artist - 404 - Invalid Page number & Artist pk number', () => {
    cy.getTouringArtist({ artist: 'Invalid', page: '?page=Invalid' }).then(
      (response) => {
        expect(response.status).to.eq(404);
        expect(response.statusText).to.eq('Not Found');
      }
    );
  });

  it('Get an Artist details from the list of touring Artist', () => {
    cy.getTouringArtist({ page: '?page=1' }).then((response) => {
      randomArtist =
        response.body.results[
          Math.floor(Math.random() * response.body.results.length)
        ];
      console.log(randomArtist);
      cy.getTouringArtist({ artist: randomArtist.pk }).then((response) => {
        console.log(response.body);
        expect(response.status).to.eq(200);
        expect(response.statusText).to.eq('OK');
        expect(response.body).to.deep.equal(randomArtist);
        expect(response.body).to.have.all.keys(
          'festivals',
          'image',
          'name',
          'pk'
        );
      });
    });
  });

  it('Get an Artist details that has a festival from the list of touring Artist', () => {
    function getAllTouringArtist(onResponse, page = 1) {
      if (page === 10) throw 'User not found';

      cy.getTouringArtist({ page: `?page=${page}` }).then((response) => {
        const found = onResponse(response);
        if (found) return;
        getAllTouringArtist(onResponse, ++page);
      });
    }

    getAllTouringArtist((response) => {
      console.log(response.body.results);
      const artists = response.body.results;
      return artists.some((artist) => {
        if (artist.festivals > 0) {
          cy.log(
            `Festival Number Linked to ${artist.name} is ${artist.festivals}`
          );
          expect(response.status).to.eq(200);
          expect(response.statusText).to.eq('OK');
          expect(artist).to.have.all.keys('festivals', 'image', 'name', 'pk');
          expect(artist.festivals).not.to.be.empty;
          expect(artist.image).to.be.a('string');
          expect(artist.name).to.be.a('string');
          expect(artist.pk).to.be.a('number');
        }
        return artist.festivals > 0;
      });
    });
  });
});
