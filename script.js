// ======================================================
// LUCAS MEYER · ENTRENADOR DE GUION
// ======================================================


// ------------------------------------------------------
// ESTADO
// ------------------------------------------------------

let listaActual = [...guion];
let indiceAprender = 0;
let indiceEnsayo = 0;

let filtroTextos = "todos";

let dominados = JSON.parse(
  localStorage.getItem("progresoLucas") || "[]"
);

let dificiles = JSON.parse(
  localStorage.getItem("dificilesLucas") || "[]"
);


// ------------------------------------------------------
// UTILIDADES
// ------------------------------------------------------

function porId(id) {
  return document.getElementById(id);
}


function estaDominado(id) {
  return dominados.includes(id);
}


function estaDificil(id) {
  return dificiles.includes(id);
}


function guardarProgreso() {

  localStorage.setItem(
    "progresoLucas",
    JSON.stringify(dominados)
  );

  localStorage.setItem(
    "dificilesLucas",
    JSON.stringify(dificiles)
  );

  actualizarProgreso();
}


function agregarUnico(array, valor) {

  if (!array.includes(valor)) {
    array.push(valor);
  }

}


function quitar(array, valor) {

  const posicion = array.indexOf(valor);

  if (posicion !== -1) {
    array.splice(posicion, 1);
  }

}


function escaparHTML(texto = "") {

  return texto
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}


// ------------------------------------------------------
// NAVEGACIÓN PRINCIPAL
// ------------------------------------------------------

