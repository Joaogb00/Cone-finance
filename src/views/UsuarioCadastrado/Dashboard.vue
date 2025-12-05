<template>
  <main id="fundo">
    <section>
      <Header-cadastrado />

      <div class="grafico">
        
        <form @submit.prevent="registrarOperacao" class="elementos-form">
          <h2>Registro de Transação, {{ username }}</h2>
          
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
                <li v-for="op in historicoOperacoes" :key="op._id || op.dataHora.getTime()" class="item-historico">
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
import { ref, computed, onMounted } from 'vue';
import Footer from '../../components/Footer.vue';
import HeaderCadastrado from '../UsuarioCadastrado/Header-cadastrado.vue';
import BarChart from '../../components/BarChart.vue'; 
import axios from 'axios';

// 🚨 ATENÇÃO: Substitua esta URL pela URL base do seu servidor backend (ex: http://localhost:3000/api)
const API_BASE_URL = 'http://localhost:3000/api'; 

export default {
    name: 'Dashboard',
    components: {
        Footer,
        HeaderCadastrado,
        BarChart
    },
    setup() {
        // Variáveis reativas (estado)
        const operacaoSelecionada = ref('entrada');
        const valorOperacao = ref(null);
        const historicoOperacoes = ref([]);
        const username = ref('Cliente');

        // 💡 NOVO MÉTODO: Trata erros de autenticação (401) de forma centralizada
        const handleAuthError = () => {
            console.warn("Token inválido ou expirado. Limpando localStorage e solicitando novo login.");
            
            // 1. Remove o token inválido (limpeza)
            localStorage.removeItem('userToken');
            localStorage.removeItem('userName');
            
            alert("Sessão expirada ou usuário não autenticado. Faça login novamente.");
            
            // 2. O ideal é usar o Vue Router aqui para redirecionar para a tela de login:
            // if (this.$router) {
            //     this.$router.push('/login');
            // }
        };

        // FUNÇÃO AUXILIAR: Obtém o token e trata o erro de autenticação
        const getAuthHeaders = () => {
            const token = localStorage.getItem('userToken');
            if (!token) {
                // Se o token nem sequer existe, chama o erro de autenticação
                handleAuthError();
                return null;
            }
            return {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            };
        };

        // FUNÇÃO: Busca e popula o histórico de transações
        const buscarHistorico = async () => {
            const authHeaders = getAuthHeaders();
            if (!authHeaders) return;

            try {
                const response = await axios.get(`${API_BASE_URL}/transacoes`, authHeaders);
                
                // Mapeia, garantindo que dataHora seja um objeto Date, e inverte a ordem
                historicoOperacoes.value = response.data.map(op => ({
                    ...op,
                    dataHora: new Date(op.dataHora)
                })).reverse();
            
            } catch (error) {
                console.error("Erro ao buscar histórico:", error.response || error);
                
                // 💡 AJUSTE: Trata o erro 401 chamando a função centralizada
                if (error.response && error.response.status === 401) {
                     handleAuthError();
                } else {
                     alert("Erro ao carregar o histórico de transações.");
                }
            }
        };

        // FUNÇÃO: Registra a nova transação no backend
        const registrarOperacao = async () => {
            if (!valorOperacao.value || valorOperacao.value <= 0) {
                alert('Por favor, insira um valor válido maior que zero.');
                return;
            }

            const authHeaders = getAuthHeaders();
            if (!authHeaders) return;

            const dataHoraAtual = new Date();

            const novaOperacaoData = {
                tipo: operacaoSelecionada.value,
                valor: valorOperacao.value,
                dataHora: dataHoraAtual.toISOString()
            };
            
            try {
                const response = await axios.post(`${API_BASE_URL}/transacoes`, 
                    novaOperacaoData, 
                    authHeaders
                );
                
                // Adiciona a nova transação no topo do histórico local
                historicoOperacoes.value.unshift({
                    ...novaOperacaoData,
                    dataHora: dataHoraAtual,
                    _id: response.data._id
                }); 

                valorOperacao.value = null; 
                alert(`Transação de ${operacaoSelecionada.value.toUpperCase()} registrada com sucesso!`);
                
            } catch (error) {
                console.error("Falha ao salvar a transação:", error.response || error);
                
                // 💡 AJUSTE: Trata o erro 401 também no registro
                if (error.response && error.response.status === 401) {
                    handleAuthError();
                } else {
                    alert("Erro ao registrar a transação. Verifique a conexão com a API.");
                }
            }
        };

        // FUNÇÃO: Formatação do valor (Moeda)
        const formatarValor = (valor) => {
            if (typeof valor !== 'number') return 'R$ 0,00';
            return valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
        };
        
        // FUNÇÃO: Formatação da Data/Hora
        const formatarData = (data) => {
            if (!(data instanceof Date) || isNaN(data)) return 'Data Inválida'; 

            return data.toLocaleString('pt-BR', { 
                year: 'numeric', month: '2-digit', day: '2-digit', 
                hour: '2-digit', minute: '2-digit'
            });
        };

        // PROPRIEDADE COMPUTADA: Calcula totais para o gráfico
        const dadosParaGrafico = computed(() => {
            let totalEntrada = 0;
            let totalSaida = 0;
            
            historicoOperacoes.value.forEach(op => {
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
                        label: 'Total Acumulado (R$)',
                        backgroundColor: ['#48bb78', '#f56565'],
                        data: [totalEntrada, totalSaida]
                    }
                ]
            };
        });

        // LIFECYCLE HOOK: Executa ao montar o componente
        onMounted(() => {
            const storedName = localStorage.getItem('userName');
            if (storedName) {
                username.value = storedName.split(' ')[0];
            }
            buscarHistorico(); 
        });

        return {
            operacaoSelecionada,
            valorOperacao,
            historicoOperacoes,
            username,
            dadosParaGrafico,
            registrarOperacao,
            formatarValor,
            formatarData
        };
    }
}
</script>

