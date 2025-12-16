<template>
    <main id="fundo">
        <section>
        <HeaderCadastrado/>
      

      <div class="grafico">
        
        <form @submit.prevent="registrarOperacao" class="elementos-form">
          <h2>Registro de Transação</h2>
          
          <div class="elementos">
            <select name="operacao" id="operacao-select" v-model="operacaoSelecionada">
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </select>
            
            <div class="input">
              <label for="valor-input">Digite o valor da operação</label>
              <input 
                id="valor-input" 
                type="number" 
                placeholder="Ex: 100.50" 
                v-model.number="valorOperacao"
                min="0"
                step="0.01"
                required
              >
            </div>
          </div>
          
          <button type="submit" class="btn-registrar">
            Registrar {{ operacaoSelecionada === 'entrada' ? 'Entrada' : 'Saída' }}
          </button>
          
        </form>

        <div class="chart-container">
            <h3>Balanço Geral</h3>
            <BarChart :chartData="dadosParaGrafico" v-if="historicoOperacoes.length > 0" />
            <p v-else class="historico-vazio">Adicione uma transação para visualizar o gráfico.</p>
        </div>
        
        <div class="historico">
            <h3>Histórico de Transações Recentes</h3>
            
            <div v-if="historicoOperacoes.length === 0" class="historico-vazio">
                Nenhuma transação registrada ainda.
            </div>
            
            <ul v-else class="lista-historico">
                <li v-for="(op, index) in historicoOperacoes" :key="index" class="item-historico">
                    <span :class="['tipo', op.tipo]">
                        {{ op.tipo.toUpperCase() }}
                    </span>
                    <span class="valor">{{ formatarValor(op.valor) }}</span>
                    <span class="data-hora">{{ formatarData(op.dataHora) }}</span>
                </li>
            </ul>
        </div>

      </div>
    </section>
  </main>
  <Footer />
</template>

<script>
import Footer from '../../components/Footer.vue';
import HeaderCadastrado from './Header-cadastrado.vue';
import BarChart from '../../components/BarChart.vue'; 
import axios from 'axios'; 


// 💡 CORREÇÃO CRÍTICA 1: URL Base da API definida corretamente.
const API_BASE_URL = 'http://localhost:3000/api'; 

export default {
  name: 'Dashboard',
  components: {
    Footer,
    HeaderCadastrado,
    BarChart
  },
  data() {
    return {
      operacaoSelecionada: 'entrada',
      valorOperacao: null,
      historicoOperacoes: [] 
    };
  },
  computed: {
    dadosParaGrafico() {
      let totalEntrada = 0;
      let totalSaida = 0;
      
      this.historicoOperacoes.forEach(op => {
        if (op.tipo === 'entrada') {
          totalEntrada += op.valor;
        } else if (op.tipo === 'saida') {
          totalSaida += op.valor;
        }
      });

      return {
        labels: ['Entrada', 'Saída'],
        datasets: [
          {
            label: 'Total Acumulado',
            backgroundColor: ['#38a169', '#e53e3e'],
            data: [totalEntrada, totalSaida]
          }
        ]
      };
    }
  },
  mounted() {
    this.buscarHistorico(); 
  },
  methods: {
    // 💡 Melhoria: Função auxiliar para obter o token de autenticação e verificar validade
    getAuthHeaders() {
      const token = localStorage.getItem('userToken'); 
      if (!token) {
          console.error("Usuário não autenticado. Redirecionando para login.");
          alert("Sessão expirada ou não iniciada. Por favor, faça login novamente.");
          this.$router.push('/login'); // Ajuste o nome da rota de login se necessário
          return null; // Retorna nulo para indicar falha de autenticação
      }
      return {
          headers: {
              'Authorization': `Bearer ${token}` 
          }
      };
    },

    // Função para buscar o histórico de transações do MongoDB
    async buscarHistorico() {
        const authHeaders = this.getAuthHeaders();
        if (!authHeaders) return; // Interrompe se não houver token
        
        try {
            const response = await axios.get(`${API_BASE_URL}/transacoes`, authHeaders);
            
            // Revertido o reverse para exibir as mais recentes no topo sem ter que reverter no servidor
            this.historicoOperacoes = response.data.map(op => ({
                ...op,
                dataHora: new Date(op.dataHora)
            }));
        
        } catch (error) {
            console.error("Erro ao buscar histórico no MongoDB:", error);
            // Se for erro 401 ou 403, o getAuthHeaders() já deveria ter tratado.
            alert("Falha ao carregar o histórico de transações.");
        }
    },

    // Função para registrar a transação no MongoDB
    async registrarOperacao() {
      if (!this.valorOperacao || this.valorOperacao <= 0) {
        alert('Por favor, insira um valor válido maior que zero.');
        return;
      }
      
      const authHeaders = this.getAuthHeaders();
      if (!authHeaders) return; // Interrompe se não houver token

      const dataHoraAtual = new Date();

      const novaOperacaoData = {
        tipo: this.operacaoSelecionada,
        valor: this.valorOperacao,
        dataHora: dataHoraAtual.toISOString() // Envia em formato ISO String para o backend
      };
      
      try {
        // Requisição POST para o servidor, incluindo os dados e o token de autorização
        const response = await axios.post(`${API_BASE_URL}/transacoes`, 
            novaOperacaoData, 
            authHeaders
        );
        
        // Adiciona a nova transação no topo do histórico local
        this.historicoOperacoes.unshift({
            ...novaOperacaoData,
            dataHora: dataHoraAtual,
            _id: response.data._id // ID retornado pelo MongoDB
        }); 

        this.valorOperacao = null; // Limpa o campo
        alert(`Transação de ${novaOperacaoData.tipo} registrada com sucesso!`);
        
      } catch (error) {
          console.error("Falha ao salvar a transação no MongoDB:", error);
          
          if (error.response && error.response.status === 401) {
             alert("Não autorizado. Faça login novamente.");
          } else {
             alert("Erro ao registrar a transação. Verifique sua API ou conexão.");
          }
      }
    },
    
    // Métodos formatarData e formatarValor (MANTIDOS IGUAIS)
    formatarData(data) {
        if (!(data instanceof Date) || isNaN(data)) return 'Data Inválida'; 

        return data.toLocaleString('pt-BR', { 
            year: 'numeric', month: '2-digit', day: '2-digit', 
            hour: '2-digit', minute: '2-digit'
        });
    },
    
    formatarValor(valor) {
        if (typeof valor !== 'number') return 'R$ 0,00';
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
  }
}
</script>

<style>
/* ------------------------------------------------ */
/* ESTILOS BASE E BACKGROUND */
/* ------------------------------------------------ */

#fundo {
  background-color: #000;
  height: 100vh;
  width: 100%;
}

