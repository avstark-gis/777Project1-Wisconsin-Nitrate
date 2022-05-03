//wiscmain 05/02

//Global Var
var map;
var attSel = 'idwNitrateMean';
//var attSel = "canrate";//what property will be in drop down options on load 
var newVals; //k entry


//var defaultK = Number(1);
//var defaultK;
//var newVal = defaultK;


//========= input K =========
function processInput(newVal){
if (isNaN(newVal)){
    window.alert("Please Enter a Number");

} else if (newVal <= 0){
    window.alert("Please Enter a Number Greater Than Zero");
    
} else {
    window.alert("Sending your K Value Now");
    updateMap(newVal);
    //useKvalueTest(newVal);
    useKvalue(newVal);
}
}

//========= set the map ===========
var mapboxAtt = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGFuY2VsYXphcnRlIiwiYSI6ImNrcDIyZHN4bzAzZTEydm8yc24zeHNodTcifQ.ydwAELOsAYya_MiJNar3ow';
var map = L.map('map', {
zoomControl: false
});
map.setView([44.605, -89.865], 6.5);
var mapboxmap = L.tileLayer(mapboxUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mapboxAtt}).addTo(map);
//============ Zoom Home =============
L.Control.zoomHome = L.Control.extend({
options: {
position: 'topleft',
zoomInText: '+',
zoomInTitle: 'Zoom In',
zoomOutText: '-',
zoomOutTitle: 'Zoom Out',
zoomHomeText: ' ',
zoomHomeTitle: 'Return Home'
},
onAdd: function (map) {
var controlName = 'gin-control-zoom',
    container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
    options = this.options;
this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
controlName + '-in', container, this._zoomIn);
this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
controlName + '-out', container, this._zoomOut);
this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
controlName + '-home', container, this._zoomHome);
this._updateDisabled();
map.on('zoomend zoomlevelschange', this._updateDisabled, this);
return container;
},
onRemove: function (map) {
map.off('zoomend zoomlevelschange', this._updateDisabled, this);
},
_zoomIn: function (e) {
this._map.zoomIn(e.shiftKey ? 3 : 1);
},
_zoomOut: function (e) {
this._map.zoomOut(e.shiftKey ? 3 : 1);
},
_zoomHome: function (e) {
map.setView([44.605, -89.865], 7);
},
_createButton: function (html, title, className, container, fn) {
var link = L.DomUtil.create('a', className, container);
link.innerHTML = html;
link.href = '#';
link.title = title;
L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
    .on(link, 'click', L.DomEvent.stop)
    .on(link, 'click', fn, this)
    .on(link, 'click', this._refocusOnMap, this);
return link;
},
_updateDisabled: function () {
var map = this._map,
    className = 'leaflet-disabled';
L.DomUtil.removeClass(this._zoomInButton, className);
L.DomUtil.removeClass(this._zoomOutButton, className);
if (map._zoom === map.getMinZoom()) {
    L.DomUtil.addClass(this._zoomOutButton, className);
}
if (map._zoom === map.getMaxZoom()) {
    L.DomUtil.addClass(this._zoomInButton, className);
}
}
});
// Add the new control to the map
var zoomHome = new L.Control.zoomHome();
zoomHome.addTo(map);
//-----end Zoom Home

//=======Reset the Map=======

let resetMap = L.easyButton({
states: [{
    stateName: 'reset',
    icon: 'circle-arrrow',
    title: 'Reset the Map',
    onClick: function(){
    window.location.href = "index.html";
    },
position: 'topleft'
}]
});
resetMap.addTo(map);

//====== Layer Variables  ||  Controls 
var pointjson = new L.geoJson(wellPoint);
var cancertractsLG = L.layerGroup();

var baseLayers = {
"Light": mapboxmap
};
var otherLayers = {
"Well Points": pointjson
};


let cancerGeojson = L.geoJson(cancerTract, {
style: styleLayer,
onEachFeature: onEachFeature
}).addTo(map); //uncomment addTo

imageURL = "img/waterLG.png";
let wiscGeojson = L.geoJson(wiscBoundary, {
style: {color: 'black', weight: '.7', fill: imageURL}//fillOpacity: 0
}).addTo(map);

