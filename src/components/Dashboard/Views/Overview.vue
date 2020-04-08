<template>
  <div class="content " >
    <div class="container-fluid">
      
      <!-- Counter -->
      <div class="row">
           
          <div class="col-xl-3">           
            <stats-card>
              <div slot="header" class="icon-warning">
                <i class="fa fa-sm fa-file-code-o text-secondary"></i>
              </div>
              <div slot="content">
                <p class="card-category">Number of Templates</p>
                <h4 class="card-title">{{number.template}}</h4>
              </div>
              <div slot="footer">
                <i class="fa fa-refresh"></i>Updated now
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3">
            <stats-card>
              <div slot="header" class="icon-success">
                <i class="fa fa-sm fa-file-text text-secondary"></i>
              </div>
              <div slot="content">
                <p class="card-category">Number of Contracts</p>
                <h4 class="card-title">{{number.contract}}</h4>
              </div>
              <div slot="footer">
                <i class="fa fa-refresh"></i>Updated now
              </div>
            </stats-card>
          </div>          
        
          <div class="col-xl-3">
            <stats-card>
              <div slot="header" class="icon-success">
                <i class="fa fa-sm fa-paper-plane-o text-secondary"></i>
              </div>
              <div slot="content">
                <p class="card-category">Number of Smart Contracts</p>
                <h4 class="card-title">{{number.smartcontract}}</h4>
              </div>
              <div slot="footer">
                <i class="fa fa-refresh"></i>Updated now
              </div>
            </stats-card>
          </div>

          <div class="col-xl-3">
            <stats-card>
              <div slot="header" class="icon-success">
                <i class="fa fa-sm fa-cogs text-secondary"></i>
              </div>
              <div slot="content">
                <p class="card-category">Number of Blockchains</p>
                <h4 class="card-title">{{number.blockchain}}</h4>
              </div>
              <div slot="footer">
                <i class="fa fa-refresh"></i>Updated now
              </div>
            </stats-card>
          </div>       
        </div>
      </div>
      
      
      <div class="row">        

        <!-- Issued token ChartPie Mokup -->
        <div class="col-xl-4">
          <chart-card :chart-data="pieChart.data" chart-type="Pie">
            <template slot="header">
              <h4 class="card-title" align="center">Smart Contract issued tokens</h4>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> Smart contract 1 <br>
                <i class="fa fa-circle text-danger"></i> Smart contract 2<br>
                <i class="fa fa-circle text-warning"></i> Smart contract 3<br>
              </div>
              <hr>
              <div class="stats">
                <i class="fa fa-refresh"></i>Updated now
              </div>  
            </template>
          </chart-card>
        </div>        
      

        <!-- Google Charts test -->           
        <div class="col-xl-8">
          <card>
            <h4 class="card-title" align="center">Overview of tokens movements</h4>
            <GChart type="ColumnChart" :data="chartData" :options="chartOptions" />
            <hr>
            <div class="stats">
              <i class="fa fa-refresh"></i>Updated now
            </div>  
          </card>
        </div>
      </div>
    </div>

</template>
<script>  

  import ChartCard from 'src/components/UIComponents/Cards/ChartCard.vue'
  import StatsCard from 'src/components/UIComponents/Cards/StatsCard.vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'  
  import AuthService from '../../../services/AuthService.js';  
  import axios from 'axios';  
  import {AUTH_REQUEST} from 'src/store/actions/auth'
  import {OWNER} from "../../../app.config";
  import { GChart } from 'vue-google-charts'

  export default {
    components: {      
      Card,      
      StatsCard,
      ChartCard,
      GChart
    },
    data() {
      return {
        number: {
          template: 0,
          contract: 0,
          blockchain: 0,  
          smartcontract: 0        
        },
        pieChart: {
          data: {
            labels: ["48%", "37%","15%"],
            series: [48, 37,15]
          }
        },
        auth: new AuthService(),
        
        chartData: [
          ['Month', 'Issued', 'Earn', 'Spent'],
          ['December', 1000, 400, 200],
          ['January', 1170, 460, 250],
          ['February', 660, 1120, 300],
          ['March', 1030, 540, 350]
        ],
        chartOptions: {
          chart: {
            title: 'Company Performance',
            subtitle: 'Sales, Expenses, and Profit: 2014-2017',
          }
        }
      }
    },
    mounted() {
      if(this.isAuthenticated()) {
        //console.log('user is authenticated')
        this.getTemplateCounter()
        this.getContractCounter()
        this.getBlockchainCounter()
        this.getSmartContractCounter()        
      } else {        
        // same of login button of login page
        //console.log('user is not autenticated')
        this.auth.getUser().then((response) => {
          if(response != null) {            
            this.$store.dispatch(AUTH_REQUEST, { userInfo: response }).then(() => {                                
              let routeData = this.$router.resolve('/');
              this.$router.go(routeData);    
              this.auth.login()    
            })              
          } else { // no user found in localStorage, so redirect to AC for login            
            this.auth.login()
          }
        })        
      } 
    },
    methods: {

      isAuthenticated: function() {
        if (this.$store.getters.isAuthenticated) {          
          return true
        } else {
          return false
        }
      },

      logout: function() {
        this.auth.logout();
      },
      
      getTemplateCounter: function () {      
        var http = axios.create({
          baseURL: process.env.VUE_APP_GENERATOR_ENDPOINT,         
        });
        http.get('/' + OWNER + '/templates/').then(response => {  
          let data = response.data;        
          this.number.template = data.length;
        }).catch(e => {          
          //console.log("Error: " + e.message);
        });
      },

      getContractCounter: function () {
        var http = axios.create({
          baseURL: process.env.VUE_APP_GENERATOR_ENDPOINT,         
        });
        http.get('/' + OWNER + '/contracts/').then(response => {  
          let data = response.data;        
          this.number.contract = data.length;
        }).catch(e => {
          //console.log("Error: " + e.message);
        });
      },

      getBlockchainCounter: function () {
        var http = axios.create({
          baseURL: process.env.VUE_APP_PROXY_ENDPOINT,         
        });
        http.get('/' + OWNER + '/blockchains/').then(response => {  
          let data = response.data;        
          this.number.blockchain = data.length;
        }).catch(e => {
          //console.log("Error: " + e.message);
        });
      },
      
      getSmartContractCounter: function () {
        var http = axios.create({
          baseURL: process.env.VUE_APP_PROXY_ENDPOINT,         
        });
        http.get('/' + OWNER + '/smartcontracts/').then(response => {  
          let data = response.data;        
          this.number.smartcontract = data.length;
        }).catch(e => {
          //console.log("Error: " + e.message);
        });
      },      
    }
  }
</script>
<style>
  .central {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
    margin-top: 0.75rem;
  }

  .img-size-fix {
    width: 100px;
    height: 100px;
  }

  .top-logo-heading-overview {
    width: 17%;
    margin-bottom: 0rem;
    margin-top: 0rem;
  }
</style>