function abrirPantalla(nombre) {

  document
    .querySelectorAll(".pantalla")
    .forEach(pantalla => {
      pantalla.classList.remove("activa");
    });


  document
    .querySelectorAll(".nav-btn")
    .forEach(boton => {
      boton.classList.remove("activo");
    });


  const pantalla = porId(nombre);

  if (pantalla) {
    pantalla.classList.add("activa");
  }


  const botonActivo = document.querySelector(
    `.nav-btn[data-pantalla="${nombre}"]`
  );

  if (botonActivo) {
    botonActivo.classList.add("activo");
  }


  if (nombre === "textos") {
    cargarListaTextos();
  }


  if (nombre === "progreso") {
    actualizarProgreso();
  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


document
  .querySelectorAll(".nav-btn")
  .forEach(boton => {

    boton.addEventListener("click", () => {

      abrirPantalla(
        boton.dataset.pantalla
      );

    });

  });


document
  .querySelectorAll("[data-ir]")
  .forEach(boton => {

    boton.addEventListener("click", () => {

      abrirPantalla(
        boton.dataset.ir
      );

    });

  });


// ------------------------------------------------------
// FILTRAR POR ACTO / CUADRO
// ------------------------------------------------------

function filtrarGuion(valor) {

  if (valor === "todos") {
    return [...guion];
  }


  const partes = valor.split("-");

  const acto = Number(partes[0]);
  const cuadro = Number(partes[1]);


  return guion.filter(item => {

    return (
      item.acto === acto &&
      item.cuadro === cuadro
    );

  });
}


// ======================================================
// MODO APRENDER
// ======================================================

function cargarAprender() {

  if (!listaActual.length) {
    return;
  }


  if (indiceAprender < 0) {
    indiceAprender = listaActual.length - 1;
  }


  if (indiceAprender >= listaActual.length) {
    indiceAprender = 0;
  }


  const item = listaActual[indiceAprender];


  porId("aprender-numero").textContent =
    indiceAprender + 1;

  porId("aprender-total").textContent =
    listaActual.length;

  porId("aprender-personaje").textContent =
    item.personajePie.toUpperCase();

  porId("aprender-pie").textContent =
    item.pie;


  // Ocultar respuesta

  const respuesta =
    porId("aprender-respuesta");

  respuesta.textContent =
    "••••••••••••••••";

  respuesta.className =
    "respuesta-oculta";


  // Ocultar pista

  porId("zona-pista")
    .classList.add("oculto");


  // Ocultar acotación

  const acotacion =
    porId("acotacion-aprender");

  acotacion.classList.add("oculto");
  acotacion.textContent = "";


  // Ocultar evaluación

  porId("evaluacion-aprender")
    .classList.add("oculto");
}


// ------------------------------------------------------
// PRIMERA PALABRA
// ------------------------------------------------------

porId("primera-palabra")
  .addEventListener("click", () => {

    const item =
      listaActual[indiceAprender];

    const palabras =
      item.lucas.trim().split(/\s+/);

    const primera =
      palabras[0] || "";


    const pista =
      porId("zona-pista");

    pista.textContent =
      `Primera palabra: ${primera}`;

    pista.classList.remove("oculto");

  });


// ------------------------------------------------------
// PISTA
// ------------------------------------------------------

porId("mostrar-pista")
  .addEventListener("click", () => {

    const item =
      listaActual[indiceAprender];

    const palabras =
      item.lucas
        .trim()
        .split(/\s+/);


    // Aproximadamente primer 20%
    // del parlamento.

    const cantidad =
      Math.max(
        2,
        Math.ceil(palabras.length * 0.2)
      );


    const fragmento =
      palabras
        .slice(0, cantidad)
        .join(" ");


    const pista =
      porId("zona-pista");

    pista.textContent =
      `${fragmento}…`;

    pista.classList.remove("oculto");

  });


// ------------------------------------------------------
// VER TEXTO
// ------------------------------------------------------

porId("ver-texto")
  .addEventListener("click", () => {

    mostrarRespuestaAprender();

  });


function mostrarRespuestaAprender() {

  const item =
    listaActual[indiceAprender];


  const respuesta =
    porId("aprender-respuesta");

  respuesta.textContent =
    item.lucas;

  respuesta.className =
    "respuesta-visible";


  // Acotación

  if (
    item.acotacion &&
    item.acotacion.trim() !== ""
  ) {

    const acotacion =
      porId("acotacion-aprender");

    acotacion.textContent =
      `(${item.acotacion})`;

    acotacion.classList.remove("oculto");
  }


  porId("evaluacion-aprender")
    .classList.remove("oculto");
}


// ------------------------------------------------------
// EVALUACIÓN APRENDER
// ------------------------------------------------------

porId("aprender-bien")
  .addEventListener("click", () => {

    const item =
      listaActual[indiceAprender];

    agregarUnico(
      dominados,
      item.id
    );

    quitar(
      dificiles,
      item.id
    );

    guardarProgreso();

    siguienteAprender();

  });


porId("aprender-dificil")
  .addEventListener("click", () => {

    const item =
      listaActual[indiceAprender];

    agregarUnico(
      dificiles,
      item.id
    );

    quitar(
      dominados,
      item.id
    );

    guardarProgreso();


    const boton =
      porId("aprender-dificil");

    const textoOriginal =
      boton.textContent;

    boton.textContent =
      "★ Marcado difícil";


    setTimeout(() => {

      boton.textContent =
        textoOriginal;

      siguienteAprender();

    }, 700);

  });


porId("aprender-repetir")
  .addEventListener("click", () => {

    cargarAprender();

  });


// ------------------------------------------------------
// ANTERIOR / SIGUIENTE
// ------------------------------------------------------

function siguienteAprender() {

  indiceAprender++;

  if (
    indiceAprender >=
    listaActual.length
  ) {
    indiceAprender = 0;
  }

  cargarAprender();
}


function anteriorAprender() {

  indiceAprender--;

  if (indiceAprender < 0) {
    indiceAprender =
      listaActual.length - 1;
  }

  cargarAprender();
}


porId("aprender-siguiente")
  .addEventListener(
    "click",
    siguienteAprender
  );


porId("aprender-anterior")
  .addEventListener(
    "click",
    anteriorAprender
  );


// ------------------------------------------------------
// SELECTOR APRENDER
// ------------------------------------------------------

porId("selector-cuadro")
  .addEventListener("change", evento => {

    listaActual =
      filtrarGuion(
        evento.target.value
      );

    indiceAprender = 0;

    cargarAprender();

  });


// ======================================================
// VOZ
// ======================================================

let vocesDisponibles = [];

function cargarVoces() {
  vocesDisponibles = speechSynthesis.getVoices();
}

cargarVoces();

speechSynthesis.onvoiceschanged = () => {
  cargarVoces();
};


function hablar(texto, personaje = "") {

  if (!("speechSynthesis" in window)) {
    alert("Este navegador no permite lectura por voz.");
    return;
  }

  speechSynthesis.cancel();

  const mensaje =
    new SpeechSynthesisUtterance(texto);

  const nombrePersonaje =
    personaje
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const personajesFemeninos = [
    "pieta",
    "marcela",
    "niñita",
    "ninita"
  ];

  const esFemenino =
    personajesFemeninos.includes(nombrePersonaje);


  // VELOCIDAD
  const controlVelocidad =
    porId("velocidad-voz");

  mensaje.rate =
    controlVelocidad
      ? Number(controlVelocidad.value)
      : 0.9;

  mensaje.pitch = 1;


  // VOZ
  cargarVoces();

  let vozElegida = null;

  if (esFemenino) {

    vozElegida =
      vocesDisponibles.find(voz =>
        voz.name.includes("Microsoft Sabina")
      );

  } else {

    vozElegida =
      vocesDisponibles.find(voz =>
        voz.name.includes("Microsoft Raul")
      );
  }


  if (vozElegida) {

    mensaje.voice = vozElegida;

    // Usamos el idioma REAL de esa voz
    mensaje.lang = vozElegida.lang;

  } else {

    console.warn(
      "No encontré la voz correcta para:",
      personaje
    );

    mensaje.lang = "es-MX";
  }


  mensaje.onend = () => {

    const boton =
      porId("aprender-pausar");

    if (boton) {
      boton.textContent = "▶";
    }

    vozPausada = false;
  };


  speechSynthesis.speak(mensaje);
}
// ------------------------------------------------------
// PLAY / PAUSA DEL PIE
// ------------------------------------------------------

let vozPausada = false;

function playPausaAprender() {

  const boton =
    porId("aprender-pausar");

  // Si está hablando, PAUSAR
  if (
    speechSynthesis.speaking &&
    !speechSynthesis.paused
  ) {

    speechSynthesis.pause();

    vozPausada = true;

    boton.textContent = "▶";

    return;
  }


  // Si estaba pausado, CONTINUAR
  if (speechSynthesis.paused) {

    speechSynthesis.resume();

    vozPausada = false;

    boton.textContent = "⏸";

    return;
  }


  // Si no estaba hablando, comenzar el pie actual
  const item =
    listaActual[indiceAprender];

  boton.textContent = "⏸";

  hablar(
    item.pie,
    item.personajePie
  );
}


porId("aprender-pausar")
  .addEventListener(
    "click",
    playPausaAprender
  );
// ======================================================
// RECONOCIMIENTO DE VOZ · MICRÓFONO
// ======================================================

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

const botonHablar = porId("hablar-texto");
const estadoMicrofono = porId("estado-microfono");
const textoReconocido = porId("texto-reconocido");

let reconocimiento = null;


// ------------------------------------------------------
// NORMALIZAR TEXTO
// ------------------------------------------------------

function normalizarTexto(texto) {

  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:()"…—-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}


// ------------------------------------------------------
// CALCULAR COINCIDENCIA
// ------------------------------------------------------

function calcularCoincidencia(dicho, correcto) {

  const palabrasDichas =
    normalizarTexto(dicho).split(" ");

  const palabrasCorrectas =
    normalizarTexto(correcto).split(" ");

  if (!palabrasCorrectas.length) {
    return 0;
  }

  let coincidencias = 0;

  palabrasCorrectas.forEach(palabra => {

    if (palabrasDichas.includes(palabra)) {
      coincidencias++;
    }

  });

  return coincidencias / palabrasCorrectas.length;
}


// ------------------------------------------------------
// EVALUAR LO QUE DIJO EL ACTOR
// ------------------------------------------------------

function evaluarVoz(textoDicho) {

  const item =
    listaActual[indiceAprender];

  const porcentaje =
    calcularCoincidencia(
      textoDicho,
      item.lucas
    );


  if (porcentaje >= 0.90) {

    estadoMicrofono.textContent =
      `✓ ¡Muy bien! ${Math.round(porcentaje * 100)}%`;

    estadoMicrofono.classList.remove("oculto");

    agregarUnico(
      dominados,
      item.id
    );

    quitar(
      dificiles,
      item.id
    );

    guardarProgreso();


    setTimeout(() => {

  estadoMicrofono.classList.add("oculto");

  textoReconocido.classList.add("oculto");

  siguienteAprender();

  // Si fue perfecto, leer automáticamente
  // el pie del siguiente parlamento.
  setTimeout(() => {

  const siguiente =
    listaActual[indiceAprender];

  hablar(
    siguiente.pie,
    siguiente.personajePie
  );

}, 400);

}, 1200);

  }

  else {

    estadoMicrofono.textContent =
      `↻ Coincidencia: ${Math.round(porcentaje * 100)}%. Inténtalo otra vez.`;

    estadoMicrofono.classList.remove("oculto");

  }

}


// ------------------------------------------------------
// CONFIGURAR MICRÓFONO
// ------------------------------------------------------

if (SpeechRecognition && botonHablar) {

  reconocimiento =
    new SpeechRecognition();

  reconocimiento.lang = "es-CL";

  reconocimiento.continuous = false;

  reconocimiento.interimResults = true;


  botonHablar.addEventListener(
    "click",
    () => {

      try {

        textoReconocido.textContent = "";

        textoReconocido
          .classList
          .remove("oculto");


        estadoMicrofono.textContent =
          "🎤 Escuchando...";

        estadoMicrofono
          .classList
          .remove("oculto");


        botonHablar.textContent =
          "🎤 Escuchando...";


        reconocimiento.start();

      }

      catch (error) {

        console.error(
          "Error al iniciar micrófono:",
          error
        );

      }

    }
  );


  reconocimiento.onresult =
    evento => {

      let texto = "";

      for (
        let i = evento.resultIndex;
        i < evento.results.length;
        i++
      ) {

        texto +=
          evento.results[i][0].transcript;

      }


      textoReconocido.textContent =
        texto;


      const ultimoResultado =
        evento.results[
          evento.results.length - 1
        ];


      // Chrome considera que terminaste
      // de pronunciar la frase.

      if (ultimoResultado.isFinal) {

        botonHablar.textContent =
          "🎤 Hablar";

        reconocimiento.stop();

        evaluarVoz(texto);

      }

    };


  reconocimiento.onend = () => {

    botonHablar.textContent =
      "🎤 Hablar";

  };


  reconocimiento.onerror =
    evento => {

      console.error(
        "Error reconocimiento:",
        evento.error
      );

      estadoMicrofono.textContent =
        `Error de micrófono: ${evento.error}`;

      estadoMicrofono
        .classList
        .remove("oculto");

      botonHablar.textContent =
        "🎤 Hablar";

    };

}

else if (botonHablar) {

  botonHablar.disabled = true;

  botonHablar.textContent =
    "🎤 Micrófono no disponible";

}
// ======================================================
// MODO ENSAYO
// ======================================================

let listaEnsayo = [...guion];


function cargarEnsayo() {

  if (!listaEnsayo.length) {
    return;
  }


  if (indiceEnsayo < 0) {
    indiceEnsayo =
      listaEnsayo.length - 1;
  }


  if (
    indiceEnsayo >=
    listaEnsayo.length
  ) {
    indiceEnsayo = 0;
  }


  const item =
    listaEnsayo[indiceEnsayo];


  porId("ensayo-numero").textContent =
    indiceEnsayo + 1;

  porId("ensayo-total").textContent =
    listaEnsayo.length;

  porId("ensayo-personaje").textContent =
    item.personajePie.toUpperCase();

  porId("ensayo-pie").textContent =
    item.pie;


  const texto =
    porId("ensayo-texto-lucas");

  texto.textContent =
    "••••••••••••••••";

  texto.className =
    "respuesta-oculta";


  porId("ensayo-evaluacion")
    .classList.add("oculto");
}


// ------------------------------------------------------
// ESCUCHAR PIE
// ------------------------------------------------------

porId("ensayo-escuchar")
  .addEventListener("click", () => {

    const item =
      listaEnsayo[indiceEnsayo];

    hablar(
  item.pie,
  item.personajePie
);

  });


// ------------------------------------------------------
// MOSTRAR TEXTO
// ------------------------------------------------------

porId("ensayo-mostrar")
  .addEventListener("click", () => {

    const item =
      listaEnsayo[indiceEnsayo];

    const texto =
      porId("ensayo-texto-lucas");

    texto.textContent =
      item.lucas;

    texto.className =
      "respuesta-visible";


    porId("ensayo-evaluacion")
      .classList.remove("oculto");

  });


// ------------------------------------------------------
// RESULTADOS ENSAYO
// ------------------------------------------------------

function siguienteEnsayo() {

  indiceEnsayo++;

  if (
    indiceEnsayo >=
    listaEnsayo.length
  ) {
    indiceEnsayo = 0;
  }

  cargarEnsayo();
}


porId("ensayo-bien")
  .addEventListener("click", () => {

    const item =
      listaEnsayo[indiceEnsayo];

    agregarUnico(
      dominados,
      item.id
    );

    quitar(
      dificiles,
      item.id
    );

    guardarProgreso();

    siguienteEnsayo();

  });


porId("ensayo-dificil")
  .addEventListener("click", () => {

    const item =
      listaEnsayo[indiceEnsayo];

    agregarUnico(
      dificiles,
      item.id
    );

    quitar(
      dominados,
      item.id
    );

    guardarProgreso();

    siguienteEnsayo();

  });


porId("ensayo-repetir")
  .addEventListener("click", () => {

    cargarEnsayo();

  });


// ------------------------------------------------------
// SELECTOR ENSAYO
// ------------------------------------------------------

porId("selector-ensayo")
  .addEventListener("change", evento => {

    listaEnsayo =
      filtrarGuion(
        evento.target.value
      );

    indiceEnsayo = 0;

    cargarEnsayo();

  });


// ======================================================
// MIS TEXTOS
// ======================================================

function cargarListaTextos() {

  const contenedor =
    porId("lista-textos");

  const busqueda =
    porId("buscar-texto")
      .value
      .trim()
      .toLowerCase();


  let resultados =
    guion.filter(item => {

      if (
        filtroTextos === "dificiles" &&
        !estaDificil(item.id)
      ) {
        return false;
      }


      if (
        filtroTextos === "dominados" &&
        !estaDominado(item.id)
      ) {
        return false;
      }


      if (busqueda) {

        const textoCompleto =
          `${item.lucas} ${item.pie} ${item.personajePie}`
            .toLowerCase();

        if (
          !textoCompleto.includes(
            busqueda
          )
        ) {
          return false;
        }

      }


      return true;

    });


  porId("cantidad-textos").textContent =
    resultados.length;


  if (!resultados.length) {

    contenedor.innerHTML = `
      <p class="sin-dificiles">
        No se encontraron parlamentos.
      </p>
    `;

    return;
  }


  contenedor.innerHTML =
    resultados
      .map(item => {

        let estado = "";

        if (estaDominado(item.id)) {
          estado = "✓ Dominado";
        }

        else if (estaDificil(item.id)) {
          estado = "★ Difícil";
        }


        const acotacion =
          item.acotacion
            ? `
              <span class="acotacion-lista">
                (${escaparHTML(item.acotacion)})
              </span>
            `
            : "";


        return `
          <article class="texto-item">

            <div class="texto-item-cabecera">

              <span class="texto-numero">
                #${item.id}
                · ACTO ${item.acto}
                · CUADRO ${item.cuadro}
              </span>

              <span class="texto-estado">
                ${estado}
              </span>

            </div>

            <p>
              ${escaparHTML(item.lucas)}
            </p>

            ${acotacion}

          </article>
        `;

      })
      .join("");
}


// ------------------------------------------------------
// BUSCADOR
// ------------------------------------------------------

porId("buscar-texto")
  .addEventListener(
    "input",
    cargarListaTextos
  );


// ------------------------------------------------------
// FILTROS
// ------------------------------------------------------

document
  .querySelectorAll(".filtro-texto")
  .forEach(boton => {

    boton.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".filtro-texto"
          )
          .forEach(b => {
            b.classList.remove(
              "activo"
            );
          });


        boton.classList.add(
          "activo"
        );


        filtroTextos =
          boton.dataset.filtro;


        cargarListaTextos();

      }
    );

  });


