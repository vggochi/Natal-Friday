// ================================================
// Arquivo: script.js
// Objetivo: controlar animações, contador e carregamento de produtos.
// Fluxo principal de dados: Supabase -> Fallback para mock.
// Linguagem simples e didática para alunos.
// ================================================

// ------------------------------
// Contador regressivo (Countdown)
// Define uma data futura (3 dias a partir de agora) e
// atualiza os números na tela a cada segundo.
const countdownDate = new Date();
countdownDate.setDate(countdownDate.getDate() + 36);
countdownDate.setHours(23, 59, 59, 999);

function updateCountdown() {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

  if (distance < 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ------------------------------
// Animação de partículas (visual de fundo)
// Usamos um <canvas> para desenhar pontos e linhas que se movimentam.
// Isso é puramente estético para deixar a página mais atrativa.
window.onload = function() {
    // 1. Configuração inicial do canvas
    const canvas = document.getElementById("snowCanvas");
    const ctx = canvas.getContext("2d");

    // Redimensiona o canvas para o tamanho da janela
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 2. Variáveis para a neve
    const maxParticulas = 100;
    const particulas = [];

    // 3. Função para criar um floco de neve
    function criarFloco() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            raio: Math.random() * 3 + 1,
            velocidadeY: Math.random() * 1 + 0.5,
            velocidadeX: Math.random() * 0.5 - 0.25, // Para criar um leve movimento lateral
            opacidade: Math.random() * 0.5 + 0.5
        };
    }

    // 4. Preenche o array com flocos iniciais
    for (let i = 0; i < maxParticulas; i++) {
        particulas.push(criarFloco());
    }

    // 5. Função para desenhar todos os flocos
    function desenhar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

        for (let i = 0; i < particulas.length; i++) {
            const p = particulas[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.raio, 0, Math.PI * 2, false);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacidade})`;
            ctx.fill();
        }

        atualizar();
    }

    // 6. Função para atualizar a posição dos flocos
    function atualizar() {
        for (let i = 0; i < particulas.length; i++) {
            const p = particulas[i];

            // Move o floco para baixo
            p.y += p.velocidadeY;
            p.x += p.velocidadeX;

            // Se o floco sair da tela, reposiciona-o no topo
            if (p.y > canvas.height) {
                particulas[i] = {
                    x: Math.random() * canvas.width,
                    y: -p.raio, // Começa do topo, fora da tela
                    raio: Math.random() * 3 + 1,
                    velocidadeY: Math.random() * 1 + 0.5,
                    velocidadeX: Math.random() * 0.5 - 0.25,
                    opacidade: Math.random() * 0.5 + 0.5
                };
            }
        }
    }

    // 7. Loop de animação
    function loop() {
        desenhar();
        requestAnimationFrame(loop); // Repete a animação
    }
    
    loop(); // Inicia a animação
};

function formatBRL(value) {
  // Formata um número para moeda brasileira (R$)
  const num = Number(value);
  if (Number.isNaN(num)) return 'R$ 0,00';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function escapeHtml(str) {
  // Evita problemas de segurança ao inserir texto no HTML,
  // convertendo caracteres especiais em entidades.
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(message) {
  // Exibe uma mensagem de feedback temporária no canto da tela.
  const messageDiv = document.createElement('div');
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff0000ff;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(255, 255, 255, 1);
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(messageDiv);
  setTimeout(() => {
    messageDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => messageDiv.remove(), 300);
  }, 2000);
}

function attachBuyButtonHandlers() {
  // Adiciona comportamento ao botão "Comprar Agora" de cada produto.
  // Aqui apenas mostramos um toast simulando a adição ao carrinho.
  document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', function() {
      const productName = this.closest('.product-card').querySelector('.product-name').textContent;
      showToast(`${productName} adicionado ao carrinho!`);
    });
  });
}

function renderProducts(products) {
  // Recebe uma lista de produtos e cria os cartões na grade.
  // Cada cartão mostra imagem (emoji), nome, preços e botão.
  const grid = document.querySelector('.products-grid');
  if (!grid) return;

  grid.innerHTML = '';
  const items = products.slice(0, 3);

  items.forEach(p => {
    const discountCalc = (p && p.old_price && p.new_price)
      ? Math.max(0, Math.round(100 - (Number(p.new_price) / Number(p.old_price)) * 100))
      : (p && typeof p.discount === 'number' ? p.discount : 0);

    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image">
        <span>${escapeHtml(p?.emoji || '🛍️')}</span>
        <div class="discount-badge">-${discountCalc}%</div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${escapeHtml(p?.name || 'Produto')}</h3>
        <div class="price-container">
          <span class="old-price">${formatBRL(p?.old_price)}</span>
          <span class="new-price">${formatBRL(p?.new_price)}</span>
        </div>
        <button class="buy-button">Comprar Agora</button>
      </div>
    `;
    grid.appendChild(card);
  });

  attachBuyButtonHandlers();
}

async function loadProducts() {
  // ---------------------------------
  // Carregamento de produtos (Supabase -> mock)
  // 1) Tenta buscar no Supabase usando as credenciais de index.html
  // 2) Se der erro ou vier vazio, usa uma lista mock para não quebrar a página
  // ---------------------------------

  // Produtos de demonstração (fallback)
 const mockProducts = [
    { name: 'Panetone Trufado', old_price: 69.90, new_price: 49.90, emoji: '🍞' },
    { name: 'Árvore de Natal 1.8m', old_price: 399.00, new_price: 249.90, emoji: '🎄' },
    { name: 'Pisca-Pisca LED (10m)', old_price: 45.00, new_price: 29.90, emoji: '💡' },
    { name: 'Kit Bolas Douradas', old_price: 59.90, new_price: 35.00, emoji: '✨' },
    { name: 'Gorro do Papai Noel', old_price: 29.90, new_price: 15.90, emoji: '🎅' }
  ];

  // Consultar diretamente do Supabase
  // Explicação:
  // - `window.supabase` vem do SDK carregado no index.html
  // - `createClient(url, anonKey)` cria um cliente para acessar o banco
  // - A consulta usa `.from('products').select('*')` para pegar todos os campos
  // - Ordenamos por `created_at` desc e limitamos a 3 itens mais recentes
  try {
    const { createClient } = window.supabase || {};
    const cfg = window.__SUPABASE || {};
    if (typeof createClient === 'function' && cfg.url && cfg.anonKey) {
      const client = createClient(cfg.url, cfg.anonKey);
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      if (Array.isArray(data) && data.length) {
        // Se deu certo e veio conteúdo, exibimos os produtos reais
        renderProducts(data);
        return;
      }
    }
  } catch (errSupabase) {
    // Em caso de falha (sem internet, sem RLS, chave inválida...),
    // seguimos para o fallback.
    console.warn('Falha ao consultar Supabase:', errSupabase);
  }

  // Fallback para mock
  // Mostra a lista de demonstração para manter a experiência do aluno.
  renderProducts(mockProducts);
  showToast('Exibindo produtos de demonstração.');
}

document.addEventListener('DOMContentLoaded', () => {
  // Quando o HTML terminar de carregar, iniciamos a busca de produtos.
  loadProducts();
});

// keyframes para toasts
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(toastStyle);