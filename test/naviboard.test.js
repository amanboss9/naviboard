let dom =  require('./browser').dom
const expect = require('chai').expect;
const assert = require('chai').assert;
let naviBoard = require('../src/index');

describe('Layout setup in naviboard JS', function() {
    naviBoard.setNavigation('simulation_1');

    it('Should create the navigation matrix of expected length and width', function() {
        expect(naviBoard.matrixForNavigation.length).to.be.equal(5);
        expect(naviBoard.matrixForNavigation[0].length).to.be.equal(4);
    })

    it('Should have first element as active element', function() {
        expect(naviBoard.activeElement).to.be.equal(naviBoard.matrixForNavigation[0][0]);
    })

    it('Should have set the navigation matrix to null.', function() {
        naviBoard.destroyNavigation('simulation_1');
    })
});
