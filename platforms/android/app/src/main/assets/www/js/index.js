/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var map, maxlat, maxlng, minlat, minlng, intensity, minDate, dt;
var markers =[];
var dataset = [];
var dataBase = []; /* array2 */
var nxtQuery = [];/* array */;
var f = new date();
var fecha= f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();

var user=document.getElementById('user').value;
var apellidos=document.getElementById('apellido').value;
var mail=document.getElementById('mail').value;
var rut=document.getElementById('rut').value;
var edad=document.getElementById('edad').value;
var select=document.getElementById('select').value;
var fono=document.getElementById('fono').value;
var carrera=document.getElementById('carrera').value;

$(document).ready( function(){
    dt = $('#table_id').DataTable({
        data: dataset,
        scrollX: true,
        columns: [
            { title: "Nombre"},
            { title: "Apellidos"},
            { title: "mail"},
            { title: "sexo"},
            { title: "edad"},
            { title: "fono"},
            { title: "carrera"},
        ],
        searching: false,
        paging: false,
        lengthChange: false,
    });
    $('#table_id').css('width','420px');
    $('#table_id tbody').on('click', 'tr', function(){
        var data = dt.row(this).data();
        clearMarkers();
        markers = [];
        markers.push(new google.maps.Marker({
            map: map,
            position: {lat: data[3], lng: data[4]},
            title: data[0],
        }));
        map.setZoom(15);
    });
    document.getElementById('btnChangeAddress').addEventListener('click', function(){
        $('.searchAddressAgain').css('display', 'none');
        $('.searchIntensityDisplay').css('display', 'none');
        $('.searchAddressDisplay').css('display', 'block');
        $('.searchIntensityAgain').css('display', 'none');
    });
    document.getElementById('btnSearchAgain').addEventListener('click', function(){
        $('.searchAddressAgain').css('display', 'none');
        $('.searchIntensityDisplay').css('display', 'none');
        $('.searchAddressDisplay').css('display', 'block');
        $('.searchIntensityAgain').css('display', 'none');
        $('.tableContainer').css('display', 'none');
        clearMarkers();
        dt.clear().draw();
    });
});
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.4726900, lng: -70.6472400},
        zoom: 15
    })
    var geocoder = new google.maps.Geocoder();
    document.getElementById('btnSearch').addEventListener('click', function(){
        changeAddress(geocoder, map);
    });
  
    
    
};


function changeAddress(geocoder, map) {
    var address = document.getElementById('address').value;
    geocoder.geocode({'address': address }, function(results, status){
        if(status === 'OK') {
            $('.searchAddressDisplay').css('display', 'none');
            $('.searchAddressAgain').css('display', 'block');
            $('.searchIntensityAgain').css('display', 'none');
            map.setCenter(results[0].geometry.location);
            markers.push(new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            }));
            maxlat = ( results[0].geometry.location.lat() + 1); 
            maxlng = ( results[0].geometry.location.lng() + 1); 
            minlat = ( results[0].geometry.location.lat() - 1); 
            minlng = ( results[0].geometry.location.lng() - 1); 
        } else {
            console.log('Fallo ' + status);
        }
    });
}
function Enviar(user,apellido,mail,carrera,fono,select,position,fecha) {
    position: results[0].geometry.location;
    $.ajax({
          success: function (){
            markers = [];
            clearMarkers();
            map.setZoom(5);
           
                markers.push(new google.maps.Marker({
                    map: map,
                    position: {lat: element.geometry.coordinates[1], lng: element.geometry.coordinates[0]},
                }));
            $('.tableContainer').css('display', 'block');
                dataBase.push(user);
                dataBase.push(apellido);
                dataBase.push(edad);
                dataBase.push(rut);
                dataBase.push(sexo);
                dataBase.push(mail);
                dataBase.push(carrera);
                dataBase.push(position);
                dataBase.push(fecha);
                nxtQuery.push(dataBase);
                dataBase = [];
                dt.row.add([user, apellido, edad, rut, sexo, mail, carrera, position,fecha]).draw();
            

            $('.searchAddressDisplay').css('display', 'none');
            $('.searchAddressAgain').css('display', 'none');
            $('.searchIntensityAgain').css('display', 'block');
            sql2(nxtQuery);
        },
        error: function(result){
            console.log(result);
        }
    });
}
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}
function sql2(array2)
{	
    var db = sqlitePlugin.openDatabase('T2S2.db', '1.0', '', 10*20);
    if(array2.length > 0) {
        db.transaction(function (txn) {
            txn.executeSql('CREATE TABLE IF NOT EXISTS alumno (id_alumno integer primary key, foto, nombres, apellidos, edad, rut, sexo, email, fono, carrera,cordenadas,fecha_creacion)');
            txn.executeSql('delete from Lugares');
            array2.forEach(function(element){
                txn.executeSql('INSERT INTO Lugares (foto, nombres, apellidos, edad, rut, sexo, email, fono, carrera,cordenadas,fecha_creacion) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [element[0], element[2], element[1],element[3],element[4],element[5],element[6],element[7],element[8],element[9],element[10]]);
            });

            txn.executeSql('SELECT * FROM Lugares', [], function(tx, results) {
                alert("Guardado con exito!, pasando a Prueba...");
                alert(results.rows.item(0).nombres);
            }, null);
        });
    }
}


