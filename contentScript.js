const returnSelection = () => {
    return new Promise((resolve, reject) => {
        if (window.getSelection) {
            resolve(window.getSelection().toString())
        } else if (document.getSelection) {
            resolve(document.getSelection().toString())
        } else if (document.selection) {
            resolve(document.selection.createRange().text.toString())
        } else reject();
    })
}

/**
 * Create qrcode svg icon in specified node
 * @param {*} node element which should contain qr code icon
 * @param {*} w width of icon
 * @param {*} h height of icon
 */
const createIcon = (node, imgURl, w, h) => {
    var img = document.createElement("img");
    img.src = chrome.runtime.getURL(imgURl);
    img.style.height = `${w}`;
    img.style.width = `${h}`;
    node.appendChild(img);
}


async function getLoginState() {
    let response = null;
    const token = localStorage.getItem('prospect');
    console.log('Getting',token)
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
                            }
                        })
    }catch(e) {

    }

    response = await response.json()
    //console.log('response', response)

    return response;
}


const fetchUserLogin = () => {
    chrome.storage.local.get(["prospectFrameUserId"]).then((result) => {
        let clientId = result.prospectFrameUserId;
        var email = document.getElementById('email').value;
        // send the login request to the external website's API using XMLHttpRequest
        var xhr = new XMLHttpRequest();
        xhr.open('POST', BASE_URL + '/api/user/login');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                // parse the response data and store the user's login credentials in Chrome storage API
                var response = JSON.parse(xhr.responseText);
                chrome.storage.local.set({ prospectFrameUserId: response.client_id }).then(() => {
                });
                chrome.storage.local.set({ prospectFrameIsLogin: true }).then(() => {
                });
                chrome.storage.local.set({ prospectFrameRemainCount: response.count }).then(() => {
                });
                chrome.storage.local.set({ prospectFrameRegisterStatus: response.paid === true ? "PRO" : "FREE" }).then(() => {
                });
                chrome.runtime.sendMessage({action: "login", text: "", status: response.paid === true ? "PRO" : "FREE"});
                // display a success message to the user
                console.log('Login successful!');
            } else {
                // display an error message to the user
                console.log('Login failed. Please try again.');
            }
        };
        xhr.send(JSON.stringify({ email: email, clientId: clientId }));
    });
}

chrome.runtime.onMessage.addListener(async (request, sender, response) => {
    const {type} = request
    if (type === "LOAD") {
        if(window.location.href === BASE_URL + "/home") {
            if(document.querySelector("#prospect_frame_social_login").value) {
                fetchUserLogin();
            }
        }
        try {
            const selection = await returnSelection()
            console.log('selection1', window);
            response(selection)
        } catch (e) {
            console.log('e', e);
            response()
        }

        // const loginStatus = getLoginState()
        // loginStatus.then(({data}) =>{
        //     //document.getElementById("prospect_frame_script_tab").removeClass('hidden');
        //     chrome.runtime.sendMessage({action: "loginStatus", token: data});
        // })
        //chrome.storage.local.set({ test: localStorage.getItem("extension") }).then(() => {})
       // const {extension} = await chrome.storage.local.get(["extension"])
      
       let {extension} = await chrome.storage.local.get(["extension"])
       
       //chrome.storage.local.set({ test: localStorage.getItem("extension") })
       if(window.BASE_URL == window.location.origin){
         extension = atob(localStorage.getItem("extension"));
         await chrome.storage.local.set({ extension: extension})
       }

       if(extension){
           extension = JSON.parse(extension)
       }

       if(document.getElementById("pro-image-area"))
        document.getElementById("pro-image-area").innerHTML = "";

       if(extension?.plan == "PRO"){
           if(document.getElementById("pro-image-area"))
           document.getElementById("pro-image-area").innerHTML = uploadImageHtml;

       }

       chrome.runtime.sendMessage({
            action:'prospect',
            data:extension
        });
    }
})

chrome.runtime.onMessage.addListener(function (msg, sender) {
    if (msg == "toggle") {
        console.log("message received");
        toggle();
    } else if(typeof msg === 'string' && msg.indexOf('width') !== -1) {
        const frameWidth = parseFloat(msg.replace("width_", ""));
        if(!isNaN(frameWidth)) {
            if(document.querySelector("#prospect_plugin_frame") !== null) {
                document.querySelector("#prospect_plugin_frame").style.width = `${frameWidth}px`;
                document.querySelector("html").style.setProperty('width', `calc(100% - ${frameWidth}px)`);
            }
        }
    }
});

let isFrameDisabled = false;

