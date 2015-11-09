/**
 * Created by Danny on 11/6/15.
 */
var inputObject = {};

$(document).ready(function(){

    console.log("Oh look, jquery works");
    $("#inputForm").submit(addMessage);

    getMessage();
});

function addMessage(){
    event.preventDefault();

    $.each($("#inputForm").serializeArray(), function(i, field){
        inputObject[field.name] = field.value;
    });

    $.ajax({
        type: "POST",
        url: "/data",
        data: inputObject,
        success: function(data){
            getMessage();
        }
    });
    //console.log(inputObject);
    //getMessage(inputObject);
}

function getMessage(inputObject){
    $.ajax({
        type: "GET",
        url: "/data",
        data: inputObject,
        success: function(data){
            updateDOM(data);
        }
    });
}

function updateDOM(data){
    $("#messageContainer").empty();

    for(var i = 0; i < data.length; i++){
        var el = "<div class='well col-md-2'>" +
            "<p>" + data[i].name + "</p>" +
            "<p>" + data[i].message + "</p>"
            //"<button class='delete btn btn-danger' data-id='" +
            //data[i].id + "'>Delete</button>" +
            "</div>";

        $("#messageContainer").append(el);
    }
}