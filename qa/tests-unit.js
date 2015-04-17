var fact = require('../lib/randomFact.js');
var expect = require('chai').expect;

suite('Random Fact tests', function(){
    test('getFact() should return a fact', function(){
        expect(typeof fact.getFact() === 'string');
    });
});