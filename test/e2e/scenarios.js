'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('Zählerjournal', function() {

  browser.get('index.html');
  it('should automatically redirect to /uebersicht when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/uebersicht");
  });

  describe('uebersicht', function() {
    beforeEach(function() {
      browser.get('index.html#/uebersicht');
    });
    it('should render uebersicht when user navigates to /uebersicht', function() {
      expect(element.all(by.css('[ng-view] h1')).first().getText()).toMatch(/bersicht/);
    });
  });

  describe('Einstellungen aufrufen und eine Immobilie anlegen', function() {
    beforeEach(function() {
      browser.get('index.html#/einstellungen');
    });
    it('should render einstellungen when user navigates to /einstellungen', function() {
      expect(element.all(by.css('[ng-view] h1')).first().getText()).toMatch(/Einstellungen/);
    });
    it('should create Immobilie', function() {
      element(by.id('adresse')).sendKeys('Strasse Hausnr Ort');
      element(by.buttonText('Speichern')).click();
      var buttons = element.all(by.css('[ng-view] a.btn'));
      expect(buttons.count()).toBe(1);
      var button = buttons.first();
      expect(button.getText()).toMatch(/Strasse Hausnr Ort/);
      button.click().then(function(result) {
        //console.log(result);
      });
      expect(element.all(by.css('[ng-view] h1')).first().getText()).toMatch(/Strasse Hausnr Ort/);
    });
  });

  describe('Immobilie aufrufen und einen Zaehler anlegen', function() {
    beforeEach(function() {
      browser.get('index.html#/einstellungen');
      element(by.id('adresse')).sendKeys('Strasse Hausnr Ort');
      element(by.buttonText('Speichern')).click();
      element(by.css('[ng-view] a.btn')).click().then(function(result) {
        //console.log(result);
      });
    });
    it('should create zaehler', function() {
      expect(element.all(by.css('[ng-view] h1')).first().getText()).toMatch(/Strasse Hausnr Ort/);
      element(by.id('nr')).sendKeys('123');
//      element(by.css('select#art option:contains("Gas")')).click();
      element.all(by.css('select#art option')).then(function(options){
        options[2].click();
      });
      element.all(by.css('select#typ option')).then(function(options){
        options[1].click();
      });
      element(by.buttonText('Speichern')).click();
      protractor.getInstance().sleep(5000);
    });
  });
  
});
