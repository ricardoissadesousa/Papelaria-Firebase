// Importando os módulos do Firebase necessários
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
    getFirestore,
    addDoc,
    collection,
    getDocs,
    deleteDoc,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAOGc6QaDsb3_1vhzrOieaePH5REdP4hQA",
    authDomain: "crudfirestore-f44b4.firebaseapp.com",
    projectId: "crudfirestore-f44b4",
    storageBucket: "crudfirestore-f44b4.firebasestorage.app",
    messagingSenderId: "302268959430",
    appId: "1:302268959430:web:08cb825e36782b733065c7"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referências aos elementos da página
const notify = document.querySelector('.notify');
const addBtn = document.querySelector('#add_Data');
const updateDataBtn = document.querySelector('#update_data');
const categoryTables = document.querySelector('#categoryTables');
const cartItems = document.querySelector('#cartItems');
const cartTotal = document.querySelector('#cartTotal');
const finalizeSaleBtn = document.querySelector('#finalizeSale');

// Variáveis do sistema
let cart = [];

// Esconde o botão de atualizar por padrão
updateDataBtn.classList.add('hide');

// Função para exibir notificações
function showNotification(message, isError = false) {
    notify.innerHTML = message;
    notify.classList.toggle('error', isError);
    notify.style.display = 'block';
    setTimeout(() => notify.style.display = 'none', 3000);
}

// Função para alternar entre os modos "Adicionar" e "Atualizar"
function toggleUpdateMode(showUpdate = false) {
    if (showUpdate) {
        updateDataBtn.classList.remove('hide');
        addBtn.classList.add('hide');
    } else {
        updateDataBtn.classList.add('hide');
        addBtn.classList.remove('hide');
    }
}

// Função para resetar os campos do formulário
function resetForm() {
    document.querySelector('#productName').value = "";
    document.querySelector('#price').value = "";
    document.querySelector('#quantity').value = "";
    document.querySelector('#category').value = "";
    toggleUpdateMode(false);
}

// Função para adicionar produtos ao Firestore
async function addData() {
    const productName = document.querySelector('#productName').value;
    const price = parseFloat(document.querySelector('#price').value);
    const quantity = parseInt(document.querySelector('#quantity').value, 10);
    const category = document.querySelector('#category').value;

    if (!productName || isNaN(price) || isNaN(quantity) || !category) {
        showNotification("Por favor, preencha todos os campos!", true);
        return;
    }

    try {
        await addDoc(collection(db, "products"), {
            productName,
            price,
            quantity,
            category
        });
        showNotification("Produto adicionado com sucesso!");
        resetForm();
        getData();
    } catch (error) {
        console.log(error);
        showNotification("Erro ao adicionar o produto!", true);
    }
}

// Função para recuperar produtos do Firestore
async function getData() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const categories = ["Caneta", "Papel", "Caderno", "Impressora", "Acessorios"];
        const categoryData = {};

        categories.forEach(cat => {
            categoryData[cat] = [];
        });

        querySnapshot.forEach(doc => {
            const data = doc.data();
            if (categories.includes(data.category)) {
                categoryData[data.category].push({ id: doc.id, ...data });
            }
        });

        let html = "";
        for (const [category, products] of Object.entries(categoryData)) {
            html += `
                <h3>${category}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(product => `
                            <tr>
                                <td>${product.id}</td>
                                <td>${product.productName}</td>
                                <td>R$ ${product.price.toFixed(2)}</td>
                                <td>${product.quantity}</td>
                                <td>
                                    <button class="del_btn" onclick="deleteProduct('${product.id}')">Excluir</button>
                                    <button class="up_btn" onclick="updateData('${product.id}')">Atualizar</button>
                                    <button class="sell_btn" onclick="addToCart('${product.id}', '${product.productName}', ${product.price}, ${product.quantity})">Vender</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        categoryTables.innerHTML = html;
    } catch (error) {
        console.log(error);
        showNotification("Erro ao carregar os produtos!", true);
    }
}

