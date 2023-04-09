// todo maybe vefiry cookie
// y.getCookie('your-session-cookie').should('exist')

describe('Basic tests', () => {
  it('should start new game', () => {
    cy.viewport(1200, 900)
    cy.visit('http://localhost:4200')
    
    cy.contains('Test mode').click()
    // cy.get('input[name=username]').type(username) // todo type in piece setup
    cy.get('button[id="white-pieces-button"]').click()

    clickField("e2")
    clickField("e4")

    cy.wait(500)

    clickField("e7")
    clickField("e5")

    cy.wait(500)

    cy.get("div[id=boardcontainter")
  })
})

function clickField(field: string) {
  let c =  coords(field)
  cy.get("div[id=boardcontainter").click(c.x, c.y)
}

function coords(field: string) {
  let fieldSize = 700/8
  let columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  let column = columns.indexOf(field[0]) * fieldSize + fieldSize/2

  let rows = ['8', '7', '6', '5', '4', '3', '2', '1']
  let row = rows.indexOf(field[1]) * fieldSize + fieldSize/2

  return {x: column, y: row}
}