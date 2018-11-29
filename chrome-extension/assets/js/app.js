var container = document.getElementById("container");
var button = document.getElementById("button");
var article = document.getElementById("articles");
var articleRefresh = document.getElementById("articles-refresh");
var card = document.getElementById("article-card");


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
            // var feedsResponse = response.feed.reverse();
            var responseLength = response.feed.length;
            var feed = response.feed;
            $(".articles .article-card").remove();
            for(var i = 0; i < responseLength; i ++)
            {
                $(article).append("<div class='col s12 m7 article-card'><div class='card horizontal z-depth-3'><div class='card-stacked'><div class='card-content'><p><h5>" + feed[i].title +"</h5></p></div><div class='card-action'><a href='" + feed[i].link + "' class='article-link'>Ver noticia completa</a></div></div></div></div>");
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
        // console.log(response);
        // var feedsResponse = response.feed.reverse();
        var responseLength = response.feed.length;
        var feed = response.feed;
        for(var i = 0; i < responseLength; i ++)
        {
            $(article).append("<div class='col s12 m7 article-card'><div class='card horizontal z-depth-3'><div class='card-stacked'><div class='card-content'><p><h5>" + feed[i].title +"</h5></p></div><div class='card-action'><a href='" + feed[i].link + "' class='article-link'>Ver noticia completa</a></div></div></div></div>");
        }
    }
});
});

