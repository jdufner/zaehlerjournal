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


  describe('details', function() {

    beforeEach(function() {
      browser.get('index.html#/zaehler/04AB019104');
    });

    it('should render details when user navigates to /zaehler/04AB019104', function() {
      expect(element.all(by.css('[ng-view] h1')).first().getText()).
        toMatch(/04AB019104/);
    });

  });

  describe('einstellungen', function() {

    beforeEach(function() {
      browser.get('index.html#/einstellungen');
    });

    it('should render einstellungen when user navigates to /einstellungen', function() {
      expect(element.all(by.css('[ng-view] h1')).first().getText()).
        toMatch(/Einstellungen/);
    });

  });

});