// ======================================================
// PROGRESO
// ======================================================

function actualizarProgreso() {

  // Eliminar IDs antiguos
  // que ya no existan en el guion.

  const idsValidos =
    guion.map(item => item.id);


  dominados =
    dominados.filter(id =>
      idsValidos.includes(id)
    );


  dificiles =
    dificiles.filter(id =>
      idsValidos.includes(id)
    );


  const total =
    guion.length;

  const aprendidos =
    dominados.length;

  const cantidadDificiles =
    dificiles.length;


  const porcentaje =
    total
      ? Math.round(
          (aprendidos / total) * 100
        )
      : 0;


  // HEADER

  porId(
    "porcentaje-header"
  ).textContent =
    `${porcentaje}%`;


  // INICIO

  porId(
    "inicio-total"
  ).textContent =
    total;

  porId(
    "inicio-dominados"
  ).textContent =
    aprendidos;

  porId(
    "inicio-dificiles"
  ).textContent =
    cantidadDificiles;

  porId(
    "inicio-porcentaje"
  ).textContent =
    `${porcentaje}%`;


  // PROGRESO

  porId(
    "progreso-porcentaje"
  ).textContent =
    `${porcentaje}%`;

  porId(
    "progreso-fraccion"
  ).textContent =
    `${aprendidos} / ${total}`;

  porId(
    "barra-progreso"
  ).style.width =
    `${porcentaje}%`;


  // ESTADÍSTICAS

  porId(
    "estadistica-total"
  ).textContent =
    total;

  porId(
    "estadistica-dominados"
  ).textContent =
    aprendidos;

  porId(
    "estadistica-dificiles"
  ).textContent =
    cantidadDificiles;


  // Totales de pantallas

  porId(
    "aprender-total"
  ).textContent =
    listaActual.length;

  porId(
    "ensayo-total"
  ).textContent =
    listaEnsayo.length;


  cargarListaDificiles();
}


