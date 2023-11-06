const generateQuestionTemplate = (chat) => {
    let template = '';
    template = `<li class="clearfix">
     <div class="message-data align-right">
      <span class="message-data-time">
      <i>${chat.datetime}</i>
      </span>
      <span class="message-data-name">${chat.from}</span>
     </div>
     <div class="message other-message float-right">${chat.message}</div>
    </li>`;
    return template;
}

const generateAnswerTemplate = (chat) => {
    let template = '';
    template = `<li>
     <div class="message-data">
      <span class="message-data-name">${chat.from}</span>
      <span class="message-data-time">
      <i>${chat.datetime}</i>
      </span>
     </div>
     <div class="message my-message">${chat.message}</div>
    </li>`;
    return template;
}

// chat.getChatHistory(function(chats) {
//     let content = "";
//     chats.map((chat) => {
//         chat.time = moment(chat.datetime).calendar();
//         if (chat.from === 'Visitor') {
//             content += generateQuestionTemplate(chat);
//         } else {
//             content += generateAnswerTemplate(chat);
//         }
//     })

//     $('#chatHistory ul').html(content);
//     $('#chatHolder').animate({
//         scrollTop: $('#chatHistory ul').height()
//     }, 1000);
// });

chat.addListener('chatreceived', function (newMsg) {

    newMsg.chat.time = moment(newMsg.chat.datetime).calendar();
    var content = "";
    if (newMsg.chat.from === 'Visitor') {
        content += generateQuestionTemplate(newMsg.chat);
    } else {
        content += generateAnswerTemplate(newMsg.chat);
    }
    $('#liveChat ul').append(content);

    $('#chatHolder').animate({
        scrollTop: $('#liveChat ul').height() + $('#chatHistory ul').height()
    }, 1000);
})


$('#chatInput').keyup(function (e) {
    if (e.keyCode == 13) {
        chat.sendChat($('#chatInput').val());
        $('#chatInput').val('');
        $(".copy-btn").show();
        $(".check-btn").hide();
    }
});

$('#chatSubmit').click(function (e) {
    $(".copy-btn").show();
    $(".check-btn").hide();
    chat.sendChat($('#chatInput').val());
    $('#chatInput').val('');
})

$('#chatInputScript').keyup(function (e) {
    if (e.keyCode == 13) {
        chat.sendScript($('#chatInputScript').val());
        $('#chatInputScript').val('');
        $(".script-copy-btn").show();
        $(".script-check-btn").hide();
    }
});

$('#chatSubmitScript').click(function (e) {
    chat.sendScript($('#chatInputScript').val());
    $('#chatInputScript').val('');
    $(".script-copy-btn").show();
    $(".script-check-btn").hide();
})


/*enable 3 multi clicks on tone buttons*/

$(document).on("click", ".tone-btn", function () {
    let title = $(this).html();
    let is_allow_multiple_tone_select = localStorage.getItem('is_allow_multiple_tone_select');
    if (!$(this).hasClass("selected")) {
        let count = $("#tones :selected").length;
        if (count < 3) {
            if (is_allow_multiple_tone_select == 1) {
                $(this).addClass("selected");
                $("#tones option[value='" + title + "']").prop("selected", true);
            } else {
                $("#tones").val("");
                $(".tone-btn").removeClass("selected");
                $(this).addClass("selected");
                $("#tones option[value='" + title + "']").prop("selected", true);
            }
        }
    } else {
        $(this).removeClass("selected");
        $("#tones option[value='" + title + "']").prop("selected", false);
    }
});

$(document).on("click", ".scripttone-btn", function () {
    let title = $(this).text().trim();
    if (!$(this).hasClass("selected")) {
        let count = $("#scripttones :selected").length;
        if (count < 3) {
            if (isLogin === true &&  plan == 'PRO') {
                $(this).addClass("selected");
                $("#scripttones option[value='" + title + "']").prop("selected", true);
            } else {
                $("#scripttones").val("");
                $(".scripttone-btn").removeClass("selected");
                $(this).addClass("selected");
                $("#scripttones option[value='" + title + "']").prop("selected", true);
            }
        }
    } else {
        $(this).removeClass("selected");
        $("#scripttones option[value='" + title + "']").prop("selected", false);
    }
});


$(document).on("click", ".char-btn", function () {
    let title = $(this).html();
    $(".char-btn").removeClass("selected");
    if (!$(this).hasClass("selected")) {
        $(this).addClass("selected");
    }
    let val = $("#charlimit option").filter((i, e) => {
        return e.innerHTML.indexOf(title) > -1;
    }).val();
    $("#charlimit").val(val);
});

$(document).on("click", ".intention-btn", function () {
    let title = $(this).html();
    $(".intention-btn").removeClass("selected");
    if (!$(this).hasClass("selected")) {
        $(this).addClass("selected");
    }
    let val = $("#intentions option").filter((i, e) => {
        return e.innerHTML.indexOf(title) > -1;
    }).val();
    $("#intentions").val(val);
});

