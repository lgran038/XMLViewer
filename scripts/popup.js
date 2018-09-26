document.addEventListener('DOMContentLoaded', function() {
    var themes = document.getElementsByClassName('theme');

    // onClick's logic below:
    for (theme of themes){
        theme.addEventListener('click', function(e) {
            console.log(e);
        });
    }
});

function onThemeClick(theme){
    console.log("Clicked: ", theme);
}