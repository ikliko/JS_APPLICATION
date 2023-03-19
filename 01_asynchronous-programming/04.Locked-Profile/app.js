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
    const profile = createElement({
        type: 'profile',
        attr: {
            className: 'profile',
        },
    });

    profile.appendChild(createElement({
        type: 'img',
        attr: {
            src: 'iconProfile2.png',
            className: 'userIcon',
        },
    }));

    profile.appendChild(createElement({
        type: 'label',
        attr: {
            textContent: 'lock',
        }
    }));

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

    profile.appendChild(createElement({
        type: 'label',
        attr: {
            textContent: 'Unlock'
        }
    }));

    profile.appendChild(createElement({
        type: 'input',
        attr: {
            type: 'radio',
            name: `user${index}Locked`,
            value: 'unlock'
        }
    }));

    profile.appendChild(createElement({
        type: 'br',
    }));

    profile.appendChild(createElement({
        type: 'hr',
    }));

    profile.appendChild(createElement({
        type: 'label',
        attr: {
            textContent: 'Username',
        }
    }));

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

    const hiddenFields = createElement({
        type: 'div',
        attr: {
            className: `user${index}Username`,
        },
    });

    hiddenFields.style.display = 'none';

    hiddenFields.appendChild(createElement({
        type: 'hr'
    }));

    hiddenFields.appendChild(createElement({
        type: 'label',
        attr: {
            textContent: 'Email:',
        },
    }));

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

    hiddenFields.appendChild(createElement({
        type: 'label',
        attr: {
            textContent: 'Age:',
        },
    }));

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