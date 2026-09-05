const formulario = document.getElementById("formulario");
const cidadeInput = document.getElementById("cidade");
const resultado = document.getElementById("resultado");

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const cidade = cidadeInput.value;

    resultado.innerHTML = "<p>Consultando clima...</p>";

    try {

        // 1. Descobrir as coordenadas da cidade
        const respostaCidade = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`
        );

        const dadosCidade = await respostaCidade.json();

        if (!dadosCidade.results) {
            throw new Error("Cidade não encontrada");
        }

        const local = dadosCidade.results[0];

        // 2. Buscar o clima usando latitude e longitude
        const respostaClima = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${local.latitude}&longitude=${local.longitude}&current=temperature_2m,weather_code&timezone=auto`
        );

        const dadosClima = await respostaClima.json();

        const temperatura =
            dadosClima.current.temperature_2m;

        // 3. Mostrar resultado
        resultado.innerHTML = `
            <h2>${local.name}</h2>

            <p>${local.country}</p>

            <div class="temperatura">
                ${temperatura}°C
            </div>

            <p>🌡️ Temperatura atual</p>
        `;

    } catch (erro) {

        resultado.innerHTML = `
            <p class="erro">
                Não foi possível encontrar essa cidade.
            </p>
        `;

        console.error(erro);
    }

});