var popup = L.popup({
closeButton: true,
autoClose: true
})
.setLatLng(map.getBounds().getCenter())
.setContent('<p>This is how you use this</p>')
.openOn(map);

// Set the basemap and add other layers to the control 
L.control.layers(null, otherLayers, { collapsed: false }).addTo(map);

// Leaflet control to show info on hover
var info = L.control({position:'bottomright'});
info.onAdd = function (map) {  //map
this._div = L.DomUtil.create('div', 'info');
this.update();
return this._div;
};
info.update = function (props) {
this._div.innerHTML = '<h4>Cancer Rate</h4>' + '<h5>' +  (props ?
    '<b>' + props.canrate +  '</b><br/>' 
    : 'Hover Over A Census Tract') +'</h5>';
};
//info.addTo(map);

//Leaflet control Legend
var legend = L.control({position: 'bottomleft'});

/* //Initial load of the Legend  
legend.onAdd = function (map) {
var legdiv = L.DomUtil.create('div', 'info legend'),
            //grades = [0, .05, .10, .15, .20, .25, .30, .35, .40, .45, .50],
            grades = [0, .10, .20, .30, .40, .50, .60],
            labels = [],
            from;// to
    for (var i = 0; i < grades.length; i++) {
            from = grades[i];  
            to = grades[i + 1];  
            //Change to getColorResults(from) for a boolen
            labels.push(
                '<i style="background:' + getColorCan(from + .01) + '"></i> ' +
                from + (to ?  ' ' + 'to' + ' ' + to + '% ' : '+ %'));
        }
    legdiv.innerHTML = labels.join('<br>');
        return legdiv;
};
*/

//The Leaflet Control and Options for the Dropdown 
var attDD = L.control({position: 'topright'});
attDD.onAdd = function (map) {
var attdiv = L.DomUtil.create('div', 'info attDD');
    attdiv.innerHTML = '<h4>Select Attribute</h4><select id="attOpt"><option value = "idwNitrateMean">IDW Average (k)</option><option value = "canrate">Cancer Rate</option></select>';
    attdiv.firstChild.onmousedown = attdiv.firstChild.ondblclick = L.DomEvent.stopPropagation;
        return attdiv;
        };
        
attDD.addTo(map);

//Optional leaflet custom control to display info -- submit k info?
//Colors for styleLayer()
function getColorCan(d) {
    return  d >=.60 ? '#6e0150' :   //purple
            d > .50 ? '#720000' :   // u of m + 
            d > .40 ? '#8B0000' :   // u of m
            d > .30 ? '#e34a33' :   // dusty rose
            d > .20 ? '#fc8d59' :   // darker peach
            d > .10 ? '#fdd49e' :   // peach
            d >   0 ? '#fef0d9' :   // pink
            '#eff3ff';//'#eff3ff';  // exact 0 or undefined map grey
    }
function getColorIdw(d) {
    return  d >= 8 ? '#005824' :
            d >  7 ? '#005824' : 
            d >  5 ? '#238b45' :
            d >  3 ? '#41ae76' :
            d >  2 ? '#99d8c9' :
            d >  1 ? '#ccece6' : 
            d >  0 ? '#e5f5f9' : 
            d > -1 ? '#f2f0f7' : //light blue-grey  was #d0d1e6
            '#eeefee';  //map grey 
}

//----Style for layers
function styleLayer(feature) {
if(attSel == "canrate"){
    var color = getColorCan(feature.properties[attSel])// .canrate
    }
if(attSel == "idwNitrateMean"){
    var color = getColorIdw(feature.properties[attSel])// .idwNitrateMean   |   attSel
    }
    
return {
    weight: .4,
    opacity: 1,
    color: 'grey', //black
    dashArray: '0',
    fillOpacity: 20,
    fillColor: color
};

}
function highlightFeature(e) {
var layer = e.target;
//Took out the Highlight Style -- just show info on Hover
if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
}
info.update(layer.feature.properties); 
}
function resetHighlight(e) {
info.update();
}
function zoomToFeature(e) {
map.fitBounds(e.target.getBounds());  
}
function onEachFeature(feature, layer) {
layer.on({
    mouseover: highlightFeature,  
    mouseout: resetHighlight, 
    click: zoomToFeature        
});
}

