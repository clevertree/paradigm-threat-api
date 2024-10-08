/// <reference types="cypress" />

describe('test API routes', () => {
  context('POST /api/chat/channel/development/createGuestPost', () => {
    it('create a posts in development chat', () => {
      cy.request('POST', '/api/chat/channel/development/createGuestPost', {
        content: 'This is a test message from a cypress e2e test',
        username: 'cypress',
        mode: 'test'
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.channel).to.eq('development')
        expect(response.body.username).to.eq('cypress')
        expect(response.body.content).to.eq('This is a test message from a cypress e2e test')
        // expect(response.body.post).to.be.eq(15)
      })
    })

    it('fails to create a posts in development chat', () => {
      cy.request({
        method: 'POST',
        url: '/api/chat/channel/development/createGuestPost',
        failOnStatusCode: false,
        body: {
          content: '',
          username: 'cypress',
          mode: 'test'
        }
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.channel).to.eq('development')
        expect(response.body.postInfo).to.eq(null)
        expect(response.body.error.issues.length).to.be.greaterThan(0)
        // expect(response.body.post).to.be.eq(15)
      })
    })

    it('send preflight OPTIONS for createGuestPost', () => {
      cy.request('OPTIONS', '/api/chat/channel/development/createGuestPost', {}).then((response) => {
        expect(response.status).to.eq(200)
        // expect(response.body.post).to.be.eq(15)
      })
    })
  })
})
