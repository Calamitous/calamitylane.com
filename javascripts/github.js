/*jslint sloppy: true, white: true, browser: true, vars: true, regexp: true */
var $;
var github = (function() {
    function render(target, repos) {
        var i, fragment = '', url, name, description;

        for (i = 0; i < repos.length; i += 1) {
            url = repos[i].html_url;
            name = repos[i].name;
            description = repos[i].description;
            fragment += '<li>';
            fragment += '<a href="' + url + '">' + name + '</a>';
            fragment += '<p>' + description + '</p>';
            fragment += '</li>';
        }
        $(target)[0].innerHTML = fragment;
    }

    return {
        showError: function(target) {
            var t = $(target + ' li.loading');
            t.addClass('error').text('Error loading feed');
        },

        showRepos: function(options) {
            var i, url;
            url = 'https://api.github.com/users/' +
                    options.user +
                    '/repos?sort=pushed&per_page=' +
                    options.count + '&page=1&callback=repos';
            $.ajax({
                url: url,
                type: 'jsonp',
                error: function() { this.showError(options.target); },
                failure: function() { this.showError(options.target); },
                success: function(data) {
                    var repos = [];
                    if (!data || !data.data) {
                        this.showError(options.target);
                        return;
                    }

                    data = data.data;

                    for (i = 0; i < data.length; i += 1) {
                        if (options.skip_forks || data[i].fork) {
                            repos.push(data[i]);
                        }
                    }

                    render(options.target, repos);
                }
            });
        }
    };
})();