$(".message-btn").on("click", function () {
    let title = $(this).html();
    $(".message-btn").removeClass("selected");
    if (!$(this).hasClass("selected")) {
        $(this).addClass("selected");
    }
    let val = $("#messagetype option").filter((i, e) => {
        return e.innerHTML.indexOf(title) > -1;
    }).val();
    $("#messagetype").val(val);
});

$(".response-type-btn").on("click", function () {
    let title = $(this).html();
    $(".response-type-btn").removeClass("selected");
    if (!$(this).hasClass("selected")) {
        $(this).addClass("selected");
    }
    let val = $("#responsetype option").filter((i, e) => {
        return e.innerHTML.indexOf(title) > -1;
    }).val();
    $("#responsetype").val(val);
});

$(".scriptmessage-btn").on("click", function () {
    let title = $(this).html();
    $(".scriptmessage-btn").removeClass("selected");
    if (!$(this).hasClass("selected")) {
        $(this).addClass("selected");
    }
    let val = $("#scriptmessagetype option").filter((i, e) => {
        return e.innerHTML.indexOf(title) > -1;
    }).val();
    $("#scriptmessagetype").val(val);
});

$(".scriptchar-btn").on("click", function () {
    let title = $(this).html();
    $(".scriptchar-btn").removeClass("selected");
    if (!$(this).hasClass("selected")) {
        $(this).addClass("selected");
    }
    let val = $("#scriptcharlimit option").filter((i, e) => {
        return e.innerHTML.indexOf(title) > -1;
    }).val();
    $("#scriptcharlimit").val(val);
});

$(".scriptpurpose-btn").on("click", function () {
    let title = $(this).html();
    if(title === "Other") {
        $(".purpose-other-box").removeClass("hidden")
    } else {
        if (!$(".purpose-other-box").hasClass("hidden")) {
            $(".purpose-other-box").addClass("hidden")
        }
        $("#scriptpurpose-other-title").val("");
    }
    $(".scriptpurpose-btn").removeClass("selected");
    if (!$(this).hasClass("selected")) {
        $(this).addClass("selected");
    }
    let val = $("#scriptpurpose option").filter((i, e) => {
        return e.innerHTML.indexOf(title) > -1;
    }).val();
    $("#scriptpurpose").val(title);
});


$(".scriptintention-btn").on("click", function () {
    let title = $(this).html();
    $(".scriptintention-btn").removeClass("selected");
    if (!$(this).hasClass("selected")) {
        $(this).addClass("selected");
    }
    let val = $("#scriptintentions option").filter((i, e) => {
        return e.innerHTML.indexOf(title) > -1;
    }).val();
    $("#scriptintentions").val(val);
});

$(".scriptmessage-btn").on("click", function () {
    let title = $(this).html();
    $(".scriptmessage-btn").removeClass("selected");
    if (!$(this).hasClass("selected")) {
        $(this).addClass("selected");
    }
    let val = $("#scriptmessagetype option").filter((i, e) => {
        return e.innerHTML.indexOf(title) > -1;
    }).val();
    $("#scriptmessagetype").val(val);
});

$(".scripttype-btn").on("click", function () {
    let title = $(this).html();
    $(".scripttype-btn").removeClass("selected");
    if (!$(this).hasClass("selected")) {
        $(this).addClass("selected");
    }
    let val = $("#scripttype option").filter((i, e) => {
        return e.innerHTML.indexOf(title) > -1;
    }).val();
    $("#scripttype").val(val);
    if (title == "Other") {
        $("#scripttypeotherinfo").show();
    } else {
        $("#scripttypeotherinfo").hide();
    }
});

$(".tablinks").on("click", function () {
    console.log('click');
    var cityName = $(this).data("name");
    console.log('cityName', cityName);
    $(".tabcontent").hide();
    $(".tablinks").removeClass("active");
    $(this).addClass("active");
    $(`#${cityName}`).show();
})

$('#chatUpdateScript').keyup(function (e) {
    if (e.keyCode == 13) {
        chat.sendUpdateScript($('#chatUpdateScript').val());
        $('#chatUpdateScript').val('');
    }
});

$('#chatUpdatecript').click(function (e) {
    chat.sendUpdateScript($('#chatUpdateScript').val());
    $('#chatUpdateScript').val('');
})

document.getElementById("closeButton").addEventListener("click", function () {
    // Get the current tab's ID
    chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
        // Close the tab
        chrome.tabs.sendMessage(tab[0].id, "toggle");
    });
});