section {
  background-image: linear-gradient(to right,
      rgba(0, 0, 0, 0.9),
      rgba(0, 20, 25, 0.5)),
    url("../../assets/img/dashboard-page.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  width: 100%;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.6);
  animation: fadeIn 2s ease-in-out forwards;
  
  
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(25px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ------------------------------------------------ */
/* ESTILOS DO CONTEINER GRÁFICO/FORMULÁRIO (Usando Grid) */
/* ------------------------------------------------ */

.grafico {
  background-color: transparent;
  border-radius: 10px;
  padding: 40px;
  max-width: 1200px;
  width: 90%;
  min-height: 500px;
  transition: .5s;
  color: white;
  
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  grid-template-rows: auto 1fr;
  gap: 30px;
}

.grafico:hover {
  background-color: rgba(0, 0, 0, 0.212);
  border: 1px solid rgba(12, 108, 146, 0.589);
}

.elementos-form {
    grid-column: 1 / 2;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.chart-container {
    grid-column: 2 / 3;
    height: 350px; /* 💡 ALTURA FIXA PARA O GRÁFICO */
    min-height: 250px;
    padding-top: 15px;
}

.chart-container h3 {
    text-align: center;
    color: #4dc2ff;
    margin-bottom: 10px;
}

.historico {
    grid-column: 1 / 3;
    margin-top: 0;
    padding-top: 20px;
    border-top: 1px dashed rgba(255, 255, 255, 0.2);
    max-height: 250px; 
    overflow-y: auto; 
}

/* ------------------------------------------------ */
/* ESTILOS DO FORMULÁRIO (MANTIDOS) */
/* ------------------------------------------------ */

.elementos-form h2 {
    text-align: center;
    margin-bottom: 25px;
    color: #4dc2ff;
}

.elementos {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  width: 100%;
}

select {
  flex-shrink: 0;
  width: 150px;
  padding: 10px;
  border-radius: 10px;
  outline: none;
  height: auto;
  border: 1px solid rgba(12, 108, 146, 0.589);
  background-color: #000;
  color: white;
}

.input {
  flex-grow: 1;
  border: 1px solid rgba(12, 108, 146, 0.589);
  padding: 15px;
  border-radius: 10px;
  background-color: #000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input label {
    font-size: 0.9em;
    color: rgba(255, 255, 255, 0.7);
}

.input input {
  width: 100%;
  box-sizing: border-box;
  outline: none;
  padding: 8px;
  border-radius: 5px;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.1em;
}

.btn-registrar {
    background-color: #1a73e8;
    color: white;
    padding: 12px 25px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s;
    margin-top: 20px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.btn-registrar:hover {
    background-color: #0d47a1;
    transform: translateY(-2px);
}

/* ------------------------------------------------ */
/* ESTILOS DO HISTÓRICO (MANTIDOS) */
/* ------------------------------------------------ */

.historico h3 {
    margin-bottom: 15px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.2em;
}

.historico-vazio {
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    padding: 10px;
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: 5px;
}

.lista-historico {
    list-style: none;
    padding: 0;
    margin: 0;
}

.item-historico {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-bottom: 8px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    font-size: 0.9em;
}

.item-historico .valor {
    font-weight: bold;
    flex-grow: 1; 
    text-align: right;
    margin-right: 20px;
}

.item-historico .data-hora {
    color: rgba(255, 255, 255, 0.6);
    flex-shrink: 0;
    font-size: 0.85em;
}

.item-historico .tipo {
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
    flex-shrink: 0;
    margin-right: 15px;
}

.tipo.entrada {
    background-color: #38a169;
    color: white;
}

.tipo.saida {
    background-color: #e53e3e;
    color: white;
}

/* ------------------------------------------------ */
/* MEDIA QUERIES (Responsividade) */
/* ------------------------------------------------ */

@media (max-width: 900px) {
    .grafico {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto 1fr;
        gap: 20px;
    }

    .elementos-form, .chart-container, .historico {
        grid-column: 1 / 2;
    }
}

@media (max-width: 600px) {
    .grafico {
        padding: 20px;
    }
    
    .elementos {
        flex-direction: column; 
        align-items: stretch;
    }
    
    select {
        width: 100%;
    }
    
    .item-historico {
        flex-wrap: wrap; 
        font-size: 0.85em;
    }
    
    .item-historico .tipo, .item-historico .data-hora {
        width: 100%;
        margin-right: 0;
        margin-bottom: 5px;
    }
    
    .item-historico .valor {
        text-align: left;
        order: 1;
    }
}
</style>