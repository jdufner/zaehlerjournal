'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  
  describe('Zaehlerjournal', function() {
    var httpBackend, Zaehlerjournal;
    beforeEach(function() {
      module('zaehlerjournal.services');
      inject(function($httpBackend, _Zaehlerjournal_){
        httpBackend = $httpBackend;
        Zaehlerjournal = _Zaehlerjournal_;
      });
    });
    it('should have a addImmobilie function', function() {
      expect(angular.isFunction(Zaehlerjournal.addImmobilie)).toBe(true);
    });
    it('should have a addZaehlerstand function', function() {
      expect(angular.isFunction(Zaehlerjournal.addZaehlerstand)).toBe(true);
    });
    it('should have a findImmobilieByAdresse function', function() {
      expect(angular.isFunction(Zaehlerjournal.findImmobilieByAdresse)).toBe(true);
    });
    it('should have a getImmobilien function', function() {
      expect(angular.isFunction(Zaehlerjournal.getImmobilien)).toBe(true);
    });
    it('should have a getMetadaten function', function() {
      expect(angular.isFunction(Zaehlerjournal.getMetadaten)).toBe(true);
    });
    it('should have a loadMetadaten function', function() {
      expect(angular.isFunction(Zaehlerjournal.loadMetadaten)).toBe(true);
    });
    it('should have a setMetadaten function', function() {
      expect(angular.isFunction(Zaehlerjournal.setMetadaten)).toBe(true);
    });
    it('should set- und getMetadaten without any change', function() {
      Zaehlerjournal.setMetadaten({id: 1});
      var metadaten = Zaehlerjournal.getMetadaten();
      expect(metadaten.id).toBe(1);
    });
    it('should add- und getImmobilien und findImmobilieByAdrese without any change', function() {
      var adresse = 'Strasse Hausnr Ort';
      Zaehlerjournal.addImmobilie(adresse);
      var immobilien = Zaehlerjournal.getImmobilien();
      expect(immobilien[0].id).toBe(1);
      expect(immobilien[0].adresse).toBe(adresse);
      var immobilie = Zaehlerjournal.findImmobilieByAdresse(adresse);
      expect(immobilie.id).toBe(1);
      expect(immobilie.adresse).toBe(adresse);
    });
    it('should add a zaehlerstand', function() {
      var zaehlers = [{zaehlerstand: 1, zaehlerstaende: []}];
      Zaehlerjournal.addZaehlerstand(zaehlers);
      expect(zaehlers[0].zaehlerstaende[0].id).toBe(0);
      expect(zaehlers[0].zaehlerstaende[0].datum).toMatch(/\d+/);
      expect(zaehlers[0].zaehlerstaende[0].stand).toBe(1);
    });
    it('should load the metadata from file', function() {
      httpBackend.expectGET('zaehler/konstanten.json').respond({art: {name: "Art", "werte": [{"id": 0, "art": "Gas", "einheit": "kWh"}]}});
      var metadaten = null;
      var promise = Zaehlerjournal.loadMetadaten();
      promise.then(function(response) {
        //console.log(response.data);
        metadaten = response.data;
        expect(metadaten.art.name).toBe("Art");
      });
      expect(metadaten).toBe(null);
      httpBackend.flush();
      expect(metadaten.art.name).toBe("Art");
    });
  });
 
});