document.addEventListener('mouseup', function (event) {
    if(isFrameDisabled) {
        return false;
    }
    let popupDiv = document.getElementById("extension-ai-popup");
    let showValidCheck = true;
    var selectedText = window.getSelection().toString();
    try {
        if(selectedText === undefined || selectedText === "" || selectedText === null) {
            showValidCheck = false;
        }
        if(selectedText.trim() === "" || selectedText.trim() === null) {
            showValidCheck =  false;
        }
    } catch (e) {
        console.log(e);
        showValidCheck = false;
    }
    if(!showValidCheck) {
        if(popupDiv) {
            popupDiv.style.display = "none";
        }
        return false;
    }

    if (!popupDiv) {
        popupDiv = document.createElement("div");
        popupDiv.setAttribute("id", "extension-ai-popup");
        const hoverContent =
            `
            <span><img src="${chrome.runtime.getURL('assets/icons/arrowBottom.png')}"/></span>
            <ul class="extension-ai-popup-menu">
                <li>
                <div class="extension-ai-popup-btn" id="extension-ai-popup-close"><img src="${chrome.runtime.getURL('assets/icons/close.png')}"/><span>Close</span></div>
                </li>
                <li>
                <div class="extension-ai-popup-btn" id="extension-ai-popup-disable">Disable Until Next Visit</div>
                </li>
             </ul>`;
        // const closeBtn = document.createElement("button");
        // const resetBtn = document.createElement("button");
        // resetBtn.setAttribute("id", "extension-ai-popup-reset")
        // createIcon(resetBtn, "assets/icons/reset.png", '100%', '100%');
        // closeBtn.setAttribute("id", "extension-ai-popup-close")
        // closeBtn.innerHTML = "×";
        // popupDiv.appendChild(closeBtn);
        // popupDiv.appendChild(resetBtn);
        // resetBtn.className = 'extension-ai-popup-btn'
        // closeBtn.className = 'extension-ai-popup-btn'
        const hoverButton = document.createElement('div');
        hoverButton.setAttribute('id', 'extension-ai-hover-btn');
        hoverButton.innerHTML = hoverContent;
        popupDiv.innerHTML = `<div class="extension-ai-popup-btn" id="extension-ai-popup-reset"><img src="${chrome.runtime.getURL('assets/icons/reset.png')}"/></div>`;
        popupDiv.appendChild(hoverButton);

        popupDiv.className = 'popup-tag';
        popupDiv.style.zIndex = '65534'
        createIcon(popupDiv, "assets/icons/hexagonal.png", '32px', '32px');
        document.body.appendChild(popupDiv);

        popupDiv.addEventListener('click', function (e) {
            if(e.target && (e.target.classList.contains("extension-ai-popup-btn") === true || e.target.closest(".extension-ai-popup-btn") !== null)) {
                console.log(e.target.getAttribute("id"))
                if(e.target && e.target.getAttribute("id") === "extension-ai-popup-disable") {
                    isFrameDisabled = true;
                } else if(e.target && (e.target.getAttribute("id") === "extension-ai-popup-reset" || e.target.closest("#extension-ai-popup-reset") !== null)) {
                    chrome.runtime.sendMessage({action: "reset", text: ""});
                }
            } else {
                toggle();
            }
            popupDiv.style.display = "none";
        });
    }
    chrome.runtime.sendMessage({text: selectedText});
    // let selectedText = $.trim(selectedText);
    if (selectedText != '') {
        popupDiv.style.display = "flex";
        popupDiv.style.marginTop = "30px";
        popupDiv.style.top = event.pageY + "px";
        popupDiv.style.left = event.pageX + "px";
        // popupDiv.text = selectedText;
    } else {
        popupDiv.style.display = "none";
    }
});
// const wrapperComponent = document.createElement("div");
// const resizeBar = document.createElement("div");
// wrapperComponent.appendChild(resizeBar);
// wrapperComponent.style.position = "relative";
// resizeBar.setAttribute("id", "prospect_frame_resize_bar");
// resizeBar.style.position = "absolute";
// resizeBar.style.width = "2px";
// resizeBar.style.height = "100%";
// resizeBar.style.background = "absolute";
// resizeBar.style.top = "0";
// resizeBar.style.left = "0";
// resizeBar.style.cursor = "ew-resize";
// resizeBar
//
// wrapperComponent.style.background = "#fff";
// wrapperComponent.style.height = "100%";
// wrapperComponent.style.width = "0px";
// wrapperComponent.style.position = "fixed";
// wrapperComponent.style.top = "0px";
// wrapperComponent.style.right = "0px";
// wrapperComponent.style.zIndex = "899999999";


var iframe = document.createElement('iframe');
iframe.setAttribute("id", "prospect_plugin_frame");
iframe.style.background = "green";
iframe.style.height = "100%";
iframe.style.width = "0";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "999999999";
iframe.frameBorder = "none";
iframe.src = chrome.runtime.getURL("popup.html")
iframe.setAttribute("sandbox", "allow-same-origin allow-scripts allow-popups allow-forms");

//wrapperComponent.appendChild(iframe)
document.body.appendChild(iframe);

function toggle() {
    console.log('toggle');
    if (iframe.style.width == "0px") {
        //wrapperComponent.style.width = "400px";
        iframe.style.width = "400px";
        document.querySelector("html").style.setProperty('width', `calc(100% - 400px)`);
        isFrameDisabled = false;
    } else {
        //wrapperComponent.style.width = "0px";
        iframe.style.width = "0px";
        document.querySelector("html").style.setProperty('width', `100%`);
    }
}

if(document.getElementById('prospect-login-form') !== null) {
    document.getElementById('prospect-login-form').addEventListener('submit', function(event) {
        event.preventDefault(); // prevent the form from submitting normally
        try {
            // get the user's login credentials from the form
            fetchUserLogin()
        } catch (e) {

        }
        document.getElementById('prospect-login-form').submit();
    });
}

if(document.getElementById('prospectpal_logout_btn') !== null) {
    document.getElementById('prospectpal_logout_btn').addEventListener("click", function (event) {
        chrome.runtime.sendMessage({action: "logout", text: ""});
    })
}





// data you want to sent
var un = null;
if(!localStorage.getItem('prospect')){
    un = new Date().getUTCMilliseconds()
    localStorage.setItem('prospect', un);
}else{
    un = localStorage.getItem('prospect');
}

// document.dispatchEvent(new CustomEvent('csEvent', {detail: un}));
// const loginStatus = getLoginState()
// loginStatus.then(({data}) =>{
//     chrome.runtime.sendMessage({action: "loginStatus", token: data});
// })

// Listen for messages

if(document.getElementById("sync-storage")){
    document.getElementById("sync-storage").addEventListener("click", () =>{
            let obj = {action: "prospect", data: JSON.parse(localStorage.getItem("extension"))};
            chrome.runtime.sendMessage(obj);
            // console.log("sync-storage",obj)
    })
}


