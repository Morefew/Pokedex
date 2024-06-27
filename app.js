// Obtenemos el elemento del contenedor de Pokémon y la barra de búsqueda desde el DOM.
const pokemonContainer = document.getElementById('pokemon-container');
const searchBar = document.getElementById('search-bar');

// Definimos el número de Pokémon que queremos obtener. En este caso, 151.
const numberOfPokemon = 151; 
// Creamos un array para almacenar todos los Pokémon que obtendremos.
let allPokemon = [];

// Añadimos un evento al input de búsqueda para filtrar los Pokémon cuando se escribe en la barra de búsqueda.
searchBar.addEventListener('input', (e) => {
    // Convertimos el valor de búsqueda a minúsculas.
    const searchValue = e.target.value.toLowerCase();
    // Filtramos los Pokémon según el nombre.
    const filteredPokemon = allPokemon.filter(pokemon => pokemon.name.toLowerCase().includes(searchValue));
    // Mostramos los Pokémon filtrados.
    displayAllPokemon(filteredPokemon);
});

// Función asíncrona para obtener datos de un Pokémon específico por su ID.
const fetchPokemon = async (id) => {
    // Construimos la URL para la API de Pokémon con el ID proporcionado.
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    // Hacemos una solicitud fetch a la API.
    const res = await fetch(url);
    // Convertimos la respuesta a formato JSON.
    const pokemon = await res.json();
    // Añadimos el Pokémon obtenido al array allPokemon.
    allPokemon.push(pokemon);
};

// Función asíncrona para obtener todos los Pokémon desde 1 hasta numberOfPokemon.
const fetchAllPokemon = async () => {
    // Usamos un bucle for para obtener cada Pokémon por su ID.
    for (let i = 1; i <= numberOfPokemon; i++) {
        // Esperamos a que se obtenga el Pokémon antes de continuar con el siguiente.
        await fetchPokemon(i);
    }
    // Mostramos todos los Pokémon obtenidos.
    displayAllPokemon(allPokemon);
};

// Función para mostrar todos los Pokémon en el contenedor.
const displayAllPokemon = (pokemonList) => {
    // Limpiamos el contenido del contenedor de Pokémon.
    pokemonContainer.innerHTML = '';
    // Recorremos la lista de Pokémon y mostramos cada uno.
    pokemonList.forEach(pokemon => displayPokemon(pokemon));
};

// Función para crear y mostrar la tarjeta de un Pokémon específico.
const displayPokemon = (pokemon) => {
    // Creamos un elemento div para la tarjeta del Pokémon.
    const pokemonCard = document.createElement('div');
    // Añadimos la clase CSS 'pokemon-card' al div.
    pokemonCard.classList.add('pokemon-card');

    // Obtenemos las habilidades del Pokémon y las convertimos en una cadena.
    const abilities = pokemon.abilities.map(ability => ability.ability.name).join(', ');
    // Mapeamos las estadísticas del Pokémon a un nuevo formato.
    const stats = pokemon.stats.map(stat => ({
        name: stat.stat.name,
        base_stat: stat.base_stat
    }));

    // Creamos el HTML interno para la tarjeta del Pokémon.
    const pokemonInnerHTML = `
        <div class="number">#${pokemon.id.toString().padStart(3, '0')}</div>
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png" alt="${pokemon.name}">
        <h2>${pokemon.name}</h2>
        <p>Type: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        <p>Abilities: ${abilities}</p>
        <div class="stats">
            <canvas id="chart-${pokemon.id}"></canvas>
        </div>
    `;

    // Asignamos el HTML interno al div de la tarjeta.
    pokemonCard.innerHTML = pokemonInnerHTML;
    // Añadimos la tarjeta del Pokémon al contenedor de Pokémon.
    pokemonContainer.appendChild(pokemonCard);
    // Creamos un gráfico de estadísticas para el Pokémon.
    createChart(`chart-${pokemon.id}`, stats);
};

// Función para crear un gráfico utilizando Chart.js
const createChart = (canvasId, stats) => {
    // Obtenemos el contexto del canvas por su ID.
    const ctx = document.getElementById(canvasId).getContext('2d');
    // Creamos un nuevo gráfico de tipo pie.
    new Chart(ctx, {
        type: 'pie',
        data: {
            // Etiquetas para el gráfico basadas en las estadísticas.
            labels: stats.map(stat => stat.name),
            datasets: [{
                // Datos para el gráfico basados en las estadísticas.
                data: stats.map(stat => stat.base_stat),
                // Colores de fondo para cada sección del gráfico.
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                // Colores de borde para cada sección del gráfico.
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1 // Ancho del borde.
            }]
        },
        options: {
            responsive: true, // Hacer que el gráfico sea responsivo.
            maintainAspectRatio: false, // No mantener la relación de aspecto.
            plugins: {
                legend: {
                    position: 'top', // Posición de la leyenda o info del grafico.
                },
                // Tooltip es para ver man info cuando se pasa el mouse por encima del grafico
                tooltip: {
                    callbacks: {
                        // Función que personaliza la etiqueta de la tooltip, añadiendo el nombre y valor de la estadística.
                        label: function (context) { // Recibe el context del tooltip
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            // Añade el valor de los datos a la etiqueta.
                            if (context.parsed !== null) {
                                label += context.parsed;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
};

// Llamamos a la función para obtener todos los Pokémon cuando se carga la página.
fetchAllPokemon();
