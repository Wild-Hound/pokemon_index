// const { expect } = require("chai");

describe("First Test", function () {
  it("Opens Url", function () {
    cy.visit("https://pokemon-index.vercel.app/");
  });
  it("Tests Search", function () {
    cy.get("#searchBar").click().type("pikachu");
    cy.get("ul")
      .get("li:nth-child(3)")
      .then((e) => {
        const optionText = e.text();
        cy.get("ul").get("li:nth-child(3)").click();
        cy.get("#searchBar")
          .invoke("val")
          .then((e) => {
            expect(e).to.equal(optionText);
          });
      });
    cy.reload();
  });
  it("Tests Last Searched", function () {
    cy.get("#searchBar").click();
    cy.get("ul").get("li:nth-child(1)").should("be.visible").click();
  });
});