//======== Update the Map Object  ============

function updateMap(){
console.log("Start updateMap");

map.removeLayer(wiscGeojson);  //this was added to remove the Grey on load

var findLayers = new L.layerGroup();
map.eachLayer(function(layer){   
    
    findLayers.addLayer(layer); 

    if(layer.feature && layer.feature.properties[attSel]){  
        if(attSel == "canrate"){
            legend.onAdd = function (map) {
                var legdiv = L.DomUtil.create('div', 'info legend'),
                            grades = [0, .10, .20, .30, .40, .50, .60],
                            labels = [],
                            from, to ;// to

                        for (var i = 0; i < grades.length; i++) {
                            from = grades[i];  
                            to = grades[i + 1];  
                            //Change to getColorResults(from) for a boolen
                            labels.push(
                                '<i style="background:' + getColorCan(from + .01) + '"></i> ' +
                                from + (to ?  ' ' + 'to' + ' ' + to + '% ' : '+ %'));
                        }
                    legdiv.innerHTML = labels.join('<br>');
                        return legdiv;
            };
        
            info.update = function (props) { 
            this._div.innerHTML = '<h4>Average Cancer Rate</h4>' + '<h5>' +  (props?
                '<b>' + props.canrate +  '</b><br/>' 
                : 'Hover Over A Census Tract') +'</h5>';
            };
            info.remove();
            info.addTo(map)

            var color = getColorCan(layer.feature.properties.canrate); //this needs to be .canrate 
        //end of cancer rate   
        } 
        
        if(attSel == 'idwNitrateMean'){
            legend.onAdd = function (map) {
                    var legdiv = L.DomUtil.create('div', 'info legend'),
                        grades = [-1, 0, 1, 2, 3, 5, 7],
                        labels = [],
                        from, to; //from,

                    for (var i = -1; i < grades.length; i++) {   //
                        from = grades[i] ;
                        to = grades[i + 1]; //-1
                        labels.push(
                            '<i style="background:' + getColorIdw(from + 1) + '"></i> ' + 
                            //from + (to ? '%'+'to' + to + '%' : '% or less'));
                            //from +'  '+ (to ? 'to  ' + to  : ' '));
                            from);
                        }
                        legdiv.innerHTML = labels.join('<br>');
                        return legdiv;
                        };
            info.update = function (props) {
            this._div.innerHTML = '<h4>IDW Average</h4>' + '<h5>' +  (props ?
                '<b>' + props.idwNitrateMean +  '</b><br/>' 
                : 'Hover Over A Census Tract') +'</h5>';
            };
            info.remove();
            info.addTo(map)
            
            var color = getColorIdw(layer.feature.properties.idwNitrateMean); //needs to be idwNitrateMean
        } //end idw values
            
        //TODO remove the infowindow
            legend.remove();
            legend.addTo(map);
            var options = {
                weight: .4,
                opacity: 1,
                color: 'grey', //black
                dashArray: '0',
                fillOpacity: 20,
                fillColor: color
        };
        
        layer.setStyle(options);
        
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature
        });
        
        layer.redraw();
        layer.addTo(map);

    }; //if attSel
    console.log("this is the end up Update Map");
}); //end map each layer call back
}; //end update map

console.log("This is above turf"); 

