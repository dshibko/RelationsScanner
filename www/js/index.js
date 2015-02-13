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

document.addEventListener("deviceready", init, false);

function initAds() {
    admobid = {
        banner: 'ca-app-pub-1970310444318775/4123408045',
        interstitial: 'ca-app-pub-1970310444318775/9751139248'
    };
}

$(document).ready(function(){;
/*$('#buttons').hide();
$('.header').hide();
var c = document.getElementById("picCanvas");
var canvas = $('#picCanvas');
c.width = $('#cameraPic').width();
c.height = $('#cameraPic').height() + 50;
var ctx=c.getContext("2d");
ctx.drawImage(cameraPic, 0, 0, c.width, c.height - 50);
//var markHeight = $('#mark').height() * $('#cameraPic').width() / $('#mark').width();
//ctx.drawImage(mark, 0, c.height - markHeight - 450, c.width, markHeight);

var maxFontSize = 48;
var minFontSize = 12;

var relation = relations[32];

var fontSize = c.width / relation.length * 2;
if (fontSize > maxFontSize) {
    fontSize = maxFontSize;
} else if (fontSize < minFontSize) {
    fontSize = minFontSize;
}
ctx.font = fontSize+"px Calibri";
ctx.textBaseline = "top";

var marginLeft = (c.width - ctx.measureText(relation).width) / 2;
wrapText(ctx, relation, marginLeft, c.height - 35, c.width, fontSize+2);
 $.post('http://us-faces.esy.es/uploads.php',({image: c.toDataURL('image/png')}), function(data) {
                alert(data);
                if(data != "") {
                    console.log(data);
                } else {
                    // couldn't connect
                }
                },'json');


//c.height = $('#cameraPic').height()+500;
 //var dataURL = c.toDataURL("image/png");
 //console.log(dataURL);*/
});
function init() {
VKOauth.auth(false);

/*VK.Auth.login(function(response) {
  authInfo(response);
});*/
    checkConnection();
    setInterval(checkConnection, 5000);

    initAds();
    if(AdMob) {
        AdMob.createBanner({
            adId: admobid.banner,
            position: AdMob.AD_POSITION.TOP_CENTER,
            autoShow: true
        });

        AdMob.prepareInterstitial({
            adId:admobid.interstitial,
            autoShow:false
        });
    }

    $('#takePic').bind('click', function() {
        navigator.camera.getPicture(getPhoto,null,{quality:60,destinationType:0,targetWidth: 800});
    });

    $('#uploadPic').bind('click', function() {
        navigator.camera.getPicture(getPhoto,null,{quality:50,destinationType:0,sourceType:0});
    });

    $('#startScan').bind('click', function() {
        $('#newScan').hide();
        $('#startScan').hide();
        scan();
    });

    $('#newScan').bind('click', function() {
        $('#picContainer').removeClass('result');
        $('#relationTitle').remove();
        $('#relation').remove();
        $('#pic').remove();
        if ($(".progress-bar").hasClass("progress-bar-success")) {
            AdMob.showInterstitial();
            $(".progress-bar").removeClass("progress-bar-success");
        }

        $('#picCanvas').remove();
        $('#canvasContainer').hide();
        $('#canvasContainer').html('<canvas id="picCanvas"></canvas>');

        $('.vkShare').html('');
        $('.vkShare').hide();
        $('#cameraPic').hide();
        $('#newScan').hide();
        $('#startScan').hide();
        $('#buttons').show();
        $('#cameraPic').hide('slow');
        $(".progress-bar").parent().hide();
    });


}

function checkConnection() {
    var networkState = navigator.connection.type;

    if (networkState == Connection.NONE) {
        navigator.notification.alert(
            'Необходимо интернет-соединение',
            closeApp,
            'Внимание',
            'ОК'
        );
    }
}

function closeApp() {
    navigator.app.exitApp();
}

function getPhoto(data) {
    //alert($.md5(data));
    $('p.header').hide();
    $('#buttons').hide();

    cameraPic.src = "data:image/jpeg;base64," + data;

    $('#cameraPic').show(100, function() {
        $('#startScan').show();
        $('#newScan').show();
    });
}

function scan() {
     $(".progress-bar").parent().addClass("active");
     $(".progress-bar").parent().show();
     $('.scaning').show();
     $('#scanLine').css({
        width: $('#cameraPic').width(),
        top: $('#cameraPic').offset().top,
        left: $('#cameraPic').offset().left,
        width: $('#cameraPic').width()
     });

     $('.shadow').css({
        width: $('#cameraPic').width(),
        height: 1,
        left: $('#cameraPic').offset().left,
        top: $('#cameraPic').offset().top
     });

     $('#scanLine').animate({
         top: $('#cameraPic').height() + $('#cameraPic').offset().top
     },{
         step: function( now, fx ) {
            $('.shadow').css('height', now - parseFloat($('#cameraPic').offset().top));
         },
         duration: 7000,
         easing: "linear",
         complete: function() {
             $('#scanLine').css('width', $('#cameraPic').height());
             $('#scanLine').css({
                transform: 'rotate(90deg)',
                left: $('#cameraPic').offset().left + parseInt($('#cameraPic').css('width')) - parseInt($('#scanLine').css('width')) / 2,
                top: $('#cameraPic').offset().top + $('#cameraPic').height() / 2 - 1
             });

             $('#scanLine').animate({
                left: $('#cameraPic').offset().left - $('#scanLine').width() / 2
             },{
                step: function( now, fx ) {
                    $('.shadow').css('width', now - $('#cameraPic').offset().left + $('#scanLine').width() / 2);
                },
                duration: 7000,
                easing: "linear",
                complete: function() {
                    $('.shadow').width(0);
                    $('#scanLine').hide();
                    $(".progress-bar").addClass("progress-bar-success");
                    $(".progress-bar").parent().removeClass("active");
                    showResult();
                }
             });
         }
     });
}

function showResult() {
    $('.progress').slideUp('slow');
    var relation = relations[getRandom(0, 27)];
    var relationTitle = relation['key'];
    relation = relation[getRandom(0, Object.keys(relation).length-1)];

    $('#cameraPic').before('<p id="relationTitle">'+relationTitle+'</p>');
    $('#cameraPic').after('<p id="relation">'+relation+'</p>');
    $('#picContainer').addClass('result');

    html2canvas($('#picContainer'), {
        onrendered: function(canvas) {
            $.post("http://us-faces.esy.es/uploads.php", {image: canvas.toDataURL('image/png')})
                .done(function( data ) {
                    navigator.notification.vibrate(300);
                    $('body').append('<p id="pic">'+data+'</p>');
                    $('.vkShare').html(VK.Share.button({
                        url: 'http://play.google.com',
                        title: 'Теперь я знаю всю правду!',
                        description: $('#relation').html(),
                        image: 'http://us-faces.esy.es/images/'+$('#pic').html()+'.png',
                        noparse: true
                    }, { type: 'custom', text: '<button type="button" class="btn btn-primary"><div class="vkLogo"></div><span class="shareText">&nbsp;Поделиться с друзьями</span></button>' }));
                    $('#newScan').show('slow');
                    $('.vkShare').show('slow');
                });
        }
    });
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

