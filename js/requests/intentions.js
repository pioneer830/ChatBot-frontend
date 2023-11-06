var intentions = new function () {

    this.getIntentions = getIntentions;

   function getIntentions() {
        chrome.storage.local.get(["prospectFrameUserId"]).then((result) => {
            const client_id = result.prospectFrameUserId;
            if (typeof isLogin !== 'undefined' && isLogin === true) {
                userIntentions(client_id);
            } else {
                allIntentions();
            }
        });
    }

    const userIntentions = (client_id) => {
        const API_URL = BASE_URL + '/api/v1/portal/get-user-intention';
        try {
            fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client_id: client_id,
                    "type": TYPE,
                })
            }).then((response) => response.json())
                .then((data) => {
                    setUserIntentions(data);
                });
        } catch (e) {
            console.log(e);
        }
    }

    const allIntentions = () => {
        const API_URL = BASE_URL + '/api/v1/portal/get-all-intention';
        try {
            fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((response) => response.json())
                .then((data) => {
                    setAllIntentions(data.intentions ?? []);
                });
        } catch (e) {
            console.log(e);
        }
    }

    /*Intention functions*/
    const setAllIntentions = (intentions) => {
        try {
            let btn_html = '';
            let option_html = '';
            Object.values(intentions).forEach(function (intention, index) {
                btn_html += renderIntentionButtons(intention, index);
                option_html += renderIntentionOption(intention, index);
            });

            setValues(btn_html, option_html);

        } catch (e) {
            //
        }
    }

    const setUserIntentions = (intentions) => {
        try {
            let btn_html = '';
            let option_html = '';

            Object.values(intentions).forEach(function (intention, index) {
                if (intention.intention != null) {
                    btn_html += renderIntentionButtons(intention.intention, index);
                    option_html += renderIntentionOption(intention.intention, index);
                }
            });

            setValues(btn_html, option_html);

        } catch (e) {
            //
        }
    }

    const renderIntentionButtons = (intention, index) => {
        let btnClass = '';
        if (index === 0) {
            btnClass = 'default selected';
        }
        return `<button class="ml-4 mb-10 cursor-pointer tag-btn intention-btn ${btnClass} rounded-md">${intention.name}</button>`;
    }

    const renderIntentionOption = (intention, index) => {
        let optionClass = '';
        let selected = '';
        if (index === 0) {
            optionClass = 'default';
            selected = 'selected';
        }
        return `<option class="${optionClass}" value="${intention.name}" ${selected}>${intention.name}</option>`;
    }
    /*End Intention functions*/

    function setValues(btn_html, option_html) {
        $("#render-intention").html(btn_html);
        $("#intentions").html(option_html);
    }

}

/*calling on load*/
// setTimeout( function () {
//     intentions.getIntentions();
// }, 700);