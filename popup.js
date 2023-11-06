document.addEventListener("DOMContentLoaded", async () => {
  const getActiveTab = async () => {
    const tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true,
    });
    return tabs[0];
  };

  const getData = async (selection) => {
    console.log("selection", selection);
    if (typeof selection == "undefined" || selection == "") {
      document.getElementById("highlight").style.opacity = 0.5;
      document.getElementById("highlight").value =
        "You have to first select some text";
    } else {
      document.getElementById("highlight").style.opacity = 1;
      document.getElementById("highlight").value = selection;
    }
  };

  const getSelectedText = async () => {
    const activeTab = await getActiveTab();
    chrome.tabs.sendMessage(activeTab.id, { type: "LOAD" }, getData);
  };

  getSelectedText();
});

function resetChat() {
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

  $("#chatInput").val("");
  $("#highlight").val("");
  $("#scripttypeanswer").val("");
  $("#output").val("");
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
    $(".purpose-other-box").addClass("hidden");
  }
  $(".scriptpurpose-btn").removeClass("selected");
  $(".scriptpurpose-btn.default").addClass("selected");
  $("#scriptpurpose option").prop("selected", false);
  $("#scriptpurpose option.default").prop("selected", true);

  $("#scripttypeanswer").val("");
  $("#chatUpdateScript").val("");
  $("#chatInputScript").val("");
}

async function getLoginState2() {
  let response = null;
  const token = localStorage.getItem("prospect");
  console.log("Getting", token);
  const API_URL = `${BASE_URL}/api/user/login/status/${token}`;
  // chrome.storage.local.get(["prospectFrameIsLogin"]).then((result) => {
  //     console.log('result',result)
  //     isLogin = result.prospectFrameIsLogin;
  //     //isLogin = true;
  // });

  // alert('isLogin');

  try {
    response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {}

  response = await response.json();
  //console.log('response', response)

  return response;
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("message111", message.action, sender);
  console.log("message111", message.action, message.data.plan);
  if (message.text !== "" && message.text !== undefined) {
    document.getElementById("highlight").style.opacity = 1;
    document.getElementById("highlight").value = message.text ?? "";

    button.removeAttribute("disabled");
    button.classList.add("bg-blue-500");
    svg.setAttribute("stroke", "white");
  } else if (message.action && message.action === "reset") {
    resetChat();
  } else if (message.action && message.action === "login") {
    $(".header-link").addClass("hidden");
    if (message.status === "GUEST") {
      $("#prospect_frame_register_link").removeClass("hidden");
    } else {
      $("#prospect_frame_account_link").removeClass("hidden");
      $("#prospect_frame_subscribe_link").removeClass("hidden");

      if (message.status === "PRO") {
        // $("#prospect_frame_script_tab").removeClass('hidden');
        // Show My account button in case PRO user
        $("#prospect_frame_myaccount_link").removeClass("hidden");
      }
    }
  } else if (message.action && message.action === "prospect") {
    console.log("message111", message.action);
    $(".header-link").addClass("hidden");
    if (message.data.plan === "GUEST") {
      $("#prospect_frame_register_link").removeClass("hidden");
    } else {
      console.log("message111", message.action);

      $("#prospect_frame_account_link").removeClass("hidden");

      if (message.data.plan === "PRO") {
        console.log("message111", message.action);

        // $("#prospect_frame_script_tab").removeClass('hidden');
        // Show My account button in case PRO user
        $("#prospect_frame_myaccount_link").removeClass("hidden");
        $("#prospect_frame_subscribe_link").addClass("hidden");
      } else {
        $("#prospect_frame_subscribe_link").removeClass("hidden");
      }
    }
  } else if (message.action && message.action === "logout") {
    const API_URL = `${BASE_URL}/api/user/register/guest`;
    try {
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          $("#prospect_frame_subscribe_link").addClass("hidden");
          $("#prospect_frame_register_link").attr(
            "href",
            `${BASE_URL}/register?client_id=${data.client_id}`
          );
          chrome.storage.local
            .set({ prospectFrameUserId: data.client_id })
            .then(() => {});
          chrome.storage.local
            .set({ prospectFrameRemainCount: data.count })
            .then(() => {});
          chrome.storage.local
            .set({ prospectFrameRegisterStatus: false })
            .then(() => {});
          chrome.storage.local
            .set({ prospectFrameIsLogin: false })
            .then(() => {});
          $("#prospect_frame_script_tab").addClass("hidden");
          chrome.tabs.query(
            { currentWindow: true, active: true },
            function (tab) {
              // Close the tab
              chrome.tabs.sendMessage(tab[0].id, `clientId_${data.client_id}`);
            }
          );
        });
    } catch (e) {
      console.log(e);
    }
  } else if (message.action && message.action == "loginStatus") {
    localStorage.setItem("prospect", message.token);
    const loginStatus = getLoginState2();
    loginStatus.then(({ data }) => {
      console.log("data2222222", data);
    });
  }
  console.log("msg2222", message);
});