// Função para excluir produto
window.deleteProduct = async function (id) {
    try {
        await deleteDoc(doc(db, "products", id));
        showNotification("Produto excluído com sucesso!");
        getData();
    } catch (error) {
        console.log(error);
        showNotification("Erro ao excluir o produto!", true);
    }
};

// Função para atualizar produtos
window.updateData = async function (id) {
    try {
        const docSnapshot = await getDoc(doc(db, "products", id));
        const currentData = docSnapshot.data();
        document.querySelector('#productName').value = currentData.productName;
        document.querySelector('#price').value = currentData.price;
        document.querySelector('#quantity').value = currentData.quantity;
        document.querySelector('#category').value = currentData.category;

        toggleUpdateMode(true);

        updateDataBtn.addEventListener('click', async function handleUpdate() {
            const newProductName = document.querySelector('#productName').value;
            const newPrice = parseFloat(document.querySelector('#price').value);
            const newQuantity = parseInt(document.querySelector('#quantity').value, 10);
            const newCategory = document.querySelector('#category').value;

            if (!newProductName || isNaN(newPrice) || isNaN(newQuantity) || !newCategory) {
                showNotification("Por favor, preencha todos os campos!", true);
                return;
            }

            await updateDoc(doc(db, "products", id), {
                productName: newProductName,
                price: newPrice,
                quantity: newQuantity,
                category: newCategory
            });

            showNotification("Produto atualizado com sucesso!");
            resetForm();
            updateDataBtn.removeEventListener('click', handleUpdate);
            getData();
        });
    } catch (error) {
        console.log(error);
        showNotification("Erro ao atualizar o produto!", true);
    }
};

// Função para adicionar produto ao carrinho
window.addToCart = function (id, productName, price, availableQuantity) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, productName, price, quantity: 1, availableQuantity });
    }

    renderCart();
};

// Renderiza o carrinho
function renderCart() {
    let html = "";
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        html += `
            <tr>
                <td>${item.productName}</td>
                <td>R$ ${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" min="1" max="${item.availableQuantity}" value="${item.quantity}" 
                    onchange="updateCartQuantity('${item.id}', this.value)">
                </td>
                <td>R$ ${subtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    cartItems.innerHTML = html;
    cartTotal.innerHTML = total.toFixed(2);
    finalizeSaleBtn.disabled = cart.length === 0;
}

// Função para atualizar a quantidade no carrinho
window.updateCartQuantity = function (id, newQuantity) {
    const item = cart.find(product => product.id === id);
    newQuantity = parseInt(newQuantity, 10);

    if (item && newQuantity > 0 && newQuantity <= item.availableQuantity) {
        item.quantity = newQuantity;
        renderCart();
    }
};

// Função para finalizar a venda
async function finalizeSale() {
  if (cart.length === 0) {
      alert("O carrinho está vazio!");
      return;
  }

  try {
      // Loop para processar cada item no carrinho
      for (const item of cart) {
          const docRef = doc(db, "products", item.id); // Parêntese corrigido
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
              const currentData = docSnapshot.data();
              const newQuantity = currentData.quantity - item.quantity;

              // Valida se há estoque suficiente
              if (newQuantity < 0) {
                  alert(`Estoque insuficiente para o produto: ${item.productName}`);
                  return;
              }

              // Atualiza o estoque no Firestore
     
          } else {
              alert(`Produto não encontrado no estoque: ${item.productName}`);
              return;
          }
      }

      // Limpa o carrinho após finalizar a venda
      cart = [];
      renderCart();
      getData();
      showNotification("Venda finalizada com sucesso!");
  } catch (error) {
      console.error("Erro ao finalizar a venda:", error);
      showNotification("Erro ao finalizar a venda. Verifique o console para mais detalhes.", true);
  }
}
// Código para esconder o protetor de tela ao clicar
document.getElementById("screenSaver").onclick = function() {
  this.style.display = 'none';
};

// Adiciona evento ao botão "Finalizar Venda"
finalizeSaleBtn.addEventListener('click', finalizeSale);

// Inicializa o evento para adicionar produtos
addBtn.addEventListener('click', addData);

// Recupera os dados iniciais ao carregar a página
getData();

  