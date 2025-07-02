document.addEventListener("DOMContentLoaded", () => {
  const resumenLista = document.querySelector(".list-unstyled");
  const subtotalElem = document.querySelector("#resumen-subtotal");
  const envioElem = document.querySelector("#resumen-envio");
  const totalElem = document.querySelector("#resumen-total");
  const descuentoElem = document.querySelector("#resumen-descuento");
  const filaDescuento = document.querySelector("#fila-descuento");
  const inputDescuento = document.getElementById("codigo-descuento");
  const btnPagar = document.querySelector(".btn-dark.w-100");

  let productos = [];
  let subtotal = 0;
  let descuento = 0;

  const compraDirecta = JSON.parse(localStorage.getItem("compraDirecta"));
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (compraDirecta) {
    productos = [compraDirecta];
    subtotal = compraDirecta.total;
  } else {
    localStorage.removeItem("compraDirecta");
    productos = carrito;
    subtotal = carrito.reduce((acc, item) => acc + item.total, 0);
  }

  resumenLista.innerHTML = "";
  productos.forEach(producto => {
    const li = document.createElement("li");
    li.className = "d-flex align-items-center mb-3";
    li.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img me-3" />
      <div>
        <p class="mb-1 fw-semibold">${producto.nombre}</p>
        <span class="text-muted">${producto.cantidad} x S/ ${producto.precio.toFixed(2)}</span>
      </div>
    `;
    resumenLista.appendChild(li);
  });

  function actualizarTotales() {
    const tipoEntrega = document.querySelector('input[name="tipoEntrega"]:checked')?.value;
    const envio = tipoEntrega === "envio" ? 10.0 : 0.0;

    envioElem.parentElement.style.display = envio > 0 ? "flex" : "none";
    subtotalElem.textContent = `S/ ${subtotal.toFixed(2)}`;
    envioElem.textContent = `S/ ${envio.toFixed(2)}`;

    const totalFinal = subtotal + envio - descuento;
    totalElem.textContent = `S/ ${totalFinal.toFixed(2)}`;
  }

  // Descuento
  filaDescuento.style.display = "none";
  window.aplicarDescuento = function () {
    const valor = inputDescuento.value.trim().toLowerCase();
    if (valor === "chulon") {
      descuento = 10;
      filaDescuento.style.display = "flex";
      descuentoElem.textContent = `- S/ ${descuento.toFixed(2)}`;
    } else {
      descuento = 0;
      filaDescuento.style.display = "none";
      descuentoElem.textContent = "";
    }
    actualizarTotales();
  };

  document.querySelectorAll('input[name="tipoEntrega"]').forEach(radio => {
    radio.addEventListener("change", actualizarTotales);
  });

  actualizarTotales();

  // 🔥 BOTÓN PAGAR
  btnPagar.addEventListener("click", () => {
    const radios = document.querySelectorAll('input[name="pago"]');
    let metodoSeleccionado = "";

    radios.forEach(radio => {
      if (radio.checked) {
        const text = radio.parentElement.textContent.trim().toLowerCase();
        if (text.includes("mercado")) metodoSeleccionado = "mercado";
        else if (text.includes("yape") || text.includes("plin")) metodoSeleccionado = "yape";
        else if (text.includes("transferencia")) metodoSeleccionado = "transferencia";
      }
    });

    if (metodoSeleccionado === "mercado") {
  window.location.href = "https://link.mercadopago.com.pe/clickyarte";
} else if (metodoSeleccionado === "yape") {
  const qrModal = new bootstrap.Modal(document.getElementById("qrModal"));
  qrModal.show();
} else if (metodoSeleccionado === "transferencia") {
  alert("Gracias por tu compra. Te enviaremos los datos bancarios a tu correo.");
} else {
  alert("Selecciona un método de pago");
}

  });
});
