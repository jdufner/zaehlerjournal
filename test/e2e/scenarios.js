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
      button.click().then(function() {
        //console.log(result);
      });
      expect(element.all(by.css('[ng-view] h1')).first().getText()).toMatch(/Strasse Hausnr Ort/);
    });
    it('should provoke a validation error', function() {
      element(by.id('adresse')).sendKeys('a');
      element(by.id('adresse')).sendKeys('\u0008');
      var validationMessage = element(by.css('span'));
      var validationMessageText = validationMessage.getText();
      expect(validationMessageText).toMatch(/Geben Sie bitte die Adresse/);
    });
  });

  describe('Immobilie aufrufen und einen Zaehler anlegen', function() {
    beforeEach(function() {
      browser.get('index.html#/einstellungen');
      element(by.id('adresse')).sendKeys('Strasse Hausnr Ort');
      element(by.buttonText('Speichern')).click();
      element(by.css('[ng-view] a.btn')).click().then(function() {
        //console.log(result);
      });
    });
    it('should create zaehler', function() {
      expect(element.all(by.css('[ng-view] h1')).first().getText()).toMatch(/Strasse Hausnr Ort/);
      element(by.id('nr')).sendKeys('123');
      //element(by.css('select#art option:contains("Gas")')).click();
      element.all(by.css('select#art option')).then(function(options){
        options[2].click();
      });
      element.all(by.css('select#typ option')).then(function(options){
        options[1].click();
      });
      element(by.buttonText('Speichern')).click().then(function(){
        //expect(by.css('input[value~="Strasse Hausnr Ort"]')).toBeDefined();
      });
      expect(by.css('input[value*="Strasse Hausnr Ort"]')).toBeDefined();
      expect(element.all(by.css('ul.dropdown-menu>li')).count()).toBe(4);
      //protractor.getInstance().sleep(5000);
    });
    it('should provoke a validation error', function() {
      expect(element.all(by.css('[ng-view] h1')).first().getText()).toMatch(/Strasse Hausnr Ort/);
      element(by.id('nr')).sendKeys('1');
      element(by.id('nr')).sendKeys('\u0008');
      expect(element(by.css('span')).getText()).toMatch(/Validierung fehlgeschlagen/);
    });
  });

  describe('Zaehlerstand erfassen', function() {
    beforeEach(function() {
      browser.get('index.html#/einstellungen');
      element(by.id('adresse')).sendKeys('Strasse Hausnr Ort');
      element(by.buttonText('Speichern')).click();
      element(by.css('[ng-view] a.btn')).click().then(function() {
        //console.log(result);
      });
      element(by.id('nr')).sendKeys('123');
      element.all(by.css('select#art option')).then(function(options){
        options[2].click();
      });
      element.all(by.css('select#typ option')).then(function(options){
        options[1].click();
      });
      element(by.buttonText('Speichern')).click().then(function(){ });
      var menuLinks = element.all(by.css('ul[class="menu"] a'));
      expect(menuLinks.count()).toBe(2);
      element(by.css('ul[class="menu"] a[href="#/uebersicht"]')).click().then(function(){ });
      element(by.css('[ng-view] strong a[href*="erfassung"]')).click().then(function(){ });
      expect(element.all(by.css('[ng-view] table tr')).count()).toBe(1);
    });
    it('should create zaehler', function() {
      element(by.css('[ng-view] input[name="zaehlerstand"]')).sendKeys('111');
      element(by.css('[ng-view] button[type="submit"]')).click().then(function(){ });
      expect(element.all(by.css('[ng-view] table tr')).count()).toBe(2);
      //protractor.getInstance().sleep(5000);
    });
    it('should provoke a validation error to input a decimal number', function() {
      element(by.css('[ng-view] input[name="zaehlerstand"]')).sendKeys('1');
      element(by.css('[ng-view] input[name="zaehlerstand"]')).sendKeys('\u0008');
      expect(element(by.css('span')).getText()).toMatch(/Validierung fehlgeschlagen/);
      expect(element(by.css('span')).getText()).toMatch(/Bitte eine Dezimalzahl eingeben/);
      //protractor.getInstance().sleep(5000);
    });
    it('should provoke a validation error to input a decimal number larger than last number', function() {
      element(by.css('[ng-view] input[name="zaehlerstand"]')).sendKeys('111');
      element(by.css('[ng-view] button[type="submit"]')).click().then(function(){ });
      expect(element.all(by.css('[ng-view] table tr')).count()).toBe(2);
      element(by.css('[ng-view] input[name="zaehlerstand"]')).sendKeys('110');
      expect(element(by.css('span')).getText()).toMatch(/Validierung fehlgeschlagen/);
      expect(element(by.css('span')).getText()).toMatch(/Bitte geben sie mindestens 111 ein/);
      //protractor.getInstance().sleep(5000);
    });
  });

});
