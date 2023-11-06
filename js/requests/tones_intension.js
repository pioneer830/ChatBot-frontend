var tones = new function () {

    this.getTones = getTones;
    

    function getTones() {
        chrome.storage.local.get(["prospectFrameUserId"]).then((result) => {
            const client_id = result.prospectFrameUserId;
            let isloggedIn = localStorage.getItem('isLogin')
            if (isloggedIn == 1) {
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

    this.setAllTones = setAllTones;

}

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

    this.setAllIntentions = setAllIntentions;
}


const apiCall = () => {
    const API_URL = BASE_URL + '/api/user/guest/info';
        try {
            fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }

            }).then((response) => response.json())
                .then(({data}) => {

                    if(localStorage.getItem("isLogin") == 1) {
                        console.log('isLogin',true)
                        userTonesIntentionsSet()
                        setUserInforFromStorage()
                    }else {
                        console.log('tones intention',data);
                        if (data?.user_tone) {
                            tones.setAllTones(data.user_tone);
                        }
                        if (data?.user_intention) {
                            intentions.setAllIntentions(data.user_intention);
                        }
                    }
                    
                });
        } catch (e) {
            console.log(e);
        }
}




function setUserInforFromStorage() {
    let isLogin = localStorage.getItem('isLogin');
    let plan = localStorage.getItem('plan');

    const el = document.querySelector('#prospect_frame_script_tab');
    el.style.display = 'none';
    if(localStorage.getItem('is_allow_multiple_tone_select') == 1){
        el.style.display = 'block';
        let auth = {};
        if(localStorage.getItem('auth')){
            auth = JSON.parse(localStorage.getItem('auth'));
        }
        console.log('test auth', auth)
        if (auth) {
            document.getElementById("user_name").value = auth.user_name ?? '';
            document.getElementById("job_title").value = auth.job_title ?? '';
            document.getElementById("industry").value = auth.industry ?? '';
            document.getElementById("job_description").value = auth.job_description ?? '';
            document.getElementById("industry_description").value = auth.industry_description ?? '';
        }
    }
}

const userTonesIntentionsSet = () =>{
    let user_tone = localStorage.getItem("user_tone");
    let user_intention = localStorage.getItem("user_intention");

    if(user_tone){
        user_tone = JSON.parse(user_tone);
        tones.setAllTones(user_tone);
    }

    if(user_intention){
        user_intention = JSON.parse(user_intention);
        intentions.setAllIntentions(user_intention);
    }
}

const initTonesExtension = async ()=>{
    if(localStorage.getItem("isLogin") == 1){
        userTonesIntentionsSet()
        setUserInforFromStorage()
        //console.log("PPPP",localStorage.getItem("user_tone"),localStorage.getItem("user_intention"))
    }else{
        await apiCall();
    }
}

initTonesExtension()






