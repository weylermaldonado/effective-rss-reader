var container = document.getElementById("container");
var button = document.getElementById("button");
var article = document.getElementById("articles");
var articleRefresh = document.getElementById("articles-refresh");
var card = document.getElementById("article-card");
var loading = document.getElementById("loading");


$(button).click(function(){
    $(loading).css({"display": 'block'});
    $(loading).append("<strong>Cargando</strong>");
    $.ajax({
        type: "GET",
        url: "http://localhost:3002/webhook/feed",
        data:{'project_id':'16'},
        error: function (response) {
            alert('Error: There was a problem processing your request, please refresh the browser and try again');
        },
        success: function (response) {
            var responseLength = response.feed.length;
            var feed = response.feed;
            $(".loading strong").remove();
            $(".articles .article-card").remove();
            $(loading).css({"display": 'none'});
            for(var i = 0; i < responseLength; i ++)
            {
                $(article).append("<div class='col s12 m7 article-card'><div class='card horizontal z-depth-3'><div class='card-stacked'><div class='card-content'><p><h5>" + feed[i].title +"</h5></p></div><div class='card-action'><a href='" + feed[i].link + "' class='article-link' target='_blank'>Ver noticia completa</a></div></div></div></div>");
            }
        }
    });

});

$(document).ready(function(){
    $(loading).css({"display": 'none'});
    $.ajax({
        type: "GET",
        url: "http://localhost:3002/webhook/feed?refresh_all=false",
        data:{'project_id':'16'},
    error: function (response) {
            alert('Error: There was a problem processing your request, please refresh the browser and try again');
    },
    success: function (response) {
        var responseLength = response.feed.length;
        var feed = response.feed;
        for(var i = 0; i < responseLength; i ++)
        {
            $(article).append("<div class='col s12 m7 article-card'><div class='card horizontal z-depth-3'><div class='card-stacked'><div class='card-content'><p><h5>" + feed[i].title +"</h5></p></div><div class='card-action'><a href='" + feed[i].link + "' class='article-link' target='_blank'>Ver noticia completa</a></div></div></div></div>");
        }
    }
});
});

