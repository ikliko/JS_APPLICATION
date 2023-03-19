const inputLocation = document.querySelector('#request input#location');
const submit = document.querySelector('#request input#submit');
const forecastElement = document.querySelector('div#forecast');
const currentElement = document.querySelector('div#forecast div#current');
const upcomingElement = document.querySelector('div#forecast div#upcoming');
const API_ENDPOINT = 'http://localhost:3030/jsonstore/';
const ENTITY_ENDPOINT = 'forecaster/'

const symbols = {
    Sunny: '&#x2600', // ☀
    'Partly sunny': '&#x26C5', // ⛅
    Overcast: '&#x2601', // ☁
    Rain: '&#x2614', // ☂
    Degrees: '&#176', // °
};

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

function showError() {
    forecastElement.style.display = 'block';
    forecastElement.textContent = 'Error';
}

function printTemp({high, low}) {
    return `${low}${symbols.Degrees}/${high}${symbols.Degrees}`
}

function attachEvents() {
    function renderTodayWeather({name, forecast: {high, low, condition}}) {
        const todayWrapper = createElement({
            type: 'div',
            attr: {
                className: 'forecasts'
            }
        });

        // condition symbol
        todayWrapper.appendChild(createElement({
            type: 'span',
            attr: {
                className: 'condition symbol',
                innerHTML: symbols[condition]
            }
        }));

        const cardInfo = createElement({
            type: 'span',
            attr: {
                className: 'condition',
            }
        });

        // name
        cardInfo.appendChild(createElement({
            type: 'span',
            attr: {
                className: 'forecast-data',
                textContent: name
            }
        }));

        // temp
        cardInfo.appendChild(createElement({
            type: 'span',
            attr: {
                className: 'forecast-data',
                innerHTML: printTemp({high, low})
            }
        }));

        // temp
        cardInfo.appendChild(createElement({
            type: 'span',
            attr: {
                className: 'forecast-data',
                textContent: condition
            }
        }));

        todayWrapper.appendChild(cardInfo);
        currentElement.appendChild(todayWrapper);
    }

    function renderUpcomingWeather({forecast}) {
        const forecastInfo = createElement({
            type: 'div',
            attr: {
                className: 'forecast-info'
            }
        });

        forecast.forEach(({condition, high, low}) => {
            const dayWrapper = createElement({
                type: 'span',
                attr: {
                    className: 'upcoming'
                }
            });

            // symbol
            dayWrapper.appendChild(createElement({
                type: 'span',
                attr: {
                    className: 'symbol',
                    innerHTML: symbols[condition]
                }
            }));

            // temp
            dayWrapper.appendChild(createElement({
                type: 'span',
                attr: {
                    className: 'forecast-data',
                    innerHTML: printTemp({high, low})
                }
            }));

            // condition
            dayWrapper.appendChild(createElement({
                type: 'span',
                attr: {
                    className: 'forecast-data',
                    textContent: condition
                }
            }));

            forecastInfo.appendChild(dayWrapper);
        });

        upcomingElement.appendChild(forecastInfo);
    }

    submit.addEventListener('click', async function () {
        try {
            currentElement.querySelector('.forecasts').remove();
            upcomingElement.querySelector('.forecast-info').remove();
        } catch (e) {
        }

        const city = (await makeRequest('locations'))
            .find(c => c.name === inputLocation.value);

        if (!city) {
            showError();

            return;
        }

        try {
            const {code} = city;
            makeRequest(`today/${code}`)
                .then(todayWeather => {
                    renderTodayWeather(todayWeather);
                }).catch(showError);

            makeRequest(`upcoming/${code}`)
                .then(upcomingWeather => {
                    renderUpcomingWeather(upcomingWeather);
                }).catch(showError);

            forecastElement.style.display = 'block';
        } catch (e) {
            showError();
        }
    });
}

attachEvents();