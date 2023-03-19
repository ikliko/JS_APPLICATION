const main = document.querySelector('main#main')

const API_ENDPOINT = 'http://localhost:3030/jsonstore/';
const ENTITY_ENDPOINT = 'advanced/'

async function makeRequest(url) {
    return await fetch(`${API_ENDPOINT}${ENTITY_ENDPOINT}${url}`)
        .then(res => res.json());
}

function createElement({type, attr, content}) {
    const elm = document.createElement(type);
    Object.assign(elm, attr);

    if (content) {
        elm.appendChild(content);
    }

    return elm;
}

function renderProfile({_id, username, email, age, index}) {
    // <div className="profile">
    const profile = createElement({
        type: 'profile',
        attr: {
            className: 'profile',
        },
    });

    // profile photo
    //     <img src="iconProfile2.png" className="userIcon"/>
    profile.appendChild(createElement({
        type: 'img',
        attr: {
            src: 'iconProfile2.png',
            className: 'userIcon',
        },
    }));

    //     <label>Lock</label>
    profile.appendChild(createElement({
        type: 'label',
        attr: {
            textContent: 'lock',
        }
    }));

    //     <input type="radio" name="user1Locked" value="lock" checked>
    const lockInput = createElement({
        type: 'input',
        attr: {
            type: 'radio',
            name: `user${index}Locked`,
            value: 'lock',
            checked: true,
        }
    });

    profile.appendChild(lockInput);

    //     <label>Unlock</label>
    profile.appendChild(createElement({
        type: 'label',
        attr: {
            textContent: 'Unlock'
        }
    }));

    //     <input type="radio" name="user1Locked" value="unlock">
    profile.appendChild(createElement({
        type: 'input',
        attr: {
            type: 'radio',
            name: `user${index}Locked`,
            value: 'unlock'
        }
    }));

    // br
    profile.appendChild(createElement({
        type: 'br',
    }));

    //     <hr>
    profile.appendChild(createElement({
        type: 'hr',
    }));

    //     <label>Username</label>
    profile.appendChild(createElement({
        type: 'label',
        attr: {
            textContent: 'Username',
        }
    }));

    //     <input type="text" name="user1Username" value="" disabled readOnly/>
    profile.appendChild(createElement({
        type: 'input',
        attr: {
            type: 'text',
            name: `user${index}Username`,
            value: username,
            disabled: true,
            readOnly: true
        }
    }));

//     <div className="user1Username">
    const hiddenFields = createElement({
        type: 'div',
        attr: {
            className: `user${index}Username`,
        },
    });

    hiddenFields.style.display = 'none';

//         <hr>
    hiddenFields.appendChild(createElement({
        type: 'hr'
    }));

//         <label>Email:</label>
    hiddenFields.appendChild(createElement({
        type: 'label',
        attr: {
            textContent: 'Email:',
        },
    }));

//         <input type="email" name="user1Email" value="" disabled readOnly/>
    hiddenFields.appendChild(createElement({
        type: 'input',
        attr: {
            type: 'email',
            name: `user${index}Email`,
            value: email,
            disabled: true,
            readOnly: true,
        },
    }));

//         <label>Age:</label>
    hiddenFields.appendChild(createElement({
        type: 'label',
        attr: {
            textContent: 'Age:',
        },
    }));

//         <input type="text" name="user1Age" value="" disabled readOnly/>
    hiddenFields.appendChild(createElement({
        type: 'input',
        attr: {
            type: 'email',
            name: `user${index}Age`,
            value: age,
            disabled: true,
            readOnly: true,
        }
    }));

    // profile.appendChild(hiddenFields);

    //     <button>Show more</button>
    const showMoreBtn = createElement({
        type: 'button',
        attr: {
            textContent: 'Show more',
        },
    });

    const toggleHiddenFields = function () {
        if (hiddenFields.style.display === 'none') {
            hiddenFields.style.display = 'block';
            profile.insertBefore(hiddenFields, showMoreBtn);

            return;
        }

        hiddenFields.style.display = 'none';
        profile.removeChild(hiddenFields);
    };

    const toggleButtonText = function () {
        if (hiddenFields.style.display === 'none') {
            showMoreBtn.textContent = 'Show more';

            return;
        }

        showMoreBtn.textContent = 'Hide it';
    };

    showMoreBtn.addEventListener('click', () => {
        if(lockInput.checked) {
            return;
        }

        toggleHiddenFields();
        toggleButtonText();
    });

    profile.appendChild(showMoreBtn);

    return profile;
}

async function lockedProfile() {
    const profiles = await makeRequest('profiles');
    Object.keys(profiles)
        .map((k, i) => renderProfile({
            ...profiles[k],
            index: i+1,
        }))
        .forEach(e => main.appendChild(e));

}