let JSDOM = require('jsdom').JSDOM;

const dom = new JSDOM(
    `<html>
            <style>
                #container {
                    background-color: #eee;
                    width: 825px;
                    height: 600px;
                    margin: 0 auto;
                    border: 1px solid black;
                }
            
                .leftbox {
                    float: left;
                }
            
                .rightbox {
                    float: right;
                }
            
                .bottombox {
                    font-size: 0px;
                }
            
                .leftbox .navigable, .bottombox .navigable, .nonfocusable {
                    background-color: #e8bbe5;
                    width: 200px;
                    height: 114px;
                    margin: 5px;
            
                    color: white;
                    text-align: center;
                    line-height: 114px;
                    vertical-align: top;
                    font-size: 1rem;
                }
            
                .nonfocusable {
                    background-color: #bbb;
                    color: black;
                }
            
                .nonfocusable::before {
                    content: 'Non-focusable Element';
                }
            
                .bottombox .navigable {
                    display: inline-block;
                    margin-left: 0px;
                    margin-bottom: 0px;
                }
            
                #main {
                    background-color: #8db0e8;
                    width: 610px;
                    height: 352px;
                    margin: 5px 0 0 0;
                }
            
                .navigable {
                    outline: 0;
                }
            
                .navigable:focus {
                    opacity: 1;
                    background-color:red !important;
                }
            
                #sidebox {
                    width: 825px;
                    margin: 2em auto 0 auto;
                }
            
            </style>
            <body>
            <div id="container">
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

masterElement = document.getElementById('container');
childNodes = masterElement.getElementsByClassName("navigable");
const simulatedBoundingClient = [
    {
        "x": 659.1666870117188,
        "y": 13.97569465637207,
        "width": 200.00001525878906,
        "height": 113.99305725097656,
        "top": 13.97569465637207,
        "right": 859.1667022705078,
        "bottom": 127.96875190734863,
        "left": 659.1666870117188
    },
    {
        "x": 659.1666870117188,
        "y": 132.96875,
        "width": 200.00001525878906,
        "height": 113.99305725097656,
        "top": 132.96875,
        "right": 859.1667022705078,
        "bottom": 246.96180725097656,
        "left": 659.1666870117188
    },
    {
        "x": 659.1666870117188,
        "y": 251.96182250976562,
        "width": 200.00001525878906,
        "height": 113.99305725097656,
        "top": 251.96182250976562,
        "right": 859.1667022705078,
        "bottom": 365.9548797607422,
        "left": 659.1666870117188
    },
    {
        "x": 659.1666870117188,
        "y": 370.9548645019531,
        "width": 200.00001525878906,
        "height": 113.99305725097656,
        "top": 370.9548645019531,
        "right": 859.1667022705078,
        "bottom": 484.9479217529297,
        "left": 659.1666870117188
    },
    {
        "x": 864.1666870117188,
        "y": 13.97569465637207,
        "width": 610,
        "height": 351.9965515136719,
        "top": 13.97569465637207,
        "right": 1474.1666870117188,
        "bottom": 365.97224617004395,
        "left": 864.1666870117188
    },
    {
        "x": 864.1666870117188,
        "y": 370.97222900390625,
        "width": 200.00001525878906,
        "height": 113.99305725097656,
        "top": 370.97222900390625,
        "right": 1064.1667022705078,
        "bottom": 484.9652862548828,
        "left": 864.1666870117188
    },
    {
        "x": 1069.166748046875,
        "y": 370.97222900390625,
        "width": 200.00001525878906,
        "height": 113.99305725097656,
        "top": 370.97222900390625,
        "right": 1269.166763305664,
        "bottom": 484.9652862548828,
        "left": 1069.166748046875
    },
    {
        "x": 1274.166748046875,
        "y": 370.97222900390625,
        "width": 200.00001525878906,
        "height": 113.99305725097656,
        "top": 370.97222900390625,
        "right": 1474.166763305664,
        "bottom": 484.9652862548828,
        "left": 1274.166748046875
    },
    {
        "x": 864.1666870117188,
        "y": 489.9653015136719,
        "width": 200.00001525878906,
        "height": 113.99305725097656,
        "top": 489.9653015136719,
        "right": 1064.1667022705078,
        "bottom": 603.9583587646484,
        "left": 864.1666870117188
    },
    {
        "x": 1069.166748046875,
        "y": 489.9653015136719,
        "width": 200.00001525878906,
        "height": 113.99305725097656,
        "top": 489.9653015136719,
        "right": 1269.166763305664,
        "bottom": 603.9583587646484,
        "left": 1069.166748046875
    },
    {
        "x": 1274.166748046875,
        "y": 489.9653015136719,
        "width": 200.00001525878906,
        "height": 113.99305725097656,
        "top": 489.9653015136719,
        "right": 1474.166763305664,
        "bottom": 603.9583587646484,
        "left": 1274.166748046875
    }
]
for(let i=0; i<childNodes.length;i++) {
    let child = childNodes[i];
    child.getBoundingClientRect = () => (simulatedBoundingClient[i]);
}
exports.dom = dom;