<style scoped>
/* ------------------------------------------------ */
/* ESTILOS BASE E BACKGROUND */
/* ------------------------------------------------ */

#fundo {
    background-color: #000;
    height: 115vh;
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
    height: 115vh;
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
/* ESTILOS DO CONTEINER GRÁFICO/FORMULÁRIO (Grid) */
/* ------------------------------------------------ */

.grafico {
    background-color: rgba(0, 0, 0, 0.2); 
    border: 1px solid rgba(12, 108, 146, 0.2);
    border-radius: 12px;
    padding: 40px;
    max-width: 1200px;
    width: 90%;
    min-height: 500px;
    color: white;
    
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    grid-template-rows: auto 1fr; 
    gap: 30px;
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5); 
    backdrop-filter: blur(5px);
    transition: all 0.3s ease;
}

.elementos-form {
    grid-column: 1 / 2;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.chart-container {
    grid-column: 2 / 3;
    height: 350px; 
    min-height: 250px; 
    padding-top: 15px;
}

.chart-container h3 {
    text-align: center;
    color: #4dc2ff;
    margin-bottom: 20px;
    font-size: 1.5em;
}

.historico {
    grid-column: 1 / 3; 
    margin-top: 0;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    max-height: 280px; 
    overflow-y: auto; 
}

.historico::-webkit-scrollbar {
    width: 8px;
}
.historico::-webkit-scrollbar-thumb {
    background-color: #00aaff;
    border-radius: 4px;
}
.historico::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
}


/* ------------------------------------------------ */
/* ESTILOS DO FORMULÁRIO */
/* ------------------------------------------------ */

.elementos-form h2 {
    text-align: left; 
    margin-bottom: 25px;
    color: #4dc2ff;
    font-size: 1.8em;
}

.elementos {
    display: flex;
    align-items: center; 
    gap: 20px;
    width: 100%;
}

select {
    flex-shrink: 0;
    width: 150px;
    padding: 12px 10px;
    border-radius: 10px;
    outline: none;
    height: auto;
    border: 1px solid #4dc2ff; 
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
}

.input {
    flex-grow: 1;
    border: 1px solid #4dc2ff;
    padding: 15px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.5);
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
    background: linear-gradient(90deg, #4dc2ff, #00aaff); 
    color: #000;
    padding: 12px 25px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 700;
    transition: all 0.3s ease;
    margin: 30px 0 0 0;
    width: 100%;
    box-shadow: 0 4px 15px rgba(0, 170, 255, 0.4);
}

.btn-registrar:hover {
    background: linear-gradient(90deg, #00aaff, #4dc2ff);
    transform: translateY(-1px) scale(1.01);
}

/* ------------------------------------------------ */
/* ESTILOS DO HISTÓRICO */
/* ------------------------------------------------ */

.historico h3 {
    color: #4dc2ff;
    font-size: 1.4em;
    padding-bottom: 10px;
    position: sticky;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 10;
}

.historico-vazio {
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    padding: 10px;
    border: 1px dashed rgba(255, 255, 255, 0.3);
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
    padding: 12px 15px; 
    margin-bottom: 10px;
    background-color: rgba(255, 255, 255, 0.05); 
    border-radius: 5px;
    font-size: 0.9em;
    transition: background-color 0.2s;
}

.item-historico:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.item-historico .valor {
    color: #fff;
    font-weight: bold;
    flex-grow: 1; 
    text-align: right;
    margin-right: 20px;
    font-size: 1.1em;
}

.item-historico .data-hora {
    color: rgba(255, 255, 255, 0.7);
    flex-shrink: 0;
    font-size: 0.9em;
}

.item-historico .tipo {
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
    flex-shrink: 0;
    margin-right: 15px;
}

.tipo.entrada {
    background-color: #48bb78;
    color: white;
}

.tipo.saida {
    background-color: #f56565;
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
        top: 55%;
    }

    .elementos-form, .chart-container, .historico {
        grid-column: 1 / 2;
    }
    
    .elementos-form h2 {
        text-align: center;
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