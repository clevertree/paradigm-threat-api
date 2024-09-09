describe('test API routes', () => {
  context('GET /api/test', () => {
    it('test route', () => {
      cy.request('GET', '/api/test').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.channel).to.eq('general')
        expect(response.body.posts.length).to.be.eq(15)
      })
    })
  })
})
