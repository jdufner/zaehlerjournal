'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('Zählerjournal', function() {

  browser.get('index.html');

  it('should automatically redirect to /uebersichtt when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/uebersicht");
  });


  describe('uebersicht', function() {

    beforeEach(function() {
      browser.get('index.html#/uebersicht');
    });


    it('should render uebersicht when user navigates to /uebersicht', function() {
      expect(element.all(by.css('[ng-view] h1')).first().getText()).
        toMatch(/bersicht/);
    });

  });


  describe('view2', function() {

    beforeEach(function() {
      browser.get('index.html#/view2');
    });


    it('should render view2 when user navigates to /view2', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
