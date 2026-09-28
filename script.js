// ======================================================
// LUCAS MEYER · ENTRENADOR DE GUION
// ======================================================


// ------------------------------------------------------
// ESTADO
// ------------------------------------------------------

let listaActual = [...guion];
let indiceAprender =
  Number(
    localStorage.getItem("ultimoParlamentoAprender")
  ) || 0;
let indiceEnsayo =
  Number(
    localStorage.getItem("ultimoParlamentoEnsayo")
  ) || 0;

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

// Recordar el parlamento actual de Aprender
localStorage.setItem(
  "ultimoParlamentoAprender",
  String(indiceAprender)
);

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
// ------------------------------------------------------
// REINICIAR / IR A PARLAMENTO
// ------------------------------------------------------

const panelParlamentos =
  porId("panel-parlamentos");

const listaSelectorParlamentos =
  porId("lista-selector-parlamentos");

const vistaPreviaParlamento =
  porId("vista-previa-parlamento");

const buscarParlamento =
  porId("buscar-parlamento");


// ------------------------------------------------------
// REINICIAR DESDE EL PRIMER PARLAMENTO
// ------------------------------------------------------

porId("reiniciar-aprender")
  .addEventListener("click", () => {

    speechSynthesis.cancel();

    indiceAprender = 0;

    cargarAprender();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });


// ------------------------------------------------------
// ABRIR SELECTOR
// ------------------------------------------------------

porId("abrir-selector-parlamento")
  .addEventListener("click", () => {

    panelParlamentos.classList.remove("oculto");

    buscarParlamento.value = "";

    vistaPreviaParlamento.classList.add("oculto");

    vistaPreviaParlamento.innerHTML = "";

        cargarSelectorParlamentos();

    // Llevar la lista automáticamente al parlamento actual
    setTimeout(() => {

      const parlamentoActual =
        listaSelectorParlamentos.querySelector(
          `[data-indice="${indiceAprender}"]`
        );

      if (parlamentoActual) {

        parlamentoActual.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      }

    }, 50);

    buscarParlamento.focus();

  });


// ------------------------------------------------------
// CERRAR SELECTOR
// ------------------------------------------------------

porId("cerrar-selector-parlamento")
  .addEventListener("click", () => {

    panelParlamentos.classList.add("oculto");

  });


// ------------------------------------------------------
// CREAR LISTA
// ------------------------------------------------------

function cargarSelectorParlamentos() {

  const busqueda =
    normalizarTexto(
      buscarParlamento.value
    );

  const resultados =
    listaActual.filter((item, indice) => {

      if (!busqueda) {
        return true;
      }

      const numero =
        String(indice + 1);

      const contenido =
        normalizarTexto(
          `${item.personajePie} ${item.pie} ${item.lucas} ${item.acotacion || ""}`
        );

      return (
        numero.includes(busqueda) ||
        contenido.includes(busqueda)
      );

    });


  if (!resultados.length) {

    listaSelectorParlamentos.innerHTML = `
      <p class="sin-dificiles">
        No encontré ningún parlamento.
      </p>
    `;

    return;
  }


  listaSelectorParlamentos.innerHTML =
    resultados.map(item => {

      const indiceReal =
        listaActual.findIndex(
          elemento => elemento.id === item.id
        );

      const comienzoPie =
        item.pie.length > 75
          ? `${item.pie.slice(0, 75)}…`
          : item.pie;

      return `
        <button
          type="button"
          class="opcion-parlamento"
          data-indice="${indiceReal}"
        >

          <strong>
            #${indiceReal + 1}
            ·
            ${escaparHTML(
              item.personajePie.toUpperCase()
            )}
          </strong>

          <span>
            ${escaparHTML(comienzoPie)}
          </span>

        </button>
      `;

    }).join("");


  document
    .querySelectorAll(".opcion-parlamento")
    .forEach(boton => {

      boton.addEventListener("click", () => {

        mostrarVistaPreviaParlamento(
          Number(boton.dataset.indice)
        );

      });

    });

}


// ------------------------------------------------------
// BUSCAR MIENTRAS ESCRIBES
// ------------------------------------------------------

buscarParlamento
  .addEventListener(
    "input",
    cargarSelectorParlamentos
  );


