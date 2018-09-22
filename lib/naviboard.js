var masterElement = window;

function naviboard() {
    this.currentEvent = null;
    this.componentRendered = null;
    this.matrixForNavigation = null;
    this.currentX = 0;
    this.currentY = 0;
    this.activeElement = null;
    this.prevComponentRendered = [];
    this.prevActiveElement = [];
    this.nextComponentRendered = null;
    this.arrayOfCoordinates = [];
    this.initialOffsetX = 0;
    this.initialOffsetY = 0;
    this.resume = true;
    this.matrixWidth = 0;
    this.matrixHeight = 0;
}

naviboard.prototype._getLocationOfActiveElement = function(elem) {
    if (this.matrixForNavigation != null) {
        for (var i = 0; i < this.matrixForNavigation.length; i++) {
            for (var j = 0; j < this.matrixForNavigation[0].length; j++) {
                if (this.matrixForNavigation[i][j] == elem) {
                    // console.log("getLocation" + i + ' ' + j);
                    return [i, j];
                    break;
                }
            }
        }
    }
    return [0, 0];
};

naviboard.prototype.getWindowRelativeOffset = function(elem) {
    var offset = {
        left: 0,
        top: 0
    };
    var offset = elem.getBoundingClientRect();
    return offset;
};

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function fillNavigationArray(temp1, temp2, t_width, t_height) {
    var arrToFill = Array.from(Object.create(temp2));
    var obj = temp1;

    function _expandElement(toFill, elem, x, y, m, n) {
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < m; j++) {
                toFill[x + i][y + j] = elem;
            }
        }
    }
    if (obj != undefined && obj != []) {
        for (var i = 0; i < obj.length; i++) {
            for (var j = 0; j < obj[i].length; j++) {
                if (obj[i][j] != null) {
                    var elemWidth = Math.round((obj[i][j].offset.width) / t_width);
                    var elemHeight = Math.round((obj[i][j].offset.height) / t_height);
                }
                if (obj[i][j] !== null && (elemWidth > 1 || elemHeight > 1)) {
                    _expandElement(arrToFill, obj[i][j].elementToFocus, i, j, elemWidth, elemHeight);
                } else if (obj[i][j] !== null) {
                    arrToFill[i][j] = obj[i][j].elementToFocus;
                } else {
                    // "Its null and non expanding!!
                }
            }
        }
    }
    return arrToFill;
}

