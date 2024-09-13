describe('test API routes', () => {
  context('GET /api/search/pyramid', () => {
    it('searches for keywords: pyramid', () => {
      cy.request('GET', '/api/search/pyramid?limit=4').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.length).to.be.eq(4)
        cy.log(response.body)
      })
    })
  })
})
