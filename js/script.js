//if JS doesnt want to update the overwritten code, try to ctrl + Shift + R in google chrome

var mymap = L.map('mapid', {
    zoomControl: false
}).setView([-7.560248, 110.802591], 15);

var basemap = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
}).addTo(mymap);

//Add Some Geojson
var url = "http://localhost/putera/map/toko.php";

//icon
var tokoIcon = new L.Icon({
    iconUrl: "http://localhost/web/icon-maps/coffee.png",
});
var tokoIcon2 = new L.Icon({
    iconUrl: "http://localhost/web/icon-maps/coffee-closed.png",
})

function tokoFunction(feature, layer) {
    var att = feature.properties;
    if (att.price == 1) {
        var priceRange = '<span class="fa fa-usd"></span>'
    } else if (att.price == 2) {
        var priceRange = '<span class="fa fa-usd"></span>&nbsp;<span class="fa fa-usd"></span>'
    } else if (att.price == 3) {
        var priceRange = '<span class="fa fa-usd"></span>&nbsp;<span class="fa fa-usd"></span>&nbsp;<span class="fa fa-usd"></span>'
    } else if (att.price == 4) {
        var priceRange = '<span class="fa fa-usd"></span>&nbsp;<span class="fa fa-usd"></span>&nbsp;<span class="fa fa-usd"></span>&nbsp;<span class="fa fa-usd"></span>'
    } else if (att.price == 5) {
        var priceRange = '<span class="fa fa-usd"></span>&nbsp;<span class="fa fa-usd"></span>&nbsp;<span class="fa fa-usd"></span>&nbsp;<span class="fa fa-usd"></span>&nbsp;<span class="fa fa-usd"></span>'
    }
    var content = "<img src='" + att.img + "' class='img_toko'><br><table class='table table-striped table-hover'><tr><th>Name</th><td>" + att.nama + "</td></tr><tr><th>Status</th><td>" +
        att.status + "</td></tr><tr><th>Alamat</th><td>"+att.alamat+"</td></tr><tr><th>Range Harga</th><td>"+priceRange+"</td></tr></table>";
    layer.on({
        click: function (e) {
            $("#feature-title").html(feature.properties.nama);
            $("#feature-info").html(content);
            $("#featureModal").modal("show");
        }
    });
    
    layer.bindTooltip("<strong>"+att.nama+"</strong><br>" + priceRange, {direction: 'top'});

    if (att.status == 'Inactive') {
        layer.setIcon(tokoIcon2);
    } else {
        layer.setIcon(tokoIcon);
    }
}


function filterToko(feature) {
    if (feature.properties.status == 'Active') return true
}

function filterTokotutup(feature) {
    if (feature.properties.status == 'Inactive') return true
}

var lyrtoko1 = L.geoJSON.ajax(url, {
    filter: filterToko,
    onEachFeature: tokoFunction
}).addTo(mymap);

var lyrtoko2 = L.geoJSON.ajax(url, {
    filter: filterTokotutup,
    onEachFeature: tokoFunction
}).addTo(mymap);

//Informasi Latlng saat klik daratan
//var popup = L.popup();
//
//function onMapClick(e) {
//    popup
//        .setLatLng(e.latlng)
//        .setContent("you click the map at " + e.latlng.toString())
//        .openOn(mymap);
//}
//
//mymap.on('click', onMapClick);

//Zoom berada di posisi bawah
var zoomControl = L.control.zoom({
    position: "bottomright"
}).addTo(mymap);


//Layer Control

if (document.body.clientWidth <= 767) {
    var isCollapsed = true;
} else {
    var isCollapsed = false;
}

var ctlMaps = {
    "<img src='http://localhost/web/icon-maps/coffee.png' width='24' height='28'> Open Cafe": lyrtoko1,
    "<img src='http://localhost/web/icon-maps/coffee-closed.png' width='24' height='28'> Closed Cafe": lyrtoko2,
};

var ctlLayers = L.control.layers({
    'Basemap: ': basemap
}, ctlMaps, {
    collapsed: isCollapsed
}).addTo(mymap);

//var searchLayers = L.control.search({
//    container: 'findbox',
//    initial: false,
//    collapsed: false
//}).addTo(mymap);
