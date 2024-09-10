describe('test API routes', () => {
  context('GET /api/chat/getChannels', () => {
    it('gets a list of channels', () => {
      cy.request('GET', '/api/chat/getChannels').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.length).to.be.greaterThan(41)
      })
    })
  })
})
