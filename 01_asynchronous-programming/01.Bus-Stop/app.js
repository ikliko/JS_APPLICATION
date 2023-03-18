async function getInfo() {
    const stopId = document.getElementById('stopId').value;
    const stopNameWrapper = document.getElementById('stopName');
    const busesListWrapper = document.getElementById('buses');
    const API_ENDPOINT = 'http://localhost:3030';

    function createElement({type, attr, content}) {
        const elm = document.createElement(type);
        Object.assign(elm, attr);

        if (content) {
            elm.appendChild(content);
        }

        return elm;
    }

    async function makeRequest(url) {
        return await fetch(`${API_ENDPOINT}/${url}`);
    }

    async function getBusStopData(stopId) {
        return (await makeRequest(`jsonstore/bus/businfo/${stopId}`))
            .json();
    }

    function setBusStopName(name) {
        stopNameWrapper.textContent = name;
    }

    function setBusesList(buses) {
        Object.entries(buses)
            .forEach(([id, time]) => {
                busesListWrapper.appendChild(createElement({
                    type: 'li',
                    attr: {
                        textContent: `Bus ${id} arrives in ${time} minutes`
                    }
                }));
            });
    }

    function clear() {
        setBusStopName('')
        busesListWrapper.innerHTML = '';
    }

    clear();

    try {
        const data = await getBusStopData(stopId);

        setBusStopName(data.name);
        setBusesList(data.buses);
    } catch (e) {
        setBusStopName('Error')
    }
}