import {TestFixture, generateComponentHTML} from '../fixtures/test-fixture';
import {getAnalyticsAt} from '../utils/network';
import {SearchBoxSelectors} from './search-box/search-box-selectors';
import * as CommonAssertions from './common-assertions';
import {addSearchBox} from './search-box/search-box-actions';

describe('No Results Test Suites', () => {
  const tag = 'atomic-no-results';
  const wait = 1000;
  let env: TestFixture;

  beforeEach(() => {
    env = new TestFixture()
      .with(addSearchBox())
      .withElement(generateComponentHTML(tag));
  });

  describe('when there are results', () => {
    beforeEach(() => {
      env.init();
    });

    it('should not be visible', () => {
      cy.get(tag).should('not.be.visible');
    });
  });

  describe('when there are no results', () => {
    beforeEach(() => {
      env.withHash('q=gahaiusdhgaiuewjfsf').init();
    });

    CommonAssertions.assertAriaLiveMessage("couldn't find anything");

    it('should be visible', () => {
      cy.get(tag).should('be.visible');
    });

    it('text content should match', () => {
      cy.get(tag)
        .shadow()
        .find('[part="no-results"] [part="highlight"]')
        .should('contain.text', 'gahaiusdhgaiuewjfsf');
    });
  });

  it('cancel button should not be visible when there is no history', () => {
    env.withHash('q=gahaiusdhgaiuewjfsf').init();
    cy.get(tag).shadow().get('button').should('not.exist');
  });

  function submitNoResultsSearch() {
    SearchBoxSelectors.inputBox().type('asiufasfgasiufhsaiufgsa');
    SearchBoxSelectors.submitButton().click();
    cy.wait(wait);
  }

  it('cancel button should be visible when there is history', () => {
    env.init();
    submitNoResultsSearch();
    cy.get(tag).shadow().find('button').should('be.visible');
  });

  it('clicking on cancel should go back in history and hide the atomic-no-results component', () => {
    env.init();
    submitNoResultsSearch();
    cy.get(tag).shadow().find('button').click();
    cy.wait(wait);
    cy.get(tag).should('not.be.visible');
  });

  it('clicking on cancel should log proper analytics', async () => {
    env.init();
    submitNoResultsSearch();
    cy.get(tag).shadow().find('button').click();
    const analyticsBody = (await getAnalyticsAt('@coveoAnalytics', 1)).request
      .body;
    expect(analyticsBody).to.have.property('actionCause', 'noResultsBack');
  });
});
