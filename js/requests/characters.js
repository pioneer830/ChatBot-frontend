var characters = new function () {

    this.getCharacters = getCharacters;

   function getCharacters() {
        chrome.storage.local.get(["prospectFrameUserId"]).then((result) => {
            allCharacters();
            /*const client_id = result.prospectFrameUserId;
            if (typeof isLogin !== 'undefined' && isLogin === true) {
                userCharacters(client_id);
            } else {
                allCharacters();
            }*/
        });
    }

    const allCharacters = () => {
        const API_URL = BASE_URL + '/api/v1/portal/get-all-character';
        try {
            fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((response) => response.json())
                .then((data) => {
                    setAllCharacters(data.character_length);
                });
        } catch (e) {
            console.log(e);
        }
    }

    const userCharacters = (client_id) => {
        const API_URL = BASE_URL + '/api/v1/portal/get-user-character';
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
                    setUserCharacters(data ?? []);
                });
        } catch (e) {
            console.log(e);
        }
    }

    /*Character Length functions*/
    const setAllCharacters = (characters) => {
        let btn_html = '';
        let option_html = '';
        Object.values(characters).forEach( function (character, index) {
            btn_html += renderCharacterButtons(character, index);
            option_html += renderCharacterOption(character, index);
        });

        document.getElementById('render-character').innerHTML = btn_html;
        document.getElementById('charlimit').innerHTML = option_html;
    }

    const setUserCharacters = (characters) => {
        let btn_html = '';
        let option_html = '';
        Object.values(characters).forEach( function (character, index) {
            if (character.character_length != null) {
                btn_html += renderCharacterButtons(character.character_length, index);
                option_html += renderCharacterOption(character.character_length, index);
            }
        });

        document.getElementById('render-character').innerHTML = btn_html;
        document.getElementById('charlimit').innerHTML = option_html;
    }

    const renderCharacterButtons = (intention, index) => {
        let btnClass = '';
        if (index === 0) {
            btnClass = 'default selected';
        }
        return `<button class="ml-4 cursor-pointer tag-btn char-btn ${btnClass} rounded-md">${intention.name}</button>`;
    }

    const renderCharacterOption = (intention, index) => {
        let optionClass = '';
        let selected = '';
        if (index === 0) {
            optionClass = 'default';
            selected = 'selected';
        }
        return `<option class="${optionClass}" value="160 or less" ${selected}>${intention.name ?? ''}</option>`;
    }
    /*End Character Length functions*/

}

/*calling on load*/
setTimeout( function () {
    characters.getCharacters();
}, 1000);