// ------------------------------------------------------
// VISTA PREVIA COMPLETA
// ------------------------------------------------------

function mostrarVistaPreviaParlamento(indice) {

  const item =
    listaActual[indice];

  if (!item) {
    return;
  }


  const acotacion =
    item.acotacion &&
    item.acotacion.trim() !== ""
      ? `
          <div class="selector-acotacion">
            <strong>Acotación</strong>
            <p>
              (${escaparHTML(item.acotacion)})
            </p>
          </div>
        `
      : "";


  vistaPreviaParlamento.innerHTML = `

    <div class="vista-previa-cabecera">

      <strong>
        Parlamento #${indice + 1}
      </strong>

      <span>
        Acto ${item.acto}
        · Cuadro ${item.cuadro}
      </span>

    </div>


    <div class="selector-pie">

      <strong>
        ${escaparHTML(
          item.personajePie.toUpperCase()
        )}
      </strong>

      <p>
        ${escaparHTML(item.pie)}
      </p>

    </div>


    <div class="selector-lucas">

      <strong>
        LUCAS MEYER
      </strong>

      <p>
        ${escaparHTML(item.lucas)}
      </p>

    </div>


    ${acotacion}


    <button
      type="button"
      id="confirmar-ir-parlamento"
      class="confirmar-ir-parlamento"
    >
      Ir al parlamento #${indice + 1}
    </button>

  `;


  vistaPreviaParlamento
    .classList
    .remove("oculto");


  porId("confirmar-ir-parlamento")
    .addEventListener("click", () => {

      speechSynthesis.cancel();

      indiceAprender = indice;

      cargarAprender();

      panelParlamentos.classList.add("oculto");

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });


  vistaPreviaParlamento.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

}
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





// ------------------------------------------------------
// CONTROL DE VELOCIDAD - ENSAYAR
// ------------------------------------------------------

const controlVelocidadVoz =
  porId("velocidad-voz");

const valorVelocidadVoz =
  porId("valor-velocidad");

if (controlVelocidadVoz && valorVelocidadVoz) {

  // Recuperar velocidad guardada
  const velocidadGuardada =
    localStorage.getItem("velocidadVozAprender");

  if (velocidadGuardada !== null) {
    controlVelocidadVoz.value =
      velocidadGuardada;
  }

  valorVelocidadVoz.textContent =
    `${Number(controlVelocidadVoz.value).toFixed(1)}×`;

  controlVelocidadVoz.addEventListener(
    "input",
    () => {

      valorVelocidadVoz.textContent =
        `${Number(controlVelocidadVoz.value).toFixed(1)}×`;

      // Guardar velocidad elegida
      localStorage.setItem(
        "velocidadVozAprender",
        controlVelocidadVoz.value
      );

    }
  );

}

// ------------------------------------------------------
// CONTROL DE VELOCIDAD - ENSAYAR
// ------------------------------------------------------

const controlVelocidadEnsayo =
  porId("velocidad-voz-ensayo");

const valorVelocidadEnsayo =
  porId("valor-velocidad-ensayo");

if (controlVelocidadEnsayo && valorVelocidadEnsayo) {

  // Recuperar velocidad guardada
  const velocidadGuardadaEnsayo =
    localStorage.getItem("velocidadVozEnsayo");

  if (velocidadGuardadaEnsayo !== null) {
    controlVelocidadEnsayo.value =
      velocidadGuardadaEnsayo;
  }

  valorVelocidadEnsayo.textContent =
    `${Number(controlVelocidadEnsayo.value).toFixed(1)}×`;

  controlVelocidadEnsayo.addEventListener(
    "input",
    () => {

      valorVelocidadEnsayo.textContent =
        `${Number(controlVelocidadEnsayo.value).toFixed(1)}×`;

      localStorage.setItem(
        "velocidadVozEnsayo",
        controlVelocidadEnsayo.value
      );

    }
  );

}

// ------------------------------------------------------
// VOCES DISPONIBLES
// ------------------------------------------------------

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
  let velocidadElegida = 1.0;

const pantallaEnsayo =
  porId("ensayar");

const estamosEnsayando =
  pantallaEnsayo &&
  pantallaEnsayo.classList.contains("activa");

if (
  estamosEnsayando &&
  controlVelocidadEnsayo
) {

  velocidadElegida =
    Number(controlVelocidadEnsayo.value);

} else {

  const controlVelocidadAprender =
    porId("velocidad-voz");

  if (controlVelocidadAprender) {
    velocidadElegida =
      Number(controlVelocidadAprender.value);
  }

}

mensaje.rate = velocidadElegida;

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

  // Preferencia 1: Microsoft Raul
  vozElegida =
    vocesDisponibles.find(voz =>
      voz.name.toLowerCase().includes("raul")
    );

  // Preferencia 2: otras voces masculinas conocidas
  if (!vozElegida) {

    const nombresMasculinos = [
      "jorge",
      "pablo",
      "diego",
      "carlos",
      "andres",
      "alvaro"
    ];

    vozElegida =
      vocesDisponibles.find(voz => {

        const nombre =
          voz.name.toLowerCase();

        return nombresMasculinos.some(
          masculino =>
            nombre.includes(masculino)
        );

      });

  }

}


  if (vozElegida) {
    console.log(
  "PERSONAJE:",
  personaje,
  "→ VOZ:",
  vozElegida.name,
  "→ IDIOMA:",
  vozElegida.lang
);

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

  const botonAprender =
    porId("aprender-pausar");

  const botonEnsayo =
    porId("ensayo-pausar");

  if (botonAprender) {
    botonAprender.textContent = "▶";
  }

  if (botonEnsayo) {
    botonEnsayo.textContent = "▶";
  }

  vozPausada = false;
  vozPausadaEnsayo = false;


  // Si estamos en Modo Ensayar y el ensayo
  // automático está activo, ahora es turno de Lucas.

  const pantallaEnsayo =
    porId("ensayar");

  const estamosEnsayando =
    pantallaEnsayo &&
    pantallaEnsayo.classList.contains("activa");

  if (
    estamosEnsayando &&
    ensayoAutomatico
  ) {

    setTimeout(() => {
      iniciarMicrofonoEnsayo();
    }, 350);

  }

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

function normalizarTexto(texto = "") {

  const digitos = {
    "0": "cero",
    "1": "uno",
    "2": "dos",
    "3": "tres",
    "4": "cuatro",
    "5": "cinco",
    "6": "seis",
    "7": "siete",
    "8": "ocho",
    "9": "nueve"
  };

  let resultado = String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Convierte cualquier grupo numérico dígito por dígito.
  // 123 -> uno dos tres
  // 1 2 3 -> uno dos tres
  resultado = resultado.replace(
    /\d+/g,
    numero =>
      numero
        .split("")
        .map(digito => digitos[digito] || digito)
        .join(" ")
  );

  // Quitar puntuación y símbolos.
  resultado = resultado
    .replace(/[¿?¡!.,;:()"“”'…—–\-_/\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return resultado;
}


// ------------------------------------------------------
// CALCULAR COINCIDENCIA
// ------------------------------------------------------

// ------------------------------------------------------
// COMPARAR PALABRAS CON PEQUEÑOS ERRORES
// ------------------------------------------------------

function palabrasParecidas(a, b) {

  if (a === b) {
    return true;
  }

  // No ser permisivos con palabras muy cortas:
  // "no", "si", "yo", etc. deben coincidir.
  if (a.length <= 3 || b.length <= 3) {
    return false;
  }

  // Diferencia máxima de longitud
  if (Math.abs(a.length - b.length) > 1) {
    return false;
  }

  // Distancia de edición (Levenshtein)
  const matriz = Array.from(
    { length: a.length + 1 },
    () => Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) {
    matriz[i][0] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matriz[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {

    for (let j = 1; j <= b.length; j++) {

      const costo =
        a[i - 1] === b[j - 1]
          ? 0
          : 1;

      matriz[i][j] = Math.min(
        matriz[i - 1][j] + 1,
        matriz[i][j - 1] + 1,
        matriz[i - 1][j - 1] + costo
      );

    }

  }

  const distancia =
    matriz[a.length][b.length];

  // Una letra de diferencia como máximo.
  return distancia <= 1;
}

function calcularCoincidencia(dicho, correcto) {

  const palabrasDichas =
    normalizarTexto(dicho)
      .split(" ")
      .filter(Boolean);

  const palabrasCorrectas =
    normalizarTexto(correcto)
      .split(" ")
      .filter(Boolean);

  if (!palabrasCorrectas.length) {
    return 0;
  }

  // Compara respetando el orden de las palabras.
  // Permite que el reconocimiento agregue u omita
  // alguna palabra sin arruinar toda la comparación.

  const filas =
    palabrasCorrectas.length + 1;

  const columnas =
    palabrasDichas.length + 1;

  const matriz =
    Array.from(
      { length: filas },
      () => Array(columnas).fill(0)
    );

  for (let i = 1; i < filas; i++) {

    for (let j = 1; j < columnas; j++) {

      if (
  palabrasParecidas(
    palabrasCorrectas[i - 1],
    palabrasDichas[j - 1]
  )
) {

        matriz[i][j] =
          matriz[i - 1][j - 1] + 1;

      } else {

        matriz[i][j] =
          Math.max(
            matriz[i - 1][j],
            matriz[i][j - 1]
          );

      }

    }

  }

  const coincidencias =
    matriz[filas - 1][columnas - 1];

  return (
    coincidencias /
    palabrasCorrectas.length
  );
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

    // GUARDAR HISTORIAL DEL PARLAMENTO

const historialEnsayo =
  JSON.parse(
    localStorage.getItem("historialEnsayoLucas") || "{}"
  );

const resultadoGuardado =
  historialEnsayo[item.id] || {
    ultimo: 0,
    mejor: 0,
    intentos: 0
  };

const porcentajeEntero =
  Math.round(porcentaje * 100);

historialEnsayo[item.id] = {
  ultimo: porcentajeEntero,
  mejor: Math.max(
    resultadoGuardado.mejor,
    porcentajeEntero
  ),
  intentos: resultadoGuardado.intentos + 1
};

localStorage.setItem(
  "historialEnsayoLucas",
  JSON.stringify(historialEnsayo)
);


  if (porcentaje >= 0.80) {

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

// ------------------------------------------------------
// MICRÓFONO AUTOMÁTICO - ENSAYAR
// ------------------------------------------------------

let reconocimientoEnsayo = null;
let ensayoAutomatico = false;
let escuchandoEnsayo = false;
let textoAcumuladoEnsayo = "";
let textoIntermedioEnsayo = "";


function iniciarMicrofonoEnsayo() {

  if (!SpeechRecognition) {
    console.warn("Reconocimiento de voz no disponible.");
    return;
  }

  if (escuchandoEnsayo) {
    return;
  }

  // Solo funcionar dentro de Modo Ensayar
  const pantallaEnsayo =
    porId("ensayar");

  if (
    !pantallaEnsayo ||
    !pantallaEnsayo.classList.contains("activa")
  ) {
    return;
  }


  if (!reconocimientoEnsayo) {

    reconocimientoEnsayo =
      new SpeechRecognition();

    reconocimientoEnsayo.lang = "es-CL";
    reconocimientoEnsayo.continuous = true;
    reconocimientoEnsayo.interimResults = true;


    reconocimientoEnsayo.onstart = () => {

      escuchandoEnsayo = true;
      textoAcumuladoEnsayo = "";

const botonTermine =
  porId("ensayo-termine");

if (botonTermine) {
  botonTermine.classList.remove("oculto");
}

      const estado =
        porId("estado-microfono-ensayo");

      if (estado) {
        estado.textContent = "🎤 Tu turno. Habla...";
        estado.classList.remove("oculto");
      }

    };


    reconocimientoEnsayo.onresult = evento => {

  textoIntermedioEnsayo = "";

  for (
    let i = evento.resultIndex;
    i < evento.results.length;
    i++
  ) {

    const fragmento =
      evento.results[i][0].transcript;

    if (evento.results[i].isFinal) {

      textoAcumuladoEnsayo +=
        " " + fragmento;

    } else {

      textoIntermedioEnsayo +=
  " " + fragmento;

    }

  }

  const textoCompleto =
    (
      textoAcumuladoEnsayo +
      " " +
      textoIntermedioEnsayo
    )
      .replace(/\s+/g, " ")
      .trim();

const transcripcion =
  porId("texto-reconocido-ensayo");

if (transcripcion) {

  transcripcion.textContent =
    textoCompleto;

  transcripcion.classList.remove("oculto");
}

}; // ← cierra reconocimientoEnsayo.onresult


reconocimientoEnsayo.onend = () => {

  escuchandoEnsayo = false;

  // Mientras el ensayo siga activo, el micrófono
  // debe volver a quedar escuchando automáticamente.
  if (ensayoAutomatico) {

    const pantallaEnsayo =
      porId("ensayar");

    const seguimosEnsayando =
      pantallaEnsayo &&
      pantallaEnsayo.classList.contains("activa");

    if (seguimosEnsayando) {

      setTimeout(() => {
        iniciarMicrofonoEnsayo();
      }, 250);

    }

  }

};


reconocimientoEnsayo.onerror = evento => {

  escuchandoEnsayo = false;

  // "no-speech" significa solamente que el actor
  // estuvo un rato sin hablar. No es un error.
  if (evento.error === "no-speech") {

    const estado =
      porId("estado-microfono-ensayo");

    if (estado) {
      estado.textContent = "🎤 Tu turno. Habla...";
      estado.classList.remove("oculto");
    }

    return;
  }


  // Los errores reales sí se muestran.
  console.error(
    "Error reconocimiento ensayo:",
    evento.error
  );

  const estado =
    porId("estado-microfono-ensayo");

  if (estado) {

    estado.textContent =
      `Error de micrófono: ${evento.error}`;

    estado.classList.remove("oculto");

  }

};

  }


  try {

    reconocimientoEnsayo.start();

  } catch (error) {

    console.error(
      "No se pudo iniciar el micrófono de ensayo:",
      error
    );

  }

}

// ------------------------------------------------------
// TERMINÉ DE DECIR MI PARLAMENTO
// ------------------------------------------------------

const botonTermineEnsayo =
  porId("ensayo-termine");

if (botonTermineEnsayo) {

  botonTermineEnsayo.addEventListener(
    "click",
    () => {

      if (!escuchandoEnsayo) {
        return;
      }

      const textoFinal =
  (
    textoAcumuladoEnsayo +
    " " +
    textoIntermedioEnsayo
  )
    .replace(/\s+/g, " ")
    .trim();

      if (!textoFinal) {
        return;
      }

      botonTermineEnsayo.classList.add("oculto");

      escuchandoEnsayo = false;

      try {
        reconocimientoEnsayo.stop();
      } catch (error) {
        console.warn(error);
      }

      evaluarVozEnsayo(textoFinal);

    }
  );

}


// ------------------------------------------------------
// EVALUAR RESPUESTA EN ENSAYO
// ------------------------------------------------------

function evaluarVozEnsayo(textoDicho) {

  const item =
    listaEnsayo[indiceEnsayo];

  if (!item) {
    return;
  }


  const porcentaje =
    calcularCoincidencia(
      textoDicho,
      item.lucas
    );
    // ------------------------------------------------------
// GUARDAR RESULTADO PARA MANTENERLO VISIBLE
// DURANTE EL SIGUIENTE PARLAMENTO
// ------------------------------------------------------

const resultadoAnterior =
  porId("resultado-anterior-ensayo");

const resultadoPorcentaje =
  porId("resultado-anterior-porcentaje");

const resultadoDicho =
  porId("resultado-anterior-dicho");

const resultadoOriginal =
  porId("resultado-anterior-original");

if (
  resultadoAnterior &&
  resultadoPorcentaje &&
  resultadoDicho &&
  resultadoOriginal
) {

  resultadoPorcentaje.textContent =
    `${Math.round(porcentaje * 100)}%`;

  resultadoDicho.textContent =
    textoDicho;

  resultadoOriginal.textContent =
    item.lucas;

  resultadoAnterior.classList.remove("oculto");
}


  const estado =
    porId("estado-microfono-ensayo");
    // Mostrar el parlamento original después de hablar
const textoOriginal =
  porId("ensayo-texto-lucas");

if (textoOriginal) {

  textoOriginal.innerHTML = `
    <span class="etiqueta-original">
      TEXTO ORIGINAL
    </span>

    <div class="texto-original-ensayo">
      ${escaparHTML(item.lucas)}
    </div>
  `;

  textoOriginal.className =
    "respuesta-visible";
}


// Mostrar claramente lo que entendió Chrome
const textoReconocido =
  porId("texto-reconocido-ensayo");

if (textoReconocido) {

  textoReconocido.innerHTML = `
    <span class="etiqueta-original">
      ENTENDÍ
    </span>

    <div>
      ${escaparHTML(textoDicho)}
    </div>
  `;

  textoReconocido.classList.remove("oculto");
}


  // ------------------------------------------------------
// RESULTADO DEL PARLAMENTO
// En modo Ensayar SIEMPRE continuamos.
// El porcentaje sirve para evaluar, no para bloquear.
// ------------------------------------------------------

const porcentajeNumero =
  Math.round(porcentaje * 100);

if (estado) {

  if (porcentaje >= 0.95) {

    estado.textContent =
      `✓ Excelente · ${porcentajeNumero}%`;

  } else if (porcentaje >= 0.80) {

    estado.textContent =
      `✓ Muy bien · ${porcentajeNumero}%`;

  } else if (porcentaje >= 0.60) {

    estado.textContent =
      `Resultado · ${porcentajeNumero}%`;

  } else {

    estado.textContent =
      `Resultado · ${porcentajeNumero}%`;

  }

  estado.classList.remove("oculto");
}


// Solo lo guardamos como DOMINADO
// si obtuvo al menos 80%.

if (porcentaje >= 0.80) {

  agregarUnico(
    dominados,
    item.id
  );

  quitar(
    dificiles,
    item.id
  );

  guardarProgreso();
}


// ------------------------------------------------------
// SIEMPRE PASAR AL SIGUIENTE
// ------------------------------------------------------

setTimeout(() => {

  siguienteEnsayo();

  const siguiente =
    listaEnsayo[indiceEnsayo];

  if (!siguiente) {
    return;
  }

  hablar(
    siguiente.pie,
    siguiente.personajePie
  );

}, 900);

}

// ------------------------------------------------------
// PLAY / PAUSA - ENSAYAR
// ------------------------------------------------------

let vozPausadaEnsayo = false;

const botonPausarEnsayo =
  porId("ensayo-pausar");

if (botonPausarEnsayo) {

  botonPausarEnsayo.addEventListener(
    "click",
    () => {

      // Si está hablando, pausamos
      if (
        speechSynthesis.speaking &&
        !speechSynthesis.paused
      ) {

        speechSynthesis.pause();

        vozPausadaEnsayo = true;

        botonPausarEnsayo.textContent = "▶";

        return;
      }


      // Si estaba pausado, continuamos
      if (
        speechSynthesis.speaking &&
        speechSynthesis.paused
      ) {

        speechSynthesis.resume();

        vozPausadaEnsayo = false;

        botonPausarEnsayo.textContent = "⏸";

        return;
      }


      // Si no está hablando, iniciar / continuar
// el ensayo automático.

const item =
  listaEnsayo[indiceEnsayo];

if (!item) {
  return;
}

ensayoAutomatico = true;
vozPausadaEnsayo = false;

botonPausarEnsayo.textContent = "⏸";

hablar(
  item.pie,
  item.personajePie
);

    }
  );

}
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


  // Recordar el parlamento actual de Ensayar
  localStorage.setItem(
    "ultimoParlamentoEnsayo",
    String(indiceEnsayo)
  );


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


  
}




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

// ------------------------------------------------------
// SIGUIENTE MANUAL - ENSAYAR
// ------------------------------------------------------

const botonSiguienteEnsayo =
  porId("ensayo-siguiente");

if (botonSiguienteEnsayo) {

  botonSiguienteEnsayo.addEventListener(
    "click",
    () => {

      // Detener el micrófono si está escuchando
      if (
        reconocimientoEnsayo &&
        escuchandoEnsayo
      ) {

        try {
          reconocimientoEnsayo.stop();
        } catch (error) {
          console.warn(error);
        }

      }

      escuchandoEnsayo = false;

      
      // Detener la voz anterior
      speechSynthesis.cancel();

      // Mantener activo el ensayo automático
      ensayoAutomatico = true;

      // Ir al siguiente parlamento
      siguienteEnsayo();

      const siguiente =
        listaEnsayo[indiceEnsayo];

      if (!siguiente) {
        return;
      }

      // El siguiente personaje habla automáticamente
      setTimeout(() => {

        hablar(
          siguiente.pie,
          siguiente.personajePie
        );

      }, 250);

    }
  );

}




// ------------------------------------------------------
// REINICIAR ENSAYO
// ------------------------------------------------------

const botonReiniciarEnsayo =
  porId("reiniciar-ensayo");

if (botonReiniciarEnsayo) {

  botonReiniciarEnsayo.addEventListener(
    "click",
    () => {

      // Detener voz y micrófono actuales
      speechSynthesis.cancel();

      ensayoAutomatico = false;

      if (reconocimientoEnsayo) {

        try {
          reconocimientoEnsayo.stop();
        } catch (error) {
          console.warn(error);
        }

      }

      escuchandoEnsayo = false;

      // Volver al primer parlamento
      indiceEnsayo = 0;

      cargarEnsayo();

      // Dejar listo para comenzar nuevamente
      const botonPausa =
        porId("ensayo-pausar");

      if (botonPausa) {
        botonPausa.textContent = "▶";
      }

      const estado =
        porId("estado-microfono-ensayo");

      if (estado) {
        estado.classList.add("oculto");
      }

      const botonTermine =
        porId("ensayo-termine");

      if (botonTermine) {
        botonTermine.classList.add("oculto");
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );

}


// ------------------------------------------------------
// IR A PARLAMENTO - ENSAYAR
// ------------------------------------------------------

const panelParlamentosEnsayo =
  porId("panel-parlamentos-ensayo");

const listaSelectorParlamentosEnsayo =
  porId("lista-selector-parlamentos-ensayo");

const vistaPreviaParlamentoEnsayo =
  porId("vista-previa-parlamento-ensayo");

const buscarParlamentoEnsayo =
  porId("buscar-parlamento-ensayo");


// ABRIR SELECTOR

porId("abrir-selector-ensayo")
  .addEventListener("click", () => {

    speechSynthesis.cancel();

    ensayoAutomatico = false;

    if (reconocimientoEnsayo) {

      try {
        reconocimientoEnsayo.stop();
      } catch (error) {
        console.warn(error);
      }

    }

    escuchandoEnsayo = false;

    panelParlamentosEnsayo.classList.remove("oculto");

    buscarParlamentoEnsayo.value = "";

    vistaPreviaParlamentoEnsayo.classList.add("oculto");

    vistaPreviaParlamentoEnsayo.innerHTML = "";

        cargarSelectorParlamentosEnsayo();

    // Llevar la lista automáticamente al parlamento actual
    setTimeout(() => {

      const parlamentoActual =
        listaSelectorParlamentosEnsayo.querySelector(
          `[data-indice="${indiceEnsayo}"]`
        );

      if (parlamentoActual) {

        parlamentoActual.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      }

    }, 50);

    buscarParlamentoEnsayo.focus();

  });


// CERRAR SELECTOR

porId("cerrar-selector-ensayo")
  .addEventListener("click", () => {

    panelParlamentosEnsayo.classList.add("oculto");

  });


// CREAR LISTA

function cargarSelectorParlamentosEnsayo() {

  const busqueda =
    normalizarTexto(
      buscarParlamentoEnsayo.value
    );

  const resultados =
    listaEnsayo.filter((item, indice) => {

      if (!busqueda) {
        return true;
      }

      const numero =
        String(indice + 1);

      const contenido =
        normalizarTexto(
          `${item.personajePie} ${item.pie} ${item.lucas} ${item.acotacion || ""}`
        );

      return (
        numero.includes(busqueda) ||
        contenido.includes(busqueda)
      );

    });


  if (!resultados.length) {

    listaSelectorParlamentosEnsayo.innerHTML = `
      <p class="sin-dificiles">
        No encontré ningún parlamento.
      </p>
    `;

    return;
  }


  listaSelectorParlamentosEnsayo.innerHTML =
    resultados.map(item => {

      const indiceReal =
        listaEnsayo.findIndex(
          elemento => elemento.id === item.id
        );

      const comienzoPie =
        item.pie.length > 75
          ? `${item.pie.slice(0, 75)}…`
          : item.pie;

      return `
        <button
          type="button"
          class="opcion-parlamento opcion-parlamento-ensayo"
          data-indice="${indiceReal}"
        >

          <strong>
            #${indiceReal + 1}
            ·
            ${escaparHTML(
              item.personajePie.toUpperCase()
            )}
          </strong>

          <span>
            ${escaparHTML(comienzoPie)}
          </span>

        </button>
      `;

    }).join("");


  document
    .querySelectorAll(".opcion-parlamento-ensayo")
    .forEach(boton => {

      boton.addEventListener("click", () => {

        mostrarVistaPreviaParlamentoEnsayo(
          Number(boton.dataset.indice)
        );

      });

    });

}


// BUSCADOR

buscarParlamentoEnsayo
  .addEventListener(
    "input",
    cargarSelectorParlamentosEnsayo
  );

  // ------------------------------------------------------
// VISTA PREVIA COMPLETA - ENSAYAR
// ------------------------------------------------------

function mostrarVistaPreviaParlamentoEnsayo(indice) {

  const item =
    listaEnsayo[indice];

  if (!item) {
    return;
  }


  const acotacion =
    item.acotacion &&
    item.acotacion.trim() !== ""
      ? `
          <div class="selector-acotacion">
            <strong>Acotación</strong>

            <p>
              (${escaparHTML(item.acotacion)})
            </p>
          </div>
        `
      : "";


  vistaPreviaParlamentoEnsayo.innerHTML = `

    <div class="vista-previa-cabecera">

      <strong>
        Parlamento #${indice + 1}
      </strong>

      <span>
        Acto ${item.acto}
        · Cuadro ${item.cuadro}
      </span>

    </div>


    <div class="selector-pie">

      <strong>
        ${escaparHTML(
          item.personajePie.toUpperCase()
        )}
      </strong>

      <p>
        ${escaparHTML(item.pie)}
      </p>

    </div>


    <div class="selector-lucas">

      <strong>
        LUCAS MEYER
      </strong>

      <p>
        ${escaparHTML(item.lucas)}
      </p>

    </div>


    ${acotacion}


    <button
      type="button"
      id="confirmar-ir-parlamento-ensayo"
      class="confirmar-ir-parlamento"
    >
      Comenzar ensayo desde #${indice + 1}
    </button>

  `;


  vistaPreviaParlamentoEnsayo
    .classList
    .remove("oculto");


  porId("confirmar-ir-parlamento-ensayo")
    .addEventListener("click", () => {

      // Detener cualquier voz anterior
      speechSynthesis.cancel();

      // Evitar que el micrófono se reinicie
      // mientras cambiamos de parlamento.
      ensayoAutomatico = false;

      if (reconocimientoEnsayo) {

        try {
          reconocimientoEnsayo.stop();
        } catch (error) {
          console.warn(error);
        }

      }

      escuchandoEnsayo = false;


      // Ir al parlamento seleccionado
      indiceEnsayo = indice;

      cargarEnsayo();


      // Cerrar selector
      panelParlamentosEnsayo
        .classList
        .add("oculto");


      // Comenzar automáticamente el ensayo
      ensayoAutomatico = true;

      const botonPausa =
        porId("ensayo-pausar");

      if (botonPausa) {
        botonPausa.textContent = "⏸";
      }


      const seleccionado =
        listaEnsayo[indiceEnsayo];

      if (seleccionado) {

        setTimeout(() => {

          hablar(
            seleccionado.pie,
            seleccionado.personajePie
          );

        }, 250);

      }


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });


  vistaPreviaParlamentoEnsayo.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

}

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

  indiceAprender =
  Number(
    localStorage.getItem("ultimoParlamentoAprender")
  ) || 0;
    indiceEnsayo =
    Number(
      localStorage.getItem("ultimoParlamentoEnsayo")
    ) || 0;


  cargarAprender();

  cargarEnsayo();

  cargarListaTextos();

  actualizarProgreso();


  console.log(
    `Lucas Meyer: ${guion.length} parlamentos cargados.`
  );
}


iniciarAplicacion();