// ------------------------------------------------------
// LISTA DE DIFÍCILES
// ------------------------------------------------------

function cargarListaDificiles() {

  const contenedor =
    porId("lista-dificiles");


  const items =
    guion.filter(item =>
      estaDificil(item.id)
    );


  if (!items.length) {

    contenedor.innerHTML = `
      <p class="sin-dificiles">
        Todavía no has marcado ningún
        parlamento como difícil.
      </p>
    `;

    return;
  }


  contenedor.innerHTML =
    items
      .slice(0, 8)
      .map(item => `
        <article class="texto-item">

          <div class="texto-item-cabecera">

            <span class="texto-numero">
              #${item.id}
            </span>

            <span class="texto-estado">
              ★ Difícil
            </span>

          </div>

          <p>
            ${escaparHTML(item.lucas)}
          </p>

        </article>
      `)
      .join("");
}


// ------------------------------------------------------
// PRACTICAR DIFÍCILES
// ------------------------------------------------------

porId("practicar-dificiles")
  .addEventListener("click", () => {

    const lista =
      guion.filter(item =>
        estaDificil(item.id)
      );


    if (!lista.length) {

      alert(
        "Todavía no tienes parlamentos marcados como difíciles."
      );

      return;
    }


    listaActual = lista;

    indiceAprender = 0;

    cargarAprender();

    abrirPantalla("aprender");

  });


// ======================================================
// TECLADO
// ======================================================

document.addEventListener(
  "keydown",
  evento => {

    const pantallaAprender =
      porId("aprender")
        .classList
        .contains("activa");


    if (!pantallaAprender) {
      return;
    }


    // ESPACIO = mostrar texto

    if (
      evento.code === "Space" &&
      evento.target.tagName !== "INPUT"
    ) {

      evento.preventDefault();

      mostrarRespuestaAprender();

    }


    // Flecha derecha

    if (
      evento.code === "ArrowRight"
    ) {

      siguienteAprender();

    }


    // Flecha izquierda

    if (
      evento.code === "ArrowLeft"
    ) {

      anteriorAprender();

    }

  }
);


// ======================================================
// INICIALIZACIÓN
// ======================================================

function iniciarAplicacion() {

  listaActual = [...guion];
  listaEnsayo = [...guion];

  indiceAprender = 0;
  indiceEnsayo = 0;


  cargarAprender();

  cargarEnsayo();

  cargarListaTextos();

  actualizarProgreso();


  console.log(
    `Lucas Meyer: ${guion.length} parlamentos cargados.`
  );
}


iniciarAplicacion();