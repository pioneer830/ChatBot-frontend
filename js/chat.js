var chat = new function () {
    var _events = {};
    this.getChatHistory = getChatHistory;
    this.searchOpenAi = searchOpenAi;

    function getChatHistory(callback) {
        var d = new Date();
        d.setTime(d.getTime() - 200000)
        var chats = [];
        if (typeof (callback) == "function") {
            callback(chats);
        }
    }

    this.sendChat = sendChat;
    this.sendScript = sendScript;
    this.sendUpdateScript = sendUpdateScript;

    const showPopup = async (answer) => {
        console.log('answer', answer);
        if (answer) {
            // chat.dispatchChatEvent(answer, "ChatGPT");
            // We can call dispatchChatEvent member function of chat for answer message
            document.getElementById('output').style.opacity = 1
            document.getElementById('output').value = JSON.parse(answer).choices[0].message.content;

            document.getElementById('scripttypeanswer').value = JSON.parse(answer).choices[0].message.content;

        }
    }

    const showScriptPopup = async (answer) => {
        console.log('answer', answer);
        if (answer) {
            document.getElementById('scripttypeanswer').style.opacity = 1
            document.getElementById('scripttypeanswer').value = JSON.parse(answer).choices[0].message.content;

            $(".script-update-area").show();
        }
    }

    const showScriptUpdatePopup = async (answer) => {
        console.log('answer', answer);
        if (answer) {
            // chat.dispatchChatEvent(answer, "ChatGPT");
            // We can call dispatchChatEvent member function of chat for answer message
            document.getElementById('scripttypeanswer').style.opacity = 1
            document.getElementById('scripttypeanswer').value = JSON.parse(answer).choices[0].message.content;
        }
    }

    function sendUpdateScript(str) {
        question = `${str}`
        const port = chrome.runtime.connect();
        port.postMessage({question: question})
        document.getElementById('scripttypeanswer').style.opacity = 1
        document.getElementById('scripttypeanswer').value = "Loading...";
        port.onMessage.addListener((msg) => showScriptUpdatePopup(msg))
    }

    function sendScript(str) {
        let scriptmessagetype = document.getElementById("scriptmessagetype").value;
        let scriptcharlimit = document.getElementById("scriptcharlimit").value;
        let scripttones = document.getElementById("scripttones").value;
        let scriptpurpose = document.getElementById("scriptpurpose").value;

        if (scriptpurpose === "Other") {
            scriptpurpose = document.getElementById("scriptpurpose-other-title").value;
        }
        // const salesphase = document.getElementById('salesphase').value;
        question = `please generate 10 scripts with these info: ${scriptmessagetype}`
        if (scriptcharlimit != "auto") {
            question = question + `, less than ${scriptcharlimit}`;
        }

        question = question + `, ${scriptpurpose}, ${scripttones}`
        if (str != "") {
            question = question + `, ${str}`
        }

        console.log('question', question);
        const port = chrome.runtime.connect();
        port.postMessage({question: question})
        document.getElementById('scripttypeanswer').style.opacity = 1
        document.getElementById('scripttypeanswer').value = "Loading...";
        port.onMessage.addListener((msg) => showScriptPopup(msg))
    }
    const setUserSetting = async () => {
        chrome.storage.local.get(["prospectFrameUserId"]).then((result) => {
            let clientId = result.prospectFrameUserId;
            if (clientId === null || clientId === undefined) {
                const API_URL = `${BASE_URL}/api/user/register/guest`;
                try {
                    fetch(API_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            $("#prospect_frame_subscribe_link").addClass("hidden");
                            $("#prospect_frame_register_link").attr('href', `${BASE_URL}/register?client_id=${data.client_id}`)
                            chrome.storage.local.set({ prospectFrameUserId: data.client_id })
                            chrome.storage.local.set({ prospectFrameRemainCount: data.count })
                            chrome.storage.local.set({ prospectFrameRegisterStatus: false })
                            chrome.storage.local.set({ prospectFrameIsLogin: false })
                            $("#prospect_frame_script_tab").addClass('hidden');
                            chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                                // Close the tab
                                chrome.tabs.sendMessage(tab[0].id, `clientId_${data.client_id}`);
                            });
                        });
                } catch (e) {
                    console.log(e);
                }
            } else {
                chrome.storage.local.set({ prospectFrameRegisterStatus: false })
                const API_URL = `${BASE_URL}/api/user/status`;
                
                chrome.tabs.query({ currentWindow: true, active: true }, function (tab) {
                    // Close the tab[0].id
                    console.log('clientId',clientId)
                    chrome.tabs.sendMessage(tab[0].id, `clientId_${clientId}`);
                });
                try {
                    fetch(API_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            client_id: clientId
                        })
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            $("#prospect_frame_script_tab").addClass('hidden');
                            if(data && data.status) {
                                $(".header-link").addClass('hidden');
                                if(data.status === "GUEST") {
                                    $("#prospect_frame_register_link").removeClass("hidden");
                                } else {
                                    $("#prospect_frame_account_link").removeClass("hidden");
                                    $("#prospect_frame_subscribe_link").removeClass("hidden");
                                    if(data.status === "PRO") {
                                       // $("#prospect_frame_script_tab").removeClass('hidden');
                                    }
                                }
                            } else {
                                $("#prospect_frame_subscribe_link").addClass("hidden");
                                $("#prospect_frame_account_link").addClass("hidden");
                            }
                            if(data && data.count) {
                                chrome.storage.local.set({ prospectFrameRegisterStatus: data.status })
                                chrome.storage.local.set({ prospectFrameRemainCount: data.count })
                            }

                        });
                } catch (e) {
                    console.log(e);
                }
            }
        });
    }

    //setUserSetting();

    const updateUserSetting = (remainCount) => {
        chrome.storage.local.get(["prospectFrameUserId"]).then((result) => {
            const userId = result.prospectFrameUserId;
            const API_URL = `${BASE_URL}/api/user/update`;
            try {
                fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        remain_count: remainCount,
                        client_id: userId
                    })
                }).then((response) => response.json())
                    .then((data) => {
                        console.log(data, 'remainCount data');
                    });
            } catch (e) {
                console.log(e);
            }
        });
    }

    function sendChat(str) {
        try {
            chrome.storage.local.get(["prospectFrameRemainCount"]).then((result) => {
                let remainCount = parseInt(result.prospectFrameRemainCount);
                if(remainCount !== -1) {
                    if(remainCount === null || remainCount === undefined || isNaN(remainCount)) {
                        remainCount = 1000;
                    }
                    if(remainCount === 0) {
                        alert("Please update your plans.");
                        return false;
                    }
                    remainCount -= 1;
                    updateUserSetting(remainCount);
                    chrome.storage.local.set({ prospectFrameRemainCount: remainCount })
                }
            })
        }
        catch (e) {
            console.log(e, 'SEND CHAT ERROR');
        }

        let question = chatPrompt();
        // const salesphase = document.getElementById('salesphase').value;
       /* question = `In the context of an ongoing conversation, please respond to this as if you're an independent health insurance agent speaking to a prospective client, or a current client ${messagetype}: - ${question} with ${tones} tone, intention: ${intentions}`

        question = question + `and his job is ${job_title} and job description is ${job_description} in ${industry} industry, ${industry_description}`;

        if (charlimit != "auto") {
            question = question + ` in no more than ${charlimit} characters. End this message with a ${responsetype}.`;
        } else {
            question = question + ` End this message with a ${responsetype}.`;
        }
        console.log('str', str);
        if (str != "") {
            question = question + ` Also, use this information to change the context of the message - ${str}`
        }*/

        chat.searchOpenAi(question);
        console.log('question', question);
       // const port = chrome.runtime.connect();
       // port.postMessage({question: question})
       // document.getElementById('output').style.opacity = 1
       // document.getElementById('output').value = "Loading...";
       // port.onMessage.addListener((msg) => showPopup(msg))
    }

    var responses = [
        "OK, let me check that out for you",
        "Message received. I'll see what I can do.",
        "ok, thank you.",
        "I understand.",
        "Hmm, I'm not sure I understand, can you rephrase that?",
        "Right ok, let me sort that out for you."
    ];
    var greetings = [
        "Hello there, welcome to the site. How may I help you?",
        "Good day! How are you?",
        "Hello, what can I do for you?",
        "Hi and welcome!",
        "Greetings :-)"

    ]
    var answers = [
        "Thank you for your question.",
        "OK, let me check that out for you",
        "A very good question! Let me have a look...",
        "Hmm, ok give me a minute and I'll sort that out.",
        "Yes, I think so."
    ]

   async function chatPrompt() {
        let question = document.getElementById("highlight").value;

        const charlimitElem = document.getElementById("charlimit");
        let charlimit = charlimitElem.options[charlimitElem.selectedIndex].value;


        const tones = $("#tones :selected").map(function(i, el) {
            return $(el).val();
        }).get().join(', ');

        const intentionsElem = document.getElementById("intentions");
        
        const intentions = intentionsElem?.options[intentionsElem.selectedIndex]?.value;

        const messagetypeElem = document.getElementById("messagetype");
        const messagetype = messagetypeElem.options[messagetypeElem.selectedIndex].value;

        const responsetypeElem = document.getElementById("responsetype");
        const responsetype = responsetypeElem.options[responsetypeElem.selectedIndex].value;

        const additionalInfo = document.getElementById("chatInput").value;

        /*user about data*/
        const user_name = document.getElementById("user_name").value;
        const job_title = document.getElementById("job_title").value;
        const job_description = document.getElementById("job_description").value;
        const industry = document.getElementById("industry").value;
        const industry_description = document.getElementById("industry_description").value;

        let is_allow_user_info = localStorage.getItem("is_allow_user_info");
        const parsed_text = localStorage.getItem('parsed_text')
        let content = '';
        if (is_allow_user_info == 1) { /*Login user prompt*/
            content = `You are my "Ai Throb", an AI that responds to messages from my clients 
            and prospects on my behalf. You are responding as me, not for me. Your responses 
            should always be conversational and never robotic or providing unnecessary 
            information. Remember that you are responding to an ongoing conversation, 
            so you never need to introduce yourself. Your mindset should be “the client 
            doesn’t care how much you know until they know how much you care”, so don’t 
            focus on immediately sharing too much product information unless it is relevant
            to their question or statement. 
            My name is ${user_name} and I'm a ${job_title}. My job description is as follows “${job_description}”. 
            I want you to respond to this ${messagetype} message - "${responsetype}" in a ${tones} tone with the 
            intention of ${intentions} within ${charlimit} characters and the last sentence of the 
            message should end with a ${question}. ${parsed_text}
            Here's some additional context or direction on how you should reply: ${additionalInfo}`;
        } else { /*guest user prompt*/
            content = `You are my "Ai Throb", an AI that responds to messages from my clients 
            and prospects on my behalf. You are responding as me, not for me. Your responses 
            should always be conversational and never robotic or providing unnecessary 
            information. Remember that you are responding to an ongoing conversation, 
            so you never need to introduce yourself. Your mindset should be “the client 
            doesn’t care how much you know until they know how much you care”, so don’t 
            focus on immediately sharing too much product information unless it is relevant
            to their question or statement.
            I want you to respond to this ${messagetype} message - "${responsetype}" in a ${tones} tone with the 
            intention of ${intentions} within ${charlimit} characters and the last sentence of the 
            message should end with a ${question}. ${parsed_text}
            Here's some additional context or direction on how you should reply: ${additionalInfo}`;

        }

        console.log('parsed_text',content)
       return content
    }

    function operatorChat() {
        var randResponse = responses[Math.floor(Math.random() * responses.length)];
        dispatchChatEvent(randResponse, "ChatGPT");
    }

    function operatorAnswerChat() {
        var randResponse = answers[Math.floor(Math.random() * responses.length)];
        dispatchChatEvent(randResponse, "ChatGPT");
    }

    function operatorGreetingChat() {
        var randResponse = greetings[Math.floor(Math.random() * responses.length)];
        dispatchChatEvent(randResponse, "ChatGPT");
    }

    function dispatchChatEvent(msg, from) {
        // var event = new CustomEvent('chatreceived', {"detail":{datetime:new Date().toISOString(), message:msg, from:from}});

        // Listen for the event
        //chat.addEventListener('chatreceived', function (e) { console.log(e.detail) }, false);

        // Dispatch the event.
        raiseEvent("chatreceived", {"chat": {datetime: new Date().toISOString(), message: msg, from: from}});
    }

    this.addListener = function (eventName, callback) {
        var events = _events;
        callbacks = events[eventName] = events[eventName] || [];
        callbacks.push(callback);
    };

    function raiseEvent(eventName, args) {
        var callbacks = _events[eventName];
        if (typeof (callbacks) != "undefined") {
            for (var i = 0, l = callbacks.length; i < l; i++) {
                callbacks[i](args);
            }
        }
    }

    async function searchOpenAi(question) {
        try {
            document.getElementById('output').style.opacity = 1
            document.getElementById('output').value = "Loading...";
            question = await question;
            const API_URL = BASE_URL + '/api/v1/portal/search-openai';
            fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    search: question,
                })
            }).then((response) => response.json())
                .then((data) => {
                    showPopup(JSON.stringify(data))
                });
        } catch (e) {
            console.log(e);
        }
    }
}


// $(function(){

// 	function loadData(chats){
// 		$("#chatHistory").append(chats[0].message);
// 	}

// 	chat.getChatHistory(loadData);
// });