$(".reset").on("click", function () {
    $(".tone-btn").removeClass("selected");
    $(".tone-btn.default").addClass("selected");
    $("#tones option").prop("selected", false);
    $("#tones option.default").prop("selected", true);

    $(".char-btn").removeClass("selected");
    $(".char-btn.default").addClass("selected");
    $("#charlimit option").prop("selected", false);
    $("#charlimit option.default").prop("selected", true);

    $(".intention-btn").removeClass("selected");
    $(".intention-btn.default").addClass("selected");
    $("#intentions option").prop("selected", false);
    $("#intentions option.default").prop("selected", true);

    $(".message-btn").removeClass("selected");
    $(".message-btn.default").addClass("selected");
    $("#messagetype option").prop("selected", false);
    $("#messagetype option.default").prop("selected", true);

    $(".response-type-btn").removeClass("selected");
    $(".response-type-btn.default").addClass("selected");
    $("#response-type-btn option").prop("selected", false);
    $("#response-type-btn option.default").prop("selected", true);

    $("#chatInput").val('');
    $("#highlight").val('');
    $("#scripttypeanswer").val('');
    $("#output").val('');
    $(".copy-btn").show();
    $(".check-btn").hide();

    $(".script-copy-btn").show();
    $(".script-check-btn").hide();

    $(".scriptmessage-btn").removeClass("selected");
    $(".scriptmessage-btn.default").addClass("selected");
    $("#scriptmessagetype option").prop("selected", false);
    $("#scriptmessagetype option.default").prop("selected", true);

    $(".scriptchar-btn").removeClass("selected");
    $(".scriptchar-btn.default").addClass("selected");
    $("#scriptcharlimit option").prop("selected", false);
    $("#scriptcharlimit option.default").prop("selected", true);

    $(".scripttone-btn").removeClass("selected");
    $(".scripttone-btn.default").addClass("selected");
    $("#scripttones option").prop("selected", false);
    $("#scripttones option.default").prop("selected", true);

    $(".scriptpurpose-btn").removeClass("selected");
    $(".scriptpurpose-btn.default").addClass("selected");
    $("#scriptpurpose option").prop("selected", false);
    $("#scriptpurpose option.default").prop("selected", true);


    $("#scriptpurpose-other-title").val("");
    if (!$(".purpose-other-box").hasClass("hidden")) {
        $(".purpose-other-box").addClass("hidden")
    }
    $(".scriptpurpose-btn").removeClass("selected");
    $(".scriptpurpose-btn.default").addClass("selected");
    $("#scriptpurpose option").prop("selected", false);
    $("#scriptpurpose option.default").prop("selected", true);

    $("#scripttypeanswer").val("");
    $("#chatUpdateScript").val("");
    $("#chatInputScript").val("");
})

$('.copy-btn').on('click', function () {
    $('#output').prop("disabled", false);
    $("#output").select();
    document.execCommand('copy');
    $("#output").blur();
    $('#output').prop("disabled", true);
    $(".copy-btn").hide();
    $(".check-btn").show();
});

$('.script-copy-btn').on('click', function () {
    $('#scripttypeanswer').prop("disabled", false);
    $("#scripttypeanswer").select();
    document.execCommand('copy');
    $("#scripttypeanswer").blur();
    $('#scripttypeanswer').prop("disabled", true);
    $(".script-copy-btn").hide();
    $(".script-check-btn").show();
});


const textarea = document.getElementById('chatInput');
const button = document.getElementById('chatSubmit');
const scriptButton = document.getElementById('chatSubmitScript');
const scriptTextArea = document.getElementById('chatInputScript');
const svg = document.getElementById('svg');
const scriptSvg = document.getElementById('scriptSvg');


textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    button.removeAttribute('disabled');
    button.classList.add('bg-blue-500');
    svg.setAttribute('stroke', 'white');

});


scriptTextArea.addEventListener('input', () => {
    scriptTextArea.style.height = 'auto';
    /*
        scriptTextArea.style.height = `${textarea.scrollHeight}px`;
    */
    scriptButton.removeAttribute('disabled');
    scriptButton.classList.add('bg-blue-500');
    scriptSvg.setAttribute('stroke', 'white');

});


let isHandlerDragging = false;
const handler = document.querySelector("#prospect_frame_resize_bar");
document.addEventListener('mousedown', function(e) {
    // If mousedown event is fired from .handler, toggle flag to true
    if (e.target === handler) {
        isHandlerDragging = true;
    }
});

let currentWidth = 400;

document.addEventListener('mousemove', function(e) {
    // Don't do anything if dragging flag is false
    if (!isHandlerDragging) {
        return false;
    }
    const changedWidth = currentWidth - e.offsetX;
    console.log(changedWidth, e.offsetX);
    document.body.style.width = `${changedWidth}px`;
    chrome.tabs.getCurrent(function (tab) {
        // Close the tab
        chrome.tabs.sendMessage(tab.id, `width_${changedWidth}`);
    });
    // Set boxA width properly
    // [...more logic here...]
});

document.addEventListener('mouseup', function(e) {
    // Turn off dragging flag when user mouse is up
    isHandlerDragging = false;
});


