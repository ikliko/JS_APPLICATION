function solve() {
    const departBtn = document.getElementById('depart');
    const arriveBtn = document.getElementById('arrive');
    const infoWrapper = document.querySelector('#info .info');
    const API_ENDPOINT = 'http://localhost:3030';

    async function makeRequest(url) {
        return await fetch(`${API_ENDPOINT}/${url}`);
    }

    const app = {
        currentStop: {
            next: 'depot'
        },

        async getNextStop() {
            return (await makeRequest(`jsonstore/bus/schedule/${this.currentStop.next}`))
                .json();
        },

        stop() {
            departBtn.removeAttribute('disabled');
            arriveBtn.setAttribute('disabled', 'true');

            app.setInfo(`Arriving at ${app.currentStop.name}`);
        },

        async start() {
            arriveBtn.removeAttribute('disabled');
            departBtn.setAttribute('disabled', 'true');

            try {
                const {name, next} = await this.getNextStop();
                app.setStop({name, next});
                app.setInfo(`Next stop ${name}`);
            } catch (e) {
                this.handleError();
            }
        },

        handleError() {
            arriveBtn.setAttribute('disabled', 'true');
            departBtn.setAttribute('disabled', 'true');
            this.setInfo('Error');
        },

        setStop(data) {
            this.currentStop = data;
        },

        setInfo(info) {
            infoWrapper.textContent = info;
        },
    };


    async function depart() {
        app.start();
    }

    function arrive() {
        app.stop();
    }

    return {
        depart,
        arrive
    };
}

let result = solve();