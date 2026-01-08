// Pantalla de carga
window.addEventListener('load', function() {
    var pantalla = document.getElementById('pantallaCarga');
    
    if (sessionStorage.getItem('cargaCompletada')) {
        pantalla.remove();
        return;
    }
    
    setTimeout(function() {
        pantalla.classList.add('ocultar');
        
        setTimeout(function() {
            pantalla.remove();
            sessionStorage.setItem('cargaCompletada', 'true');
        }, 500);
    }, 500);
});



// Visualización de saldo
var botonOcultarSaldo = document.querySelector('.boton-ocultar-saldo');
var saldoMonto = document.querySelector('.saldo-monto');
var saldoOriginal = saldoMonto.textContent;
var saldoOculto = false;

botonOcultarSaldo.addEventListener('click', function() {
    if (saldoOculto) {
        saldoMonto.textContent = saldoOriginal;
        saldoOculto = false;
    } else {
        saldoMonto.textContent = 'S/. ******';
        saldoOculto = true;
    }
});


// Generación de código aleatorio para link de pago
function generarCodigo() {
    var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var codigo = '';
    for (var i = 0; i < 7; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}


// Notificación de links
function mostrarNotificacion(mensaje, tipo) {
    var notificacion = document.createElement('div');
    notificacion.className = 'notificacion-toast';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    if (tipo === 'confeti') {
        crearConfeti();
    }
    
    setTimeout(function() {
        notificacion.classList.add('mostrar');
    }, 100);
    
    setTimeout(function() {
        notificacion.classList.remove('mostrar');
        setTimeout(function() {
            notificacion.remove();
        }, 300);
    }, 3000);
}



// Crea confeti
function crearConfeti() {
    var colores = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa07a', '#98d8c8', '#f7dc6f'];
    
    for (var i = 0; i < 30; i++) {
        var confeti = document.createElement('div');
        confeti.className = 'confeti';
        confeti.style.left = Math.random() * 100 + '%';
        confeti.style.background = colores[Math.floor(Math.random() * colores.length)];
        confeti.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(confeti);
        
        setTimeout(function(elemento) {
            elemento.remove();
        }, 3000, confeti);
    }
}


var linkActual = 'Wango.wallet.com/' + generarCodigo();


// Copia el link de pago al portapapeles
var botonCopiar = document.querySelector('.boton-copiar-link');
botonCopiar.addEventListener('click', function() {
    navigator.clipboard.writeText(linkActual);
    mostrarNotificacion('✓ Link copiado al portapapeles');
});


// Genera un nuevo link de pago
var botonGenerar = document.querySelector('.boton-generar-link');
botonGenerar.addEventListener('click', function() {
    linkActual = 'Wango.wallet.com/' + generarCodigo();
    mostrarNotificacion('🎉 ¡Has generado otro link de pago con éxito!', 'confeti');
});


// Añadir tarjetas
var tarjetas = [];
var maxTarjetas = 10;

var botonAnadirMetodo = document.querySelector('.boton-anadir-metodo');
var modal = document.getElementById('modalAgregarTarjeta');
var cerrarModal = document.getElementById('cerrarModal');

botonAnadirMetodo.addEventListener('click', function() {
    if (tarjetas.length >= maxTarjetas) {
        mostrarNotificacion('⚠️ Has alcanzado el máximo de 10 tarjetas');
        return;
    }
    modal.classList.add('activo');
});

cerrarModal.addEventListener('click', function() {
    modal.classList.remove('activo');
    document.getElementById('formTarjeta').reset();
});

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('activo');
    }
});

// Validar solo numeros en tarjeta y CVV
document.getElementById('numeroTarjeta').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '');
});

document.getElementById('codigoSeguridad').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '');
});

// Formato automatico MM/AA
document.getElementById('fechaVencimiento').addEventListener('input', function(e) {
    var valor = this.value.replace(/\D/g, '');
    if (valor.length >= 2) {
        this.value = valor.substring(0, 2) + '/' + valor.substring(2, 4);
    } else {
        this.value = valor;
    }
});

var tarjetaAEliminar = null;
var elementoAEliminar = null;

// Guardar tarjeta
document.getElementById('formTarjeta').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var numero = document.getElementById('numeroTarjeta').value;
    var fecha = document.getElementById('fechaVencimiento').value;
    
    if (numero.length !== 16) {
        mostrarNotificacion('⚠️ Ingresa los 16 dígitos de la tarjeta');
        return;
    }
    
    if (fecha.length !== 5) {
        mostrarNotificacion('⚠️ Ingresa la fecha completa MM/AA');
        return;
    }
    
    var codigo = document.getElementById('codigoSeguridad').value;
    if (codigo.length !== 3) {
        mostrarNotificacion('⚠️ El código debe tener 3 dígitos');
        return;
    }
    
    var tarjetaExiste = false;
    for (var i = 0; i < tarjetas.length; i++) {
        if (tarjetas[i].numero === numero) {
            tarjetaExiste = true;
            break;
        }
    }
    
    if (tarjetaExiste) {
        mostrarNotificacion('⚠️ Esta tarjeta ya ha sido agregada');
        return;
    }
    
    tarjetas.push({numero: numero, fecha: fecha});
    
    var contenedor = document.querySelector('.seccion-metodos-pago');
    var ultimos4 = numero.substring(12);
    
    var tarjetaDiv = document.createElement('div');
    tarjetaDiv.className = 'tarjeta-contenedor';
    tarjetaDiv.innerHTML = '<img src="./logos and imgs/tarjeta-de-credito.png" alt="tarjeta"><div class="tarjeta-info"><p>Visa Debito Clasica Compras •••• ' + ultimos4 + '</p><p>' + fecha + '</p></div><button class="boton-eliminar-tarjeta">✕</button>';
    
    var boton = contenedor.querySelector('.boton-anadir-metodo');
    contenedor.insertBefore(tarjetaDiv, boton);
    
    // Abrir modal de confirmacion al hacer click en X
    tarjetaDiv.querySelector('.boton-eliminar-tarjeta').addEventListener('click', function() {
        tarjetaAEliminar = numero;
        elementoAEliminar = tarjetaDiv;
        document.getElementById('modalEliminar').classList.add('activo');
    });
    
    modal.classList.remove('activo');
    this.reset();
    mostrarNotificacion('✓ Tarjeta agregada con éxito');
});

// Cancelar eliminacion
document.getElementById('btnCancelar').addEventListener('click', function() {
    document.getElementById('modalEliminar').classList.remove('activo');
    tarjetaAEliminar = null;
    elementoAEliminar = null;
});

// Confirmar eliminacion
document.getElementById('btnConfirmar').addEventListener('click', function() {
    for (var i = 0; i < tarjetas.length; i++) {
        if (tarjetas[i].numero === tarjetaAEliminar) {
            tarjetas.splice(i, 1);
            break;
        }
    }
    elementoAEliminar.remove();
    document.getElementById('modalEliminar').classList.remove('activo');
    mostrarNotificacion('✓ Tarjeta eliminada');
    tarjetaAEliminar = null;
    elementoAEliminar = null;
});