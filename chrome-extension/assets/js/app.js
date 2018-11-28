var container = document.getElementById("container");
var button = document.getElementById("button");
var article = document.getElementById("articles");
var test = "<div id='hola' class='feed'><h1>HOLA</h1></div>";
var card = "<div class='col s12 m7'><h2 class='header'>Horizontal Card</h2><div class='card horizontal'><div class='card-stacked'><div class='card-content'><p>I am a very simple card. I am good at containing small bits of information.</p></div><div class='card-action'><a href=''>This is a link</a></div></div></div></div>"
var feeds = [];

// $(button).click(function(){
//     // $(article).remove(".feed");
//     $(aricle).replaceWith(card);
// });

$(button).click(function(){
    $.ajax({
        type: "GET",
        url: "http://localhost:3002/webhook/feed",
        data:{'project_id':'16'},
        error: function (response) {
                alert('Error: There was a problem processing your request, please refresh the browser and try again');
        },
        success: function (response) {
            var feedsResponse = response.feed.reverse();
            var responseLength = feedsResponse.feed.length;
            var feed = response.feed;
            for(var i = 0; i < responseLength; i ++)
            {
                $(article).replaceWith("<div class='col s12 m7'><div class='card horizontal z-depth-3'><div class='card-stacked'><div class='card-content'><p><h5>" + feed[i].title +"</h5></p></div><div class='card-action'><a href='" + feed[i].link + "' class='article-link'>Ver noticia completa</a></div></div></div></div>");
            }
        }
    });

});

$(document).ready(function(){

    $.ajax({
        type: "GET",
        url: "http://localhost:3002/webhook/feed?refresh_all=true",
        data:{'project_id':'16'},
    error: function (response) {
            alert('Error: There was a problem processing your request, please refresh the browser and try again');
    },
    success: function (response) {

        var feedsResponse = response.feed.reverse();
        var responseLength = feedsResponse.length;
        var feed = response.feed;
        for(var i = 0; i < responseLength; i ++)
        {
            $(article).append("<div class='col s12 m7'><div class='card horizontal z-depth-3'><div class='card-stacked'><div class='card-content'><p><h5>" + feed[i].title +"</h5></p></div><div class='card-action'><a href='" + feed[i].link + "' class='article-link'>Ver noticia completa</a></div></div></div></div>");
            //console.log(feed[i].title);
        }
    }
});
});
