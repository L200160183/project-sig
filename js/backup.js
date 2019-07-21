//if JS doesnt want to update the overwritten code, try to ctrl + Shift + R in google chrome

var mymap = L.map('mapid', {
    zoomControl: false
}).setView([-7.55828, 110.82197], 13);

var basemap = L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
}).addTo(mymap);

//Add Some Geojson

var url = "http://localhost/putera/map/toko.php";
var url2 = "http://localhost/putera/map/stadium.php";

//icon
var tokoIcon = new L.Icon({
    iconUrl: "http://localhost/putera/icon/bar.png"
});
var tokoIcon2 = new L.Icon({
    iconUrl: "http://localhost/putera/icon/bar_red.png"
})
var StIcon = new L.Icon({
    iconUrl: "http://localhost/putera/icon/stadium.png"
})

function tokoFunction(feature, layer) {
    var att = feature.properties;
    var content = "<img src='" + att.img + "' class='img_toko'><table class='table table-striped table-hover'><tr><th>Name</th><td>" + att.nama + "</td></tr><tr><th>Status</th><td>" +
        att.status + "</td></tr><tr><th>Alamat</th><td>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia, repudiandae odio illo aliquid id ullam asperiores cum voluptatem ea officiis reiciendis, sapiente beatae a distinctio quos excepturi ipsam repellendus voluptatibus inventore at, facere labore laboriosam. Ea alias aut aspernatur, ab eum dolore suscipit ratione. Qui voluptatum autem animi, eaque adipisci.</td></tr></table>";
    layer.on({
        click: function (e) {
            $("#feature-title").html(feature.properties.nama);
            $("#feature-info").html(content);
            $("#featureModal").modal("show");
        }
    });

    if (att.price == 1) {
        var priceRange = 'Sangat Murah'
    } else if (att.price == 2) {
        var priceRange = 'Murah'
    } else if (att.price == 3) {
        var priceRange = 'Normal'
    } else if (att.price == 4) {
        var priceRange = 'Mahal'
    } else if (att.price == 5) {
        var priceRange = 'Sangat Mahal'
    }

    if (att.status == 'Inactive') {
        layer.setIcon(tokoIcon2).bindPopup("<img src='" + att.img + "' class='img_toko'><hr><p class='font-weight-bold'>Tempat : " + att.nama + "</p>Status : " + att.status + "<p>" + priceRange);
    } else {
        layer.setIcon(tokoIcon).bindPopup("<img src='" + att.img + "' class='img_toko'><hr><p class='font-weight-bold'>Tempat : " + att.nama + "</p>Status : " + att.status + "<p>" + priceRange);
    }
}

//function tokoFunction(feature, layer) {
//    var att = feature.properties;
//    if(att){
//        var content = ""
//    }
//    
//    if (att.price == 1){
//        var priceRange = 'Sangat Murah'
//    }else if (att.price == 2){
//        var priceRange = 'Murah'
//    }else if (att.price == 3){
//        var priceRange = 'Normal'
//    }else if (att.price == 4){
//        var priceRange = 'Mahal'
//    }else if (att.price == 5){
//        var priceRange = 'Sangat Mahal'
//    }
//    
//    if (att.status == 'Inactive') {
//        layer.setIcon(tokoIcon2).bindPopup("<img src='"+att.img+"' class='img_toko'><hr><p class='font-weight-bold'>Tempat : " + att.nama + "</p>Status : " + att.status+ "<p>"+priceRange);
//    } else {
//        layer.setIcon(tokoIcon).bindPopup("<img src='"+att.img+"' class='img_toko'><hr><p class='font-weight-bold'>Tempat : " + att.nama + "</p>Status : " + att.status+ "<p>"+priceRange);
//    }
//}

function filterToko(feature) {
    if (feature.properties.status == 'Active') return true
}

function filterTokotutup(feature) {
    if (feature.properties.status == 'Inactive') return true
}

/*var lyrtoko = L.geoJSON.ajax(url, {
    onEachFeature: tokoFunction
}).addTo(mymap); */
var lyrStadium = L.geoJSON.ajax(url2).addTo(mymap);
var lyrtoko1 = L.geoJSON.ajax(url, {
    filter: filterToko,
    onEachFeature: tokoFunction
}).addTo(mymap);

var lyrtoko2 = L.geoJSON.ajax(url, {
    filter: filterTokotutup,
    onEachFeature: tokoFunction
}).addTo(mymap);



var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("you click the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);

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
    "<img src='http://localhost/putera/icon/bar.png' width='24' height='28'> Bar Buka": lyrtoko1,
    "<img src='http://localhost/putera/icon/bar_red.png' width='24' height='28'> Bar Tutup": lyrtoko2,
    "Ref": lyrStadium
};

var ctlLayers = L.control.layers({
    'Basemap: ': basemap
}, ctlMaps, {
    collapsed: isCollapsed
}).addTo(mymap);
