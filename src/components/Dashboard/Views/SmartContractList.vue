<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>


            <template slot="header">
              <h4 class="card-title text-primary">Smart Contract list</h4>              
              <div class="row">  
                <div class="col-md-10">
                </div>                
                <div class="col-md-2 align-items-end" >
                  <h5>Available Owners:</h5>                  
                  <b-select v-model="selected" @change="updateOwnerAndRefreshTable()">
                    <option v-for="option in options" v-bind:value="option.value" >
                      {{ option.text }}
                    </option>
                  </b-select>                  
                </div>
              </div>          
            </template>

            <!-- SmartContract List Table-->
            <b-table v-if="tableOne.data.length > 0" id="tableOne" :no-provider-sorting=true ref="tableOne" responsive bordered hover :items="tableOne.data" :fields="tableOne.fields">
              <template slot="id" slot-scope="cell">
                 <a href="" @click.prevent="showDetails(cell.item)" class="link text-primary"><i class="fa fa-2x fa-search-plus" aria-hidden="true"></i></a>
              </template>
            </b-table>

            <!-- Messaggio template not found -->
            <!--
            <h3 v-if="tableOne.data.length<=0"> No smart contracts found for Owner <b>{{selected}}</b> </h3><br>
            -->
            <h3 v-if="noSmartContractsFoundMessage"> No smart contracts found for Owner <b>{{selected}}</b> </h3><br>

            <!-- Pagination -->
            <card v-if="tableOne.data.length > 0 || page > 0">
              <div class="row justify-content-center d-flex align-items-center" > 
                <div class="col-md-3">                  
                  <md-button class="md-dense md-primary" :disabled="page<1 || (tableOne.data.lenght < rowPerPage && tableOne.data.lenght != 0)" v-on:click="decreasePage()"><i class="fa fa-chevron-left" aria-hidden="true"></i></md-button>
                </div>
                <div class="col-md-6 d-flex align-items-center">    
                  <md-button class="md-primary" :disabled="rowPerPage<2" v-on:click="decreaseSmartContractPerPage()"> - </md-button>
                  <label> Show <b> {{ rowPerPage }} </b> Contracts per page </label>
                  <md-button class="md-primary" :disabled="rowPerPage>19" v-on:click="increaseSmartContractPerPage()"> + </md-button>
                </div>
                <div class="col-md-3">
                  <md-button class="md-dense md-primary" :disabled="tableOne.data.length<=0 || (tableOne.data.length < rowPerPage && tableOne.data.length != 0)" v-on:click="increasePage()"><i class="fa fa-chevron-right" aria-hidden="true"></i></md-button>
                  <button v-on:click="refreshTableOne()" class="btn btn-fill btn-round btn-primary btn-icon float-right"><i class="fa fa-refresh"></i> Refresh</button>
                </div>
              </div>
            </card>

          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment';
  import LTable from 'src/components/UIComponents/Table.vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import axios from 'axios'    
  import {OWNER} from "../../../app.config"

		 			
  const tableOneColumns = [
    {
      key: 'id',      
      label: 'Details'
    },
    {
      key: 'owner',      
      label: 'Owner'
    },
    {
      key: 'date',      
      label: 'Deploy Date'
    },
    {
      key: 'contract.params.contractName',
      label: 'Contract Name'
    },
  ];
  export default {

    components: {
      LTable,
      Card
    },

    data() {
      return {
        tableOne: {
          fields: [...tableOneColumns],
          data: []
        },
        rowPerPage: 10,
        page: 0,  
        
        selected: 'Hera',
        options: [
          { text: 'Hera', value: 'Hera' },
          { text: 'DFIL-Tech', value: 'DFIL-Tech' },
          
        ],
        noSmartContractsFoundMessage: false
      }
    },

    created: function() {
      this.getSmartContracts();
    },

    methods: {

      increaseSmartContractPerPage: function () {        
        this.rowPerPage ++;
      },

      decreaseSmartContractPerPage: function () {
        this.rowPerPage --;
      },

      increasePage: function () {        
        this.page ++;
        this.tableOne.data = []
        this.getSmartContracts()
      },      

      decreasePage: function () {        
        this.page --;
        this.tableOne.data = []
        this.getSmartContracts()
      },

      getSmartContracts: function () {
        var http = axios.create({
          baseURL: process.env.VUE_APP_PROXY_ENDPOINT,          
        });
        http.get('/' + this.selected + '/smartcontracts/?limit=' + this.rowPerPage + '&offset=' + this.page)
        .then(response => {
          if(response.data.length==0) {
            this.noSmartContractsFoundMessage = true
          } else {
            this.noSmartContractsFoundMessage = false
          }
          this.tableOne.data = response.data          
        }).catch(e => { 
          console.log("Error: " + e.message); 
          this.tableOne.data = []
        });
      },

      refreshTableOne: function() {
        this.$refs.tableOne.refresh();
        this.getSmartContracts()
      },

      updateOwnerAndRefreshTable: function() {
        this.getSmartContracts()
      },

      showDetails(item) {
        var app = this;
        app.$router.push("/smartContractDetails/" + item.id);
      }
    }
  }
</script>
<style>
  th {
    color: black !important;
    font-weight: bold !important;
    background-color: lightgray;
    height: 50px;
  }
</style>
