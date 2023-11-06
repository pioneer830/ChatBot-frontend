const apiKey = 'AIzaSyC75ZGCpCs7vhEHmePYI3X0JHjsD3f4dqQ';

const uploadImageHtml = `<div class="upload-file-area">
                <h3 class="mb-10 font-medium text-sm">Upload Screenshot:</h3>
                <input type="file" name="file-1[]" id="file-input" name="screenshot"/>
                <span id="img-validate-msg"></span>
                <br/>
                <div style="display: none" id="clr-btn-area" class="clear-btn">
                    <button id="clr-btn-self">Clear</button>
                </div>
                <textarea disabled style="display: none" class="img-text" name="" id="ss-view" cols="30" rows="5"></textarea>
            </div>`;


const parsedTextClear = async () => {
    document.getElementById("ss-view").innerHTML = "";
    document.getElementById("file-input").value = null;
    document.getElementById("ss-view").style.display = "none";
    document.getElementById("clr-btn-area").style.display = "none";
    await chrome.storage.local.set({'parsed_text': ""})
    localStorage.removeItem('parsed_text')
}
// Base64 encode the image file
const getBase64Image = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
}


// Perform OCR on the image using Google Vision API
const performOCR = async (imageData) => {
    let result = "";
    const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const requestData = {
        requests: [
            {
                image: {
                    content: imageData,
                },
                features: [
                    {
                        type: 'TEXT_DETECTION',
                    },
                ],
            },
        ],
    };
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })

    const {responses} = await response.json();

    const [current_response] = responses;
    const {fullTextAnnotation} = current_response;
    const {text} = fullTextAnnotation;

    if (text) {
        result = text;
    }
    return result;
}

// Handle file input change event
const handleFileInputChange = async (event) => {

    let allowedExtension = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/bmp'
    ];


    const file = event.target.files[0];
    let type = event.target.files[0].type;
    let spanTag = document.getElementById("img-validate-msg");
    let clearBtn = document.getElementById("clr-btn-area");

    spanTag.innerHTML = "";
    if (!(allowedExtension.indexOf(type) > -1)) {
        spanTag.innerHTML = 'Please select valid image'
        return false;
    }

    const imageData = await getBase64Image(file);
    const text = await performOCR(imageData);

    document.getElementById("ss-view").style.display = "none";
    clearBtn.style.display = "none";
    localStorage.removeItem('parsed_text')
    if (text) {
        document.getElementById("ss-view").innerHTML = text
        document.getElementById("ss-view").style.display = "block";
        clearBtn.style.display = "block";
        chrome.runtime.sendMessage({action: "imageupload", text: text});
        localStorage.setItem('parsed_text',text)
    }
}

// Listen for file input change event
if (document.getElementById('file-input')) {
    document.getElementById('file-input')
        .addEventListener('change', handleFileInputChange);

}

if (document.getElementById('clr-btn-self')) {
    document.getElementById('clr-btn-self')
        .addEventListener('click', parsedTextClear);

}