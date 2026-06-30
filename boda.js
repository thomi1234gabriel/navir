document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-boda');
    const btnCerrar = document.querySelector('.btn-cerrar-boda');
    const cartas = document.querySelectorAll('.carta-boda');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalMensaje = document.getElementById('modal-mensaje');

    // Mensajes con ortografía y puntuación corregidas
    const mensajes = {
        1: { 
            titulo: "De Yippette", 
            texto: "Mis queridos saludos, Navir. Yo nunca he sido una persona que se sepa expresar adecuadamente, pero eso no me impedirá abrirme a aquel que más de una vez me ha escuchado...\n\nHace poco conocí a esta persona maravillosa, me agradó todo de él: su humor, su forma de ser, su forma de responder, y sobre todo, su personalidad. Es esa persona cuya amistad es y será algo etéreo y hermoso. Tú te has vuelto una persona más cercana a mí cada día, y espero que así de hermoso que es tu forma de ser, sea tu relación con Nick...\n\nAsí lo diga millones de veces, quiero que sepas que todas las veces y formas en las que te digo \"te quiero\", quiero que siempre sepas que lo digo con todo el amor posible para el amigo que se lo merece.\n\nDe tu amigo que te quiere mucho, Yippette." 
        },
        2: { 
            titulo: "Un buen amigo", 
            texto: "Quiero dar unas palabras para el marido, Navir. Sé que no hemos tenido tanto tiempo, ni tampoco somos esos amigos que son muy unidos, pero desde que recuerdo que tuvimos pocas charlas, eres un buen amigo. Y ya que estás acá, te deseo mucha suerte en tu futuro junto a él, y no solo eso, también te deseo mucha prosperidad, y que, aunque puedan pasar por problemas, aquellos no los hagan separar. No los conozco muy bien, pero sé que darán todo el uno para el otro. Mucha suerte en su futuro, querido amigo, y a ti también te deseo suerte Nick, dale mucho cariño." 
        },
        3: { 
            titulo: "¡Felicidades!", 
            texto: "¡Felicidades, Nav! Aunque no nos conocemos mucho, quería desearte lo mejor. Espero que hoy la pases increíble y que esta nueva etapa esté llena de felicidad y momentos inolvidables. ¡Que sean muy felices y que disfruten cada momento juntos! 🤍" 
        },
        4: { 
            titulo: "De Nicky 🤍", 
            texto: "Amor, al fin llegó el día en el que nuestra vida se une, ese día en el que nuestros corazones se hacen uno... No puedo describir lo feliz que estoy por celebrar este día contigo. Sé que te lo digo a menudo, pero gracias por todo el amor y cariño que me das, por esas risas, acompañamiento y paciencia que nadie me tuvo jamás. Espero que este día la pases hermoso y que podamos seguir así de unidos toda la vida...\n\nCon mucho amor, Nicky." 
        },
        5: { 
            titulo: "Un amigo de oro", 
            texto: "Quería escribirte esto para recordarte lo mucho que valoro tenerte en mi vida. Eres una persona increíble y un amigo de oro; admiro un montón tu forma de ser y el gran corazón que tienes con los demás.\n\nSé que a veces no soy el más expresivo del mundo, pero quiero que tengas bien claro que cuentas con todo mi cariño y mi apoyo para lo que sea. Me da un enorme orgullo ver que te van saliendo las cosas bien y verte feliz.\n\nYa sabes que aquí voy a estar siempre para escucharte, respaldarte y acompañarte en las buenas y en las malas. Disfruta, que será el inicio de la mejor etapa de tu vida. Me llena de alegría saber que vas a dar este gran paso y casarte." 
        },
        6: { 
            titulo: "Mensaje 6", 
            texto: "Por completar..." 
        },
        7: { 
            titulo: "Mensaje 7", 
            texto: "Por completar..." 
        }
    };

    // Agregar el evento click a cada carta
    cartas.forEach(carta => {
        carta.addEventListener('click', () => {
            const id = carta.getAttribute('data-id');
            const info = mensajes[id];
            
            // Llenar el modal con la info correspondiente
            modalTitulo.innerText = info.titulo;
            modalMensaje.innerText = info.texto;
            
            // Mostrar modal
            modal.classList.add('activo');
        });
    });

    // Cerrar modal con la X
    btnCerrar.addEventListener('click', () => {
        modal.classList.remove('activo');
    });

    // Cerrar modal al hacer click fuera de la tarjeta
    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            modal.classList.remove('activo');
        }
    });
});