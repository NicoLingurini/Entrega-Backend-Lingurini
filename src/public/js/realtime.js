const socket = io();

const form = document.getElementById("product-form");
const list = document.getElementById("product-list");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const product = {};
  formData.forEach((value, key) => {
    product[key] = value;
  });

  socket.emit("new-product", product);
  form.reset();
});

socket.on("update-products", (products) => {
  console.log("Socket.IO conectado con id:", socket.id);
  list.innerHTML = "";

  products.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${p.title}</strong> - ${p.description} - $${p.price} 
      <button data-id="${p.id}" class="delete-btn">Eliminar</button>`;
    list.appendChild(li);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      socket.emit("delete-product", id);
    });
  });
});