naviboard.prototype.makeNavigationRulesForComponent = function(obj, row, column) {
    var self = this;
    // console.log(row, column);
    var navArray = JSON.parse(JSON.stringify(createArray(row, column)));

    var _getMatrixForNavigation = new Promise((resolve, reject) => {

        var threshold_width = this.matrixWidth / column;
        var threshold_height = this.matrixHeight / row;

        var sortByXYcoordinate = function(list) {

            for (var i = 0; i < list.length; i++) {
                var iValue = (list.length * list[i].offset.x) + list[i].offset.y;
                list[i].iValue = iValue;
            }
            list.sort(function(a, b) {
                var x_first = a.offset.y;
                var x_second = b.offset.y;
                return (x_first < x_second) ? -1 : (x_first > x_second) ? 1 : 0;
            });

            var sorted_by_x = [];
            var arr_to_push = [];
            var _INIT = false;
            for (var i = 0; i < list.length; i++) {
                if (!_INIT) {
                    arr_to_push.push(list[i]);
                    _INIT = true;
                } else {
                    if (list[i].offset.y > arr_to_push[arr_to_push.length - 1].offset.y && i != list.length - 1) {
                        sorted_by_x.push(arr_to_push);
                        arr_to_push = [];
                        arr_to_push.push(list[i]);
                    } else if (i === list.length - 1) {
                        if (list[i].offset.y > arr_to_push[arr_to_push.length - 1].offset.y) {
                            sorted_by_x.push(arr_to_push);
                            arr_to_push = [];
                            arr_to_push.push(list[i]);
                            sorted_by_x.push(arr_to_push);
                        } else {
                            arr_to_push.push(list[i]);
                            sorted_by_x.push(arr_to_push);
                        }
                    } else {
                        arr_to_push.push(list[i]);
                    }
                }
            }
            if (arr_to_push.length > 0 && sorted_by_x.length == 0) {
                sorted_by_x.push(arr_to_push);
            }

            for (var j = 0; j < sorted_by_x.length; j++) {
                sorted_by_x[j].sort(function(a, b) {
                    var x_first = a.offset.x;
                    var x_second = b.offset.x;
                    return (x_first < x_second) ? -1 : (x_first > x_second) ? 1 : 0;
                });
            }

            var value_x = [...new Set(sorted_by_x.reduce((a, c) => a.concat(c.map(({ offset: { x } }) => x)), []))].sort((a, b) => a - b)

            sorted_by_x.forEach(row => {
                value_x.forEach((x, i) => {
                    if (row[i] === undefined || row[i].offset.x > x) {
                        row.splice(i, 0, null)
                    }
                });
            });
            return sorted_by_x;
        }
        resolve(fillNavigationArray(sortByXYcoordinate(obj), navArray, threshold_width, threshold_height));
        reject(err);
    });

    _getMatrixForNavigation.then((matrix) => {
        self.matrixForNavigation = matrix;
        if (self.matrixForNavigation.length != 0 && self.matrixForNavigation != undefined) {
            var prevcomponent_back=false;
            if (self.prevComponentRendered.length >= 2 && self.prevActiveElement.length >= 2) {
                if (self.prevComponentRendered[self.prevComponentRendered.length - 2] == self.nextComponentRendered && self.prevComponentRendered[self.prevComponentRendered.length - 2] != null && self.nextComponentRendered != null) {
                    var coordsOfPreviousElement = self.prevActiveElement[self.prevActiveElement.length - 2];
                    self.currentX = coordsOfPreviousElement[0];
                    self.currentY = coordsOfPreviousElement[1];
                    prevcomponent_back=true;
                }
            }
            if (self.matrixForNavigation.length < self.currentX && self.matrixForNavigation[0].length < self.currentY) {
                for (var j = 0; j < self.matrixForNavigation[0].length; j++) {
                    if (self.matrixForNavigation[0][j] != null) {
                        self.currentX = 0;
                        self.currentY = j;
                        self.activeElement = self.matrixForNavigation[self.currentX][self.currentY];
                        self.activeElement.focus();
                        break;
                    }
                }
            }else if(self.matrixForNavigation.length > self.currentX && self.matrixForNavigation[0].length > self.currentY && prevcomponent_back){
                self.activeElement = self.matrixForNavigation[self.currentX][self.currentY];
                self.activeElement.focus();
            } else if (self.matrixForNavigation.length > self.currentX && self.matrixForNavigation[0].length > self.currentY) {

                for (var j = 0; j < self.matrixForNavigation[0].length; j++) {
                    if (self.matrixForNavigation[0][j] != null) {
                        self.currentX = 0;
                        self.currentY = j;
                        self.activeElement = self.matrixForNavigation[self.currentX][self.currentY];
                        self.activeElement.focus();
                        break;
                    }
                }
            } else {
                for (var j = 0; j < self.matrixForNavigation[0].length; j++) {
                    if (self.matrixForNavigation[0][j] != null) {
                        self.currentX = 0;
                        self.currentY = j;
                        self.activeElement = self.matrixForNavigation[self.currentX][self.currentY];
                        self.activeElement.focus();
                        break;
                    }
                }
            }
        }
    }, (err) => {
        console.log(err);
    });
}

var prevTime = new Date().getTime();

naviboard.prototype.destroyCurrentNavigationView = function(id, status) {
    var newTime = new Date().getTime();
    if (newTime - prevTime < 250) {
        prevTime = newTime;
        return false
    } else {
        if (status == "destroy") {
            this.prevComponentRendered.push(this.componentRendered);
            if (this.prevComponentRendered.length >= 5) {
                this.prevComponentRendered = this.prevComponentRendered.slice(Math.max(this.prevComponentRendered.length - 5, 2))

            }
            this.prevActiveElement.push(this._getLocationOfActiveElement(this.activeElement));
            if (this.prevActiveElement.length >= 5) {
                this.prevActiveElement = this.prevActiveElement.slice(Math.max(this.prevActiveElement.length - 5, 2));
            }
            this.arrayOfCoordinates = [];
            xFilled = [];
            yFilled = [];
            this.initialOffsetX = 0;
            this.initialOffsetY = 0;
            this.matrixForNavigation = null;
            this.currentX = 0;
            this.currentY = 0;
            this.activeElement = null;
            this.currentEvent = null;
            this.componentRendered = null;
            prevTime = newTime;
            return true;

        } else {
            xFilled = [];
            yFilled = [];
            this.arrayOfCoordinates = [];
            this.initialOffsetX = 0;
            this.initialOffsetY = 0;
            this.matrixForNavigation = null;
            this.currentX = 0;
            this.currentY = 0;
            this.activeElement = null;
            this.currentEvent = null;
            prevTime = newTime;
            return true;
        }
    }
}
var xFilled = [];
var yFilled = [];

function findMinMaxWidth(arr) {
    let min_left = arr[0].offset.left,
        max_right = arr[0].offset.right;
    let min_top = arr[0].offset.top,
        max_bottom = arr[0].offset.bottom;

    for (let i = 1, len = arr.length; i < len; i++) {
        let v = arr[i].offset.left;
        let p = arr[i].offset.top;
        let u = arr[i].offset.right;
        let q = arr[i].offset.bottom;
        min_left = (v < min_left) ? v : min_left;
        min_top = (p < min_top) ? p : min_top;
        max_right = (u > max_right) ? u : max_right;
        max_bottom = (q > max_bottom) ? q : max_bottom;
    }
    var width = max_right - min_left;
    var height = max_bottom - min_top;
    return [width, height];
}

naviboard.prototype.increaseRowCountIfRequired = function(offset, rowcount) {

    offset.y = Math.round(offset.y);
    if (offset.y > this.initialOffsetY && offset.y > Math.max(...yFilled)) {
        this.initialOffsetY = offset.y;
        yFilled.push(offset.y);
        return rowcount + 1;
    } else if (offset.y < this.initialOffsetY && !yFilled.includes(offset.y)) {
        this.initialOffsetY = offset.y;
        yFilled.push(offset.y);
        return rowcount + 1;
    } else {
        return rowcount;
    }
}
naviboard.prototype.increaseColumnCountIfRequired = function(offset, columnCount) {
    offset.x = Math.round(offset.x);

    if (offset.x > this.initialOffsetX && offset.x > Math.max(...xFilled)) {
        this.initialOffsetX = offset.x;
        xFilled.push(offset.x);
        return columnCount + 1;
    } else if (offset.x < this.initialOffsetX && !xFilled.includes(offset.x)) {
        this.initialOffsetX = offset.x;
        xFilled.push(offset.x);
        return columnCount + 1;
    } else {
        return columnCount;
    }
}

naviboard.prototype.handleView = function(elementIdOfComponentDOM) {
    var self = this;
    self.arrayOfCoordinates = [];
    self.componentRendered = elementIdOfComponentDOM;
    var childNodes = [];
    var _getAllChildNodes = new Promise((resolve, reject) => {
        masterElement = document.getElementById(elementIdOfComponentDOM);
        childNodes = masterElement.getElementsByClassName("navigable");
        resolve(childNodes);
        reject(err);
    });

    _getAllChildNodes.then((children) => {
        var row = 0;
        var column = 0;

        for (var i = 0; i < children.length; i++) {
            children[i].tabIndex = children[i].tabIndex === -1 ? 0 : children[i].tabIndex;
            var offsetXY = self.getWindowRelativeOffset(children[i]);
            row = self.increaseRowCountIfRequired(offsetXY, row);
            column = self.increaseColumnCountIfRequired(offsetXY, column);
            var obj = {
                "offset": offsetXY,
                "elementToFocus": children[i]
            }
            self.arrayOfCoordinates.push(obj);
        }
        self.matrixWidth = findMinMaxWidth(self.arrayOfCoordinates)[0];
        self.matrixHeight = findMinMaxWidth(self.arrayOfCoordinates)[1];
        self.makeNavigationRulesForComponent(self.arrayOfCoordinates, row, column);
    }, (err) => {
        console.log(err);
    });
}

var naviBoard = new naviboard();

naviBoard.getActiveElement = function() {
    return this.activeElement;
}

naviBoard.setNavigation = function(id) {
    if (this.matrixForNavigation === null) {
        this.nextComponentRendered = id;
        this.handleView(id);
    } else {
        // console.log("Destroy the previous navigation first!");
    }
}

naviBoard.destroyNavigation = function(id) {
    this.destroyCurrentNavigationView(id, "destroy");
}


naviBoard.getCurrentEvent = function(event) {
    return this.currentEvent;
};

naviBoard.refreshNavigation = function(id, status) {
    if (status == "refresh") {
        this.prevComponentRendered.push(this.componentRendered);
        this.prevActiveElement.push(this._getLocationOfActiveElement(activeElement));
        var refreshstatus = this.destroyCurrentNavigationView(id, "destroy");
        if (refreshstatus) {
            this.handleView(id);
        } else {}
    } else {
        var refreshstatus = false;
        refreshstatus = this.destroyCurrentNavigationView(id, status);
        if (refreshstatus) {
            this.handleView(id);
        } else {}
    }
}

naviBoard.getNavigationComponent = function() {
    return this.componentRendered;
}

naviBoard.resumeNavigation = function() {
    this.resume = true;
}
naviBoard.pauseNavigation = function() {
    this.resume = false;
}
var handleKeyDown = function(event) {
    if (this.matrixForNavigation !== null && this.resume) {
        var maxHeight = this.matrixForNavigation.length;
        var maxWidth = this.matrixForNavigation[0].length;

        var check_the_left = function() {
            var _column = arguments[1];
            while (_column >= 0) {
                if (this.matrixForNavigation[arguments[0]][_column] !== undefined && this.matrixForNavigation[arguments[0]][_column] !== null) {
                    this.activeElement.blur();
                    this.currentX = arguments[0];
                    this.currentY = _column;
                    this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                    this.activeElement.focus();
                    return true;
                }
                _column--;
            }
            return false;
        }.bind(this)

        var check_the_right = function() {
            var _column = arguments[1];
            while (_column < maxWidth) {
                if (this.matrixForNavigation[arguments[0]][_column] !== undefined && this.matrixForNavigation[arguments[0]][_column] !== null) {
                    this.activeElement.blur();
                    this.currentX = arguments[0];
                    this.currentY = _column;
                    this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                    this.activeElement.focus();
                    return true;
                }
                _column++;
            }
            return false;
        }.bind(this)

        var check_the_top = function() {
            var _row = arguments[0];
            while (_row >= 0) {
                if (this.matrixForNavigation[_row][arguments[1]] !== undefined && this.matrixForNavigation[_row][arguments[1]] !== null) {
                    this.activeElement.blur();
                    this.currentY = arguments[1];
                    this.currentX = _row;
                    this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                    this.activeElement.focus();
                    return true;
                }
                _row--;
            }
            return false;
        }.bind(this)

        var check_the_bottom = function() {
            var _row = arguments[0];
            while (_row < maxHeight) {
                if (this.matrixForNavigation[_row][arguments[1]] !== undefined && this.matrixForNavigation[_row][arguments[1]] !== null) {
                    this.activeElement.blur();
                    this.currentY = arguments[1];
                    this.currentX = _row;
                    this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                    this.activeElement.focus();
                    return true;
                }
                _row++;
            }
            return false;
        }.bind(this)

        if (this.matrixForNavigation != null && this.matrixForNavigation.length != 0) {
            this.currentEvent = event;
            if (event.keyCode == 40) { //Navigating down in vertical direction
                if (this.currentX + 1 >= maxHeight) { //"Nothing is DOWN!"

                } else if (this.matrixForNavigation[this.currentX + 1][this.currentY] != undefined && this.matrixForNavigation[this.currentX + 1][this.currentY] != this.activeElement) {
                    this.activeElement.blur();
                    this.currentX = this.currentX + 1;
                    this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                    this.activeElement.focus();
                } else if (this.matrixForNavigation[this.currentX + 1][this.currentY] !== undefined && this.matrixForNavigation[this.currentX + 1][this.currentY] != this.activeElement && this.matrixForNavigation[this.currentX + 1][this.currentY] === null) {
                    var bottom = this.currentX + 1;
                    var found = false;
                    while (bottom < maxHeight) {
                        if (this.matrixForNavigation[bottom][this.currentY] != null) {
                            this.activeElement.blur();
                            this.currentX = bottom;
                            this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                            this.activeElement.focus();
                            found = true;
                            break;
                        }
                        bottom++;
                    }

                    if (this.currentY >= 0 && !found) {
                        var check = check_the_left(this.currentX + 1, this.currentY);
                        if (check == false) {
                            check_the_right(this.currentX + 1, this.currentY);
                        }
                    }
                } else if (this.matrixForNavigation[this.currentX + 1][this.currentY] === this.activeElement) {
                    var bottom = this.currentX + 1;
                    while (bottom < maxHeight) {
                        if (this.matrixForNavigation[bottom][this.currentY] != this.activeElement) {
                            this.activeElement.blur();
                            this.currentX = bottom;
                            this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                            this.activeElement.focus();
                            break;
                        }
                        bottom++;
                    }
                } else {

                }
            } else if (event.keyCode == 38) {
                if (this.currentX - 1 < 0) { //"Nothing is UP !!"

                } else if (this.matrixForNavigation[this.currentX - 1][this.currentY] != undefined && this.matrixForNavigation[this.currentX - 1][this.currentY] != this.activeElement) {
                    this.activeElement.blur();
                    this.currentX = this.currentX - 1;
                    this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                    this.activeElement.focus();
                } else if (this.matrixForNavigation[this.currentX - 1][this.currentY] !== undefined && this.matrixForNavigation[this.currentX - 1][this.currentY] != this.activeElement && this.matrixForNavigation[this.currentX - 1][this.currentY] === null) {

                    var top = this.currentX - 1;
                    var found = false;
                    while (top >= 0) {
                        if (this.matrixForNavigation[top][this.currentY] != null) {
                            this.activeElement.blur();
                            this.currentX = top;
                            this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                            this.activeElement.focus();
                            found = true;
                            break;
                        }
                        top--;
                    }

                    if (this.currentY > 0 && !found) {
                        var check = check_the_left(this.currentX - 1, this.currentY);
                        if (check == false) {
                            check_the_right(this.currentX - 1, this.currentY);
                        }
                    }
                } else if (this.matrixForNavigation[this.currentX - 1][this.currentY] === this.activeElement) {

                    var top = this.currentX - 1;
                    while (top >= 0) {
                        if (this.matrixForNavigation[top][this.currentY] != this.activeElement) {
                            this.activeElement.blur();
                            this.currentX = top;
                            this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                            this.activeElement.focus();
                            break;
                        }
                        top--;
                    }
                } else {

                }
            } else if (event.keyCode == 39) {
                if (this.currentY + 1 >= maxWidth) { //"Nothing is RIGHT !"

                } else if (this.matrixForNavigation[this.currentX][this.currentY + 1] != undefined && this.matrixForNavigation[this.currentX][this.currentY + 1] != this.activeElement) {
                    this.activeElement.blur();
                    this.currentY = this.currentY + 1;
                    this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                    this.activeElement.focus();
                } else if (this.matrixForNavigation[this.currentX][this.currentY + 1] !== undefined && this.matrixForNavigation[this.currentX][this.currentY + 1] != this.activeElement && this.matrixForNavigation[this.currentX][this.currentY + 1] === null) {
                    var found = false;
                    var right = this.currentY + 1;
                    while (right < maxWidth) {
                        if (this.matrixForNavigation[this.currentX][right] != null) {
                            this.activeElement.blur();
                            this.currentY = right;
                            this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                            this.activeElement.focus();
                            found = true;
                            break;
                        }
                        right++;
                    }

                    if (this.currentY > 0 && !found) {
                        var check = check_the_top(this.currentX, this.currentY + 1);
                        if (check == false) {
                            check_the_bottom(this.currentX, this.currentY + 1);
                        }
                    }
                } else if (this.matrixForNavigation[this.currentX][this.currentY + 1] === this.activeElement) {
                    var right = this.currentY + 1;
                    while (right < maxWidth) {
                        if (this.matrixForNavigation[this.currentX][right] != this.activeElement) {
                            this.activeElement.blur();
                            this.currentY = right;
                            this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                            this.activeElement.focus();
                            break;
                        }
                        right++;
                    }
                } else {

                }
            } else if (event.keyCode == 37) {
                if (this.currentY - 1 < 0) { //"Nothing is LEFT !!"

                } else if (this.matrixForNavigation[this.currentX][this.currentY - 1] != undefined && this.matrixForNavigation[this.currentX][this.currentY - 1] != this.activeElement) {
                    this.activeElement.blur();
                    this.currentY = this.currentY - 1;
                    this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                    this.activeElement.focus();
                } else if (this.matrixForNavigation[this.currentX][this.currentY - 1] !== undefined && this.matrixForNavigation[this.currentX][this.currentY - 1] != this.activeElement && this.matrixForNavigation[this.currentX][this.currentY - 1] === null) {
                    var left = this.currentY - 1;
                    var found = false;
                    while (left >= 0) {
                        if (this.matrixForNavigation[this.currentX][left] != null) {
                            this.activeElement.blur();
                            this.currentY = left;
                            this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                            this.activeElement.focus();
                            found = true;
                            break;
                        }
                        left--;
                    }

                    if (this.currentX > 0 && !found) {
                        var check = check_the_top(this.currentX, this.currentY - 1);
                        if (check == false) {
                            check_the_bottom(this.currentX, this.currentY - 1);
                        }
                    }
                } else if (this.matrixForNavigation[this.currentX][this.currentY - 1] === this.activeElement) {
                    var left = this.currentY - 1;
                    while (left >= 0) {
                        if (this.matrixForNavigation[this.currentX][left] != this.activeElement) {
                            this.activeElement.blur();
                            this.currentY = left;
                            this.activeElement = this.matrixForNavigation[this.currentX][this.currentY];
                            this.activeElement.focus();
                            break;
                        }
                        left--;
                    }
                } else {

                }
            } else {

            }
        } else {}
    } else {
        console.log("Navigation is paused");
    }
}.bind(naviBoard);

masterElement.addEventListener("keydown", handleKeyDown, true);

module.exports = naviBoard;