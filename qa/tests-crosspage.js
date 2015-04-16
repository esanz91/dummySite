var Browser = require('zombie');
var assert = require('chai').assert;
var browser;

suite('Cross-Page Tests', function(){

    setup(function(){
        browser = new Browser()
    });

    test('requesting a rate from the webdev page should populate the referrer field', function(done){
        var referrer = 'http://localhost:3000/contracting/webdev';
        browser.visit(referrer, function(){
            browser.clickLink('.requestRate', function(){
                assert(browser.field('referrer').value === referrer);
                done();
            });
        });
    });

    test('requesting a rate from the android page should populate the referrer field', function(done){
        var referrer = 'http://localhost:3000/contracting/android';
        browser.visit(referrer, function(){
            browser.clickLink('.requestRate', function(){
                assert(browser.field('referrer').value === referrer);
                done();
            });
        });
    });

    test('visiting the "request rate" page directly should result in an empty referrer field', function(done){
        browser.visit('http://localhost:3000/contracting/request-rate', function(){
            assert(browser.field('referrer').value === '');
            done();
        });
    });

});