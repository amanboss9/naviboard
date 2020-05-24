let dom =  require('./browser').dom
const expect = require('chai').expect;
const assert = require('chai').assert;
let naviBoard = require('../src/index');

naviBoard.setNavigation('container');

describe('Layout setup in naviboard JS', function() {

    it('Should create the navigation matrix of expected length and width', function() {
        expect(naviBoard.matrixForNavigation.length).to.be.equal(5);
        expect(naviBoard.matrixForNavigation[0].length).to.be.equal(4);
    })

    it('Should have first element as active element', function() {
        expect(naviBoard.activeElement).to.be.equal(naviBoard.matrixForNavigation[0][0]);
    })

});
