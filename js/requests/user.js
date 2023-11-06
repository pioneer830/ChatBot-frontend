var user = new function () {
    this.getUserInfo = getUserInfo;

    function getUserInfo() {
        chrome.storage.local.get(["prospectFrameUserId"]).then((result) => {
            const client_id = result.prospectFrameUserId;
            const API_URL = BASE_URL + '/api/v1/portal/get-user-about';
            try {
                fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        client_id: client_id,
                        type: TYPE,
                    })
                }).then((response) => response.json())
                    .then((data) => {
                        document.getElementById("user_name").value = data.user_name ?? '';
                        document.getElementById("job_title").value = data.job_title ?? '';
                        document.getElementById("industry").value = data.industry ?? '';
                        document.getElementById("job_description").value = data.job_description ?? '';
                        document.getElementById("industry_description").value = data.industry_description ?? '';
                    });
            } catch (e) {
                console.log(e);
            }
        });
    }
}

function updateTonesAndIntentions() {
    chrome.storage.local.get(["prospectFrameUserId"]).then((result) => {
        const client_id = result.prospectFrameUserId;
        const API_URL = BASE_URL + '/api/v1/portal/status/tone-intention';
        try {
            fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id: client_id,
                    type: TYPE,
                    tone: $("#render-tone-btns").find("button").length,
                    intention: $("#render-intention").find("button").length,
                })
            }).then((response) => response.json())
                .then((result) => {
                    if (result.tone) {
                        tones.getTones();
                    }
                    if (result.intention) {
                        intentions.getIntentions();
                    }
                });
        } catch (e) {
            console.log(e);
        }
    });
}

// const intervalId = setInterval(() => {
//     if (typeof isLogin !== 'undefined' && isLogin === true) {
//         updateTonesAndIntentions()
//     }
// }, 12000);


// setTimeout(function () {
//     user.getUserInfo();
// }, 400);
