var VKOauth = {
    wwwref: false,
    plugin_perms: "wall,photos",
    
    auth: function (force) {
        if (!window.localStorage.getItem("plugin_vk_token") || force || window.localStorage.getItem("plugin_vk_perms")!=plugin_vk.plugin_perms) {
            var authURL="https://oauth.vk.com/authorize?client_id=4776547&scope="+this.plugin_perms+"&redirect_uri=http://oauth.vk.com/blank.html&display=touch&response_type=token";
            this.wwwref = window.open(encodeURI(authURL), '_blank', 'location=no');
            this.wwwref.addEventListener('loadstop', this.auth_event_url);
        }
    },
    auth_event_url: function (event) {
        var tmp=(event.url).split("#");
        if (tmp[0]=='https://oauth.vk.com/blank.html' || tmp[0]=='http://oauth.vk.com/blank.html') {
            VKOauth.wwwref.close();
            var tmp=url_parser.get_args(tmp[1]);
            window.localStorage.setItem("plugin_vk_token", tmp['access_token']);
            window.localStorage.setItem("plugin_vk_user_id", tmp['user_id']);
            window.localStorage.setItem("plugin_fb_exp", tmp['expires_in']);
            window.localStorage.setItem("plugin_vk_perms", VKOauth.plugin_perms);
        }
    }
};