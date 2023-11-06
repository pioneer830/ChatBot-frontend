function setValues(btn_html, option_html, hide_btn_html, hide_option_html) {
    $("#render-tone-btns").html(btn_html);
    $("#tones").html(option_html);
    $("#hide-tones").html(hide_btn_html);
    $("#scripttones").html(hide_option_html);
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

const setAllTones = (data) => {
    console.log('tones',data);
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
        console.log('Exp',e);
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

        setIntentionValues(btn_html, option_html);

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

        setIntentionValues(btn_html, option_html);

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

function setIntentionValues(btn_html, option_html) {
    $("#render-intention").html(btn_html);
    $("#intentions").html(option_html);
}



chrome.runtime.onMessage.addListener(async function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    
    if(msg.action == 'prospect'){
        console.log('setAllTones',msg);
        let user_tones ={}
        let user_intention ={}
        
        if(msg?.data?.user_tone){
            localStorage.setItem('user_tone',JSON.stringify(msg.data.user_tone))
        }
        
        if(msg?.data?.user_intention){
            localStorage.setItem('user_intention',JSON.stringify(msg.data.user_intention))
        }

        user_intention = JSON.parse(localStorage.getItem('user_intention'))
        user_tones = JSON.parse(localStorage.getItem('user_tone'))

        if(msg?.data?.is_allow_user_info == 1){
            localStorage.setItem('is_allow_user_info',msg.data.is_allow_user_info);
        }else{
            localStorage.setItem('is_allow_user_info',0);
        }

        if(msg?.data?.is_allow_multiple_tone_select == 1){
            localStorage.setItem('is_allow_multiple_tone_select',msg.data.is_allow_multiple_tone_select);
        }else{
            localStorage.setItem('is_allow_multiple_tone_select',0);
        }

        if(msg?.data?.plan){
            localStorage.setItem('plan',msg.data.plan);
        }else{
            localStorage.setItem('plan','GUEST');
        }

        if(msg?.data?.isLogin == 1){
            localStorage.setItem('isLogin',msg.data.isLogin);
        }else{
            localStorage.setItem('isLogin',0);
        }

        let isLogin = localStorage.getItem('isLogin');
        let plan = localStorage.getItem('plan');

        const el = document.querySelector('#prospect_frame_script_tab');
        el.style.display = 'none';
        localStorage.removeItem('auth')
        if(localStorage.getItem('is_allow_multiple_tone_select') == 1){
            el.style.display = 'block';
            let auth = msg?.data?.auth;
            localStorage.setItem('auth', JSON.stringify(auth));
            console.log('test auth',auth)
            if(auth){
                document.getElementById("user_name").value = auth.user_name ?? '';
                document.getElementById("job_title").value = auth.job_title ?? '';
                document.getElementById("industry").value = auth.industry ?? '';
                document.getElementById("job_description").value = auth.job_description ?? '';
                document.getElementById("industry_description").value = auth.industry_description ?? '';
            }
        }

        if(user_tones){
            setAllTones(user_tones);
        }
        
        if(user_intention){
            setAllIntentions(user_intention);
        }


        document.getElementById("pro-image-area").innerHTML = "";
        if(localStorage.getItem('plan') == "PRO"){
            document.getElementById("pro-image-area").innerHTML = uploadImageHtml;
            if(document.getElementById('file-input')) {
                document.getElementById('file-input')
                    .addEventListener('change', handleFileInputChange);

            }

            if (document.getElementById('clr-btn-self')) {
                document.getElementById('clr-btn-self')
                    .addEventListener('click', parsedTextClear);

            }

        }
    }
    else if(msg.action == "imageupload"){
        await chrome.storage.local.set({parsed_text:""})
        console.log('9999',msg?.text,localStorage.getItem('plan'))
        if(localStorage.getItem('plan') == "PRO") {
            if (msg?.text) {
                await chrome.storage.local.set({parsed_text: msg?.text})
            }

            if (document.getElementById('clr-btn-self')) {
                document.getElementById('clr-btn-self')
                    .addEventListener('click', parsedTextClear);

            }
        }
    }

    
});
