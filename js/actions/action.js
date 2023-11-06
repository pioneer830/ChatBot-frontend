$(document).ready( function () {
    $(".go-register").click( function () {
        window.open(BASE_URL + '/register', '_blank');
    });

    $(".go-upgrade").click( function () {
        window.open(BASE_URL + '/plans', '_blank');
    });

    $(".go-home").click( function () {
        window.open(BASE_URL + '/home', '_blank');
    });
})