var tones = new function () {

    this.getTones = getTones;

    function getTones() {
        chrome.storage.local.get(["prospectFrameUserId"]).then((result) => {
            const client_id = result.prospectFrameUserId;
            if (typeof isLogin !== 'undefined' && isLogin === true) {
                userTones(client_id);
            } else {
                allTones();
            }
        });
    }

    const allTones = () => {
        const API_URL = BASE_URL + '/api/v1/portal/get-all-tone';
        try {
            fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => response.json())
                .then((data) => {
                    setAllTones(data.tones ?? []);
                });
        } catch (e) {
            console.log(e);
        }
    }

    const userTones = (client_id) => {
        const API_URL = BASE_URL + '/api/v1/portal/get-user-tone';
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
                    setUserTones(data);
                });
        } catch (e) {
            console.log(e);
        }
    }

    const setAllTones = (data) => {
        try {
            let btn_html = '';
            let option_html = '';
            let hide_btn_html = '';
            let hide_option_html = '';
            Object.values(data).forEach(function (tone, index) {
                btn_html += renderTonesButtons(tone, index);
                option_html += renderTonesOption(tone, index);
                hide_btn_html += renderHideToneButtons(tone, index);
                hide_option_html += renderHideTonesOption(tone, index);
            });

            setValues(btn_html, option_html, hide_btn_html, hide_option_html);

        } catch (e) {
            //
        }
    }

    /*All Tones functions*/
    const setUserTones = (userTones) => {
        try {
            let btn_html = '';
            let option_html = '';
            let hide_btn_html = '';
            let hide_option_html = '';
            Object.values(userTones).forEach(function (tone, index) {
                if (tone.tone != null) {
                    btn_html += renderTonesButtons(tone.tone, index);
                    option_html += renderTonesOption(tone.tone, index);
                    hide_btn_html += renderHideToneButtons(tone.tone, index);
                    hide_option_html += renderHideTonesOption(tone.tone, index);
                }
            });

            setValues(btn_html, option_html, hide_btn_html, hide_option_html);

        } catch (e) {

        }
    }

    const renderTonesButtons = (tone, index) => {
        let btnClass = '';
        if (index === 0) {
            btnClass = 'default selected';
        }
        return `<button class="ml-4 mb-10 cursor-pointer tag-btn tone-btn ${btnClass} rounded-md">${tone.name}</button>`;
    }

    const renderTonesOption = (tone, index) => {
        let optionClass = '';
        let selected = '';
        if (index === 0) {
            optionClass = 'default';
            selected = 'selected';
        }
        return `<option class="${optionClass}" value="${tone.name}" ${selected}>${tone.name}</option>`;
    }

    const renderHideToneButtons = (tone, index) => {
        let btnClass = '';
        if (index === 0) {
            btnClass = 'default selected';
        }
        return `<button class="ml-10 mb-10 cursor-pointer tag-btn scripttone-btn ${btnClass} rounded-md">
                    ${tone.name}
                </button>`;
    }

    const renderHideTonesOption = (tone, index) => {
        let optionClass = '';
        let selected = '';
        if (index === 0) {
            optionClass = 'default';
            selected = 'selected';
        }
        return `<option class="${optionClass}" value="${tone.name}" ${selected}>${tone.name}</option>`;
    }
    /*End All Tones functions*/

    function setValues(btn_html, option_html, hide_btn_html, hide_option_html) {
        $("#render-tone-btns").html(btn_html);
        $("#tones").html(option_html);
        $("#hide-tones").html(hide_btn_html);
        $("#scripttones").html(hide_option_html);
    }

}

/*calling on load*/
// setTimeout( function () {
//     const el = document.querySelector('#prospect_frame_script_tab');

//     if(plan == 'PRO'){
//         el.classList.remove("hidden");
//     }else{
//         el.classList.add("hidden");
//     }
//     //tones.getTones();
// }, 600);


//tones.getTones();