//========== TURF =============
let myChart;
function useKvalue (newVal) {
// Set initial featureCollections 
let pointsFeature = turf.featureCollection(wellArray);
let cancerFeature = turf.featureCollection(cancerTract);
let polyFeature = turf.featureCollection(tractPoly);
//interpolate --> feature
let optionsIDW = {gridType: 'points', property: 'nitr_ran', units: 'miles', weight: newVal}; //newVal for weight
let pointsIDW = turf.interpolate(pointsFeature, 12, optionsIDW); //12 
let pointsIDWFeature = turf.featureCollection(pointsIDW);
//collect layers for idw point to polygon || 
//the featureCollection.collection is []  .map can only take []
let collectedIdwValues = turf.collect(polyFeature.features, pointsIDWFeature.features, 'nitr_ran','idwValues');
//featureEach to Centroid   ||  Sum idw points --> centroid --> feature
let sumArray = [];
let testArray =[];
turf.featureEach(collectedIdwValues, function(currentFeature, featureIndex) {
    if (currentFeature.properties.idwValues >= -10) {
        let sum =0;
        let counts =0;
        let centroidIdw = turf.centroid(currentFeature);
        
        for (var i = 0; i< currentFeature.properties.idwValues.length; i++) {
            sum += currentFeature.properties.idwValues[i];
            counts = currentFeature.properties.idwValues.length;
            let meanValue = Number((sum / counts).toFixed(2));  //change to fix the NaN values?
            //test 
            //test = currentFeature.properties.idwValues[i];
            //testArray.push(test);
            centroidIdw.properties = {IdwPoint:meanValue};
        }
    
    sumArray.push(centroidIdw);
        
    }
});
sumArrayFeature = turf.featureCollection(sumArray);

//collect the cancerFeature and IDWsum from sumArrayFeature YAY!  ---> Feature
let collectedIdwCanValues = turf.collect(cancerFeature.features, sumArrayFeature, 'IdwPoint', 'idwNitrateMean');

console.log("This is Dream Collect 1:");console.log(collectedIdwCanValues);
//=========== end TURF ===============
//======== Get [X,Y] for regression.js and chart.js
let arrayCanrate =[];
for ( var i in collectedIdwCanValues.features) {
    values = (Number(collectedIdwCanValues.features[i].properties.canrate));
    arrayCanrate.push(values);
}
let arrayIdw = [];
for ( var i in collectedIdwCanValues.features) {
    //this is where to put NaN ? 0 : i 
    let values = (Number(collectedIdwCanValues.features[i].properties.idwNitrateMean));
    let values0 = Number.isNaN(values) ? 0 : values;
    //console.log("test");   console.log(values0); console.count();
    arrayIdw.push(values0);    
}
let regressionArray =[];
let xyPairs = [];
for (var i=0; i <arrayCanrate.length; i++) {
    x = arrayCanrate[i];
    y = arrayIdw[i];
    regressionArray[i] = [x,y];
    let json = {x:Number(x), y:Number(y)};
    xyPairs.push(json);
    //valuePairs = [x,y];
    //regressionArray.push(valuePairs);
    
}

//=========== Regression ============
let regressionResult = regression.linear(regressionArray);
let ssRegression = ss.linearRegression(regressionArray);
let equation = regressionResult.string;
const gradient = regressionResult.equation[0];
const yIntercept = regressionResult.equation[1];
console.log("==================================")
console.log("ssRegression");console.log(ssRegression);
console.log("this is regression.js");console.log(regressionResult);
console.log(regressionResult.string);
console.log(gradient);
console.log(yIntercept);

//========== Chart ===================
const ctx = document.getElementById('myChart').getContext('2d');
        
if (myChart) myChart.destroy(); // https://stackoverflow.com/questions/40056555/destroy-chart-js-bar-graph-to-redraw-other-graph-in-same-canvas
myChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        //labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'X Axis = Cancer Rates  | Y Axis = IDW Avg Nitrate Levels',
            data: xyPairs,     
            backgroundColor: [
            'rgb(255, 99, 132)'
            ],
        }]
    },
    options: {
        scales: {
        x: {
            type: 'linear',
            position: 'bottom'
        } 
    }   
    }  
});
//========= Add data layers and Style the layers ==========
let canIdwjson = new L.geoJson(collectedIdwCanValues, {
style: styleLayer,  
onEachFeature: onEachFeature
});
map.addLayer(canIdwjson);
//updateMap(canIdwjson);  

}//end useKvalue

console.log("Right before Jquery");


// ======== Jquery =========

//----change dropdown option
$('#attOpt').change(function(){
attID = document.getElementById('attOpt');
attSel = attID.options[attID.selectedIndex].value;
updateMap(attSel);
})

//----change input---------

$('#input-box').change(function(){
console.log('input has changed');
newVal = Number($('input').val());
console.log(typeof newVal + "" + newVal);
processInput(newVal);
updateMap(newVal);
})




