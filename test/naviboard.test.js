var expect = require('chai').expect;
var assert = require('chai').assert;
var coordinates = require('./coordinate_array.json');
var naviBoard = require('../src/index');

var row = 0;
var column = 0;
var arrayOfCoordinates = [];
for (var i = 0; i < coordinates.length; i++) {
    var offsetXY = coordinates[i].offset;
    row = naviBoard.increaseRowCountIfRequired(offsetXY, row);
    column = naviBoard.increaseColumnCountIfRequired(offsetXY, column);
    var obj = {
        "offset": offsetXY,
        "elementToFocus": coordinates[i].elementToFocus,
        "iValue": coordinates[i].iValue
    }
    arrayOfCoordinates.push(obj)
}

describe('Coordinate calculation in naviboard JS', function() {

    it('it should create the array of expected length', function() {
        expect(arrayOfCoordinates.length).to.be.equal(coordinates.length);
    })

    it('row number should be as expected', function() {
        expect(row).to.be.equal(3);
    })

    it('column number should be as expected', function() {
        expect(column).to.be.equal(3);
    })
});

// describe('Matrix calculation in naviboard JS', function(){
// 	it('should be equal to the expected matrix',function(){
// 		naviBoard.makeNavigationRulesForComponent(arrayOfCoordinates, row, column);
// 		console.log(naviBoard.matrixForNavigation);
// 	})
// })