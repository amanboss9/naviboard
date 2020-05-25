let JSDOM = require('jsdom').JSDOM;

/** simulation_1 navigation matrix with 11 elements.
 1  2  2  2
 3  2  2  2
 4  2  2  2
 5  6  7  8
 -  9 10  11
 **/
const simulation_1 = require('./simulation_1.json');
const dom = new JSDOM(
    `<html>
            <body>
            <div id="simulation_1">
                <div class="leftbox">
                    <div class="navigable"></div>
                    <div class="navigable"></div>
                    <div class="navigable"></div>
                    <div class="navigable"></div>
                    <div class="nonfocusable"></div>
                </div>
                <div class="rightbox">
                    <div id="main" class="navigable"></div>
                    <div class="bottombox">
                        <div class="navigable"></div>
                        <div class="navigable"></div>
                        <div class="navigable"></div><br>
                        <div class="navigable"></div>
                        <div class="navigable"></div>
                        <div class="navigable"></div>
                    </div>
                </div>
            </div>
            </body>
           </html>`
)
global.window = dom.window;
global.document = dom.window.document;

masterElement = document.getElementById('simulation_1');
childNodes = masterElement.getElementsByClassName("navigable");

for(let i=0; i<childNodes.length;i++) {
    let child = childNodes[i];
    child.getBoundingClientRect = () => (simulation_1[i]);
}
exports.dom = dom;
