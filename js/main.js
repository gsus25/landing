const databaseURL = 'https://landing-10f91-default-rtdb.firebaseio.com/coleccion.json';

let sendData = () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // new Date().toLocaleString( locales, options )
    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' })

    fetch(databaseURL, {
        method: 'POST', // Método de la solicitud
        headers: {
            'Content-Type': 'application/json' // Especifica que los datos están en formato JSON
        },
        body: JSON.stringify(data) // Convierte los datos a JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json(); // Procesa la respuesta como JSON
    })
    .then(result => {
        alert('Agradeciendo tu preferencia, nos mantenemos actualizados y enfocados en atenderte como mereces'); // Maneja la respuesta con un mensaje
        form.reset()
        // Recuperación de datos
        getData();
    })
    .catch(error => {
        alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
    });
}

let getData = async () => {  
    try {
        const response = await fetch(databaseURL, { method: 'GET' });
        if (!response.ok) {
            alert('Hemos experimentado un error. ¡Vuelve pronto!');
            return;
        }

        const data = await response.json();
        if (data != null) {
            let playerVotes = new Map();

            // Contar votos por jugador
            for (let key in data) {
                let { jugador } = data[key];
                let count = playerVotes.get(jugador) || 0;
                playerVotes.set(jugador, count + 1);
            }

            // Ordenar los jugadores por votos en orden descendente y tomar los 5 primeros
            let topPlayers = Array.from(playerVotes.entries())
                .sort((a, b) => b[1] - a[1]) // Ordenar por votos (descendente)
                .slice(0, 5); // Tomar los primeros 5 jugadores

            // Limpiar la tabla y agregar filas con los 5 jugadores más votados
            subscribers.innerHTML = '';
            let index = 1;
            for (let [player, votes] of topPlayers) {
                let rowTemplate = `
                    <tr>
                        <th>${index}</th>
                        <td>${player}</td>
                        <td>${votes}</td>
                    </tr>`;
                subscribers.innerHTML += rowTemplate;
                index++;
            }
        }
    } catch (error) {
        alert('Hemos experimentado un error. ¡Vuelve pronto!');
    }
};




let ready = () => {
    console.log('DOM está listo')
    //debugger;
    // Recuperación de datos
    getData();
}
let loaded = () => {
    let myform = document.getElementById('form');
    //debugger;
    document.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault();

        var emailElement = document.querySelector('.form-control-lg');
        var emailText = emailElement.value;

        if (emailText.length === 0) {
            emailElement.focus();

            emailElement.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(50px)" },
                    { transform: "translateX(-50px)" },
                    { transform: "translateX(0)" }
                ],
                {
                    duration: 400,
                    easing: "linear",
                }
            );
            return;
        }
        sendData();
        
    });
    console.log('Iframes e Images cargadas')

}

window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded)

