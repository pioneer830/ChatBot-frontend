const OPEN_API_KEY = "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" //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"
const API_URL = "https://api.openai.com/v1/chat/completions"

const getResponse = async (question) => {
    console.log('getResponse', question)
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + OPEN_API_KEY,
                },
                body: JSON.stringify({
                  "model": "gpt-3.5-turbo",
                  "messages": [{"role": "user", "content": question}]
                })
            })
            console.log('res', res);
            resolve(res.body)
        } catch (e) {
            if (e === "CLOUDFLARE") {
                reject("CLOUDFLARE")
            } else {
                reject("ERROR")
            }
        }
    })
}

chrome.action.onClicked.addListener(tab => {
    // chrome.tabs.sendMessage(tab.id,"toggle");
    // console.log('message sent');
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
           var activeTab = tabs[0];
           chrome.tabs.sendMessage(activeTab.id,
            "toggle"
           );
     });
  });


chrome.runtime.onConnect.addListener((port) => {
    console.log("Connect",port);
    port.onMessage.addListener((msg) => {
        const question = msg.question
        getResponse(question).then(async answer => {
            const resRead = answer.getReader()
            while (true) {
                const {done, value} = await resRead.read()
                if (done) break
                if (done === undefined || value === undefined) port.postMessage('ERROR')
                const data = new TextDecoder().decode(value)
                port.postMessage(data)
            }
        }).catch((e) => port.postMessage(e))
    })
})

// // Regex-pattern to check URLs against. 
// // It matches URLs like: http[s]://[...]stackoverflow.com[...]
// var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?stackoverflow\.com/;

// // A function to use as callback
// function doStuffWithDom(domContent) {
//     console.log('I received the following DOM content:\n' + domContent);
// }

// // When the browser-action button is clicked...
// chrome.browserAction.onClicked.addListener(function (tab) {
//     // ...check the URL of the active tab against our pattern and...
//     if (urlRegex.test(tab.url)) {
//         // ...if it matches, send a message specifying a callback too
//         chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
//     }
// });