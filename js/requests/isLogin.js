var isLogin;

function getLoginState() {
    const loginStatus = getLoginState()
        loginStatus.then(({data}) =>{
            console.log('content sss1',data);
        })
    chrome.storage.local.get(["prospectFrameIsLogin"]).then((result) => {
        console.log('result',result)
        isLogin = result.prospectFrameIsLogin;
    });
}

var plan;

function getPlanType() {
    const loginStatus = getLoginState()
        loginStatus.then(({data}) =>{
            console.log('content sss2',data);
        })
    chrome.storage.local.get(["prospectFrameRegisterStatus"]).then((result) => {
        plan = result.prospectFrameRegisterStatus;

        console.log("Plan")
        console.log(plan)
    });
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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    
    if(request.action === "loginStatus"){
        isLogin = request.token.is_login == 1 ? true : false;
        plan = request.token.is_paid == 1 ? 'PRO':'FREE';
    }
    console.log('request.action', request.action)
    console.log('isLogin', isLogin)
    console.log('plan', plan)
});
// window.onload = function() {
//     console.log('ddddd',localStorage.getItem('prospect'));
//   }


// setTimeout( function () {
//     getLoginState();
//     getPlanType();
// }, 500);

