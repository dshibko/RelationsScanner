var plugin_vk = {
    wwwref: false,
    plugin_perms: "wall,photos,friends",

    auth: function (force) {
        if (!window.localStorage.getItem("token") ||
            force ||
            window.localStorage.getItem("plugin_vk_perms") != plugin_vk.plugin_perms ||
            window.localStorage.getItem("expires") <= Math.round($.now() / 1000)) {
            var authURL="https://oauth.vk.com/authorize?client_id=4776547&scope="+this.plugin_perms+"&redirect_uri=http://oauth.vk.com/blank.html&display=touch&response_type=token";
            this.wwwref = window.open(encodeURI(authURL), '_blank', 'location=no');
            this.wwwref.addEventListener('loadstop', this.auth_event_url);
        } else {
            wallPost();
        }
    },
    auth_event_url: function (event) {
        var tmp=(event.url).split("#");
        if (tmp[0]=='https://oauth.vk.com/blank.html' || tmp[0]=='http://oauth.vk.com/blank.html') {
            plugin_vk.wwwref.close();
            var tmp = url_parser.get_args(tmp[1]);

            window.localStorage.setItem("token", tmp['access_token']);
            window.localStorage.setItem("user_id", tmp['user_id']);
            window.localStorage.setItem("expires", parseInt(Math.round($.now() / 1000) + tmp['expires_in']));
            window.localStorage.setItem("plugin_vk_perms", plugin_vk.plugin_perms);
            wallPost();
        }
    },
};

function wallPost() {
    var getImageServer = window.open(encodeURI('https://api.vk.com/method/photos.getWallUploadServer?'+
                                                 'group_id='+window.localStorage.getItem('user_id')+
                                                 '&access_token='+window.localStorage.getItem('token')+
                                                 '&v=5.28'), '_blank', 'hidden=yes');
    getImageServer.addEventListener('loadstop', function(event) {
        getImageServer.executeScript({code: "document.body.innerHTML"}, function(value) {
            var response = $.parseJSON(value[0].replace(/<.*?>/g, ''));
            getImageServer.close();

            var options = new FileUploadOptions();
            options.fileKey = "file1";
            options.mimeType = "image/jpeg";

            var ft = new FileTransfer();
            ft.upload(fileURL, response.response.upload_url.replace(/&amp;/g, '&'),
                function(result) {
                    var response = $.parseJSON(result.response);
                    var savePhoto = window.open(encodeURI('https://api.vk.com/method/photos.saveWallPhoto?'+
                                                            'owner_id='+window.localStorage.getItem('user_id')+
                                                            '&group_id='+window.localStorage.getItem('user_id')+
                                                            '&photo='+response.photo+
                                                            '&server='+response.server+
                                                            '&hash='+response.hash+
                                                            '&access_token='+window.localStorage.getItem('token')), '_blank', 'hidden=yes');
                    savePhoto.addEventListener('loadstop', function(event) {
                        savePhoto.executeScript({code: "document.body.innerHTML"}, function(value) {
                            savePhoto.close();
                            var response = $.parseJSON(value[0].replace(/<.*?>/g, ''));
                            var wallPost = window.open(encodeURI('https://api.vk.com/method/wall.post?'+
                                                                    'owner_id='+window.localStorage.getItem('user_id')+
                                                                    '&from_group=0'+
                                                                    '&message=Теперь я знаю правду!'+
                                                                    '&attachments='+response.response[0].id+
                                                                    '&signed=0'+
                                                                    '&access_token='+window.localStorage.getItem('token')), '_blank', 'hidden=yes');
                            wallPost.addEventListener('loadstop', function(event) {
                                wallPost.close();
                                navigator.notification.alert(
                                    'Результат размещен на вашей стене.',
                                    hideSharing,
                                    '',
                                    'ОК'
                                );
                            });
                        });
                    });
                }, function(error) {
                    navigator.notification.alert(
                        'Произошла ошибка :(',
                        null,
                        '',
                        'ОК'
                    );
                }, options);
        });
    });
}

var url_parser = {
    get_args: function (s) {
        var tmp = new Array();
        s = (s.toString()).split('&');
        for (var i in s) {
            i = s[i].split("=");
            tmp[(i[0])] = i[1];
        }
        return tmp;
    },
    get_args_cookie: function (s) {
        var tmp = new Array();
        s = (s.toString()).split('; ');
        for (var i in s) {
            i = s[i].split("=");
            tmp[(i[0])] = i[1];
        }
        return tmp;
    }
};