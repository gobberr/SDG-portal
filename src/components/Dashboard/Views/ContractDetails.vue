<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h4 class="card-title text-primary">Details of <b>{{contractName}}</b></h4><br>                            
              <button v-on:click="goBack()" class="btn btn-primary btn-fill btn-round btn-icon float-right"><i class="nc-icon nc-stre-left"></i> Go Back</button>       
              
              <!--<button v-on:click="modifyContract()" class="btn btn-warning btn-square btn-icon "><i class="nc-icon nc-settings-tool-66"></i> Modify</button> -->
              <button v-on:click="deployContractForm()" class="btn btn-primary btn-square btn-icon "><i class="nc-icon nc-cloud-upload-94"></i> Deploy</button>
              <button v-on:click="deleteContract().then(contractListPage())" class="btn btn-danger btn-square btn-icon "><i class="nc-icon nc-simple-remove"></i> Delete</button>
              
              <br><br>
              <p v-if="spinnerStatus"> Deploying.. <spinner :status="spinnerStatus" :rotation=true :depth=9 :size=70 color='#007bff'></spinner></p>
            </template>
          </card>
          
          <!-- Tabella con i dettagli del contratto -->
          <card v-if="tableOne.data[1] != {}">            
            <div class="row">
              <div class="col-12">
                <b-table id="tableOne" ref="tableOne" responsive bordered hover :items="tableOne.data" :fields="tableOne.fields">
                  <template slot="templateid" slot-scope="cell">
                    <a href="" @click.prevent="getTemplateDetails(cell.item)" class="link text-primary">{{templateName}}</a>
                  </template>               
                </b-table>
              </div>  
            </div>
          </card>
                    
          <!-- Dettagli del contratto -->
          <!--<card>
            <div class="row">
              <div class="col-md-12">
                <card>
                  <h4 class="card-title"><b>Contract values</b></h4><hr><br> <p v-html="html_preview"></p>
                </card>
              </div>              
            </div>      
          </card>
          <card>-->
          <card>
            <div class="row">
              <div class="col-md-12">
                <md-tabs class="md-transparent" md-alignment="fixed">
                  <md-tab id="solidity" md-label="Solidity">
                    <card>                      
                      <pre>
                        <br>{{templateSolidity}}
                      </pre>                        
                    </card>                  
                  </md-tab>    
                  <md-tab id="html_preview" v-if="html_preview != ''" md-label="Contract Values">
                    <card>
                      <p v-html="html_preview"></p>
                    </card>                 
                  </md-tab>                  
                                
                </md-tabs>              
              </div>               
            </div>                       
          </card>
          <!--
          <card>
            <div>

              <p v-html="tableOne.data[0].html"></p>
            </div>
          </card>

          <card>
            <div>

              {{tableOne.data[0].params}}
            </div>
          </card>-->

          <!-- deploy dialog -->
          <div class="col-md-6">
            <md-dialog :md-active.sync="deployDialog" >              
                <md-dialog-title>Deploy Contract<br></md-dialog-title>                              
                <div class="col-md-12">
                <md-radio v-for="(blockchain, index) in blockchainList" :key="index" :value="blockchain" v-model="selectedBlockchain"> {{blockchain.name}}</md-radio><br>                                
                <md-dialog-actions>
                  <md-button class="md-primary" v-if="isDeploying==false" @click="deployDialog = false">Close</md-button>
                  <md-button class="md-primary" v-if="isDeploying==false" @click="deployContract()">Deploy</md-button>
                </md-dialog-actions>
              </div>
            </md-dialog>
          </div>


                    
        </div>        
      </div>     
    </div>
  </div>          

</template>
<script>

  import Spinner from 'vue-spinner-component/src/Spinner.vue'
  import LTable from 'src/components/UIComponents/Table.vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'

  import axios from 'axios'
  import moment from 'moment'
  import {OWNER} from "../../../app.config"

  const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3, STATUS_SUBMITTED = 4, STATUS_SUBMIT_FAILED = 5;
  const tableOneColumns = [
    /*{
      key: 'id',      
      label: 'Id'
    },*/
    {
      key: 'owner',      
      label: 'Owner'
    },    
    {
      key: 'params.contractName',      
      label: 'Name'
    },
    {
      key: 'version',      
      label: 'Version'
    },    
    {
      key: 'date',       
      label: 'Date'      
    },
    {
      key: 'cid',
      label: 'Creator'
    },
    {
      key: 'templateid',      
      label: 'Template name'
    }
  ];

  export default {
    components: {
      LTable,
      Card,      
      Spinner,      
    },
    data() {
      return {
        spinnerStatus: false,
        currentStatus: null,
        title: this.$route.params.id,
        templateSolidity: "",
        tableOne: {
          fields: [...tableOneColumns],
          data: [{}]
        },
        contractList: null,
        contractDetails: {},
        deployDialog: false,
        selectedBlockchain: null,
        blockchainList: [],
        isDeploying: false,
        html_preview: '',
        templateName: '',
        contractName: ''
      }
    },
    
    mounted: function() {      
      this.getContractDetailsData();
      this.getBlockchainList();            
    },
    methods: {
      contractListPage: function() {
        this.$router.push("/contractList");
      },
      getContractDetailsData: function () {
        var http = axios.create({
          baseURL: process.env.VUE_APP_GENERATOR_ENDPOINT,          
        });
        http.get('/' + OWNER + '/contracts/')
        .then(response => {                    
          this.contractList = response.data                
          for(let i=0; i<this.contractList.length; i++) { 
            if(this.contractList[i].id == this.title) {
              this.tableOne.data.pop()
              this.tableOne.data.push(this.contractList[i]);
              //console.log(this.contractList[i].params)
              this.getTemplateFromContract(this.contractList[i].templateid, this.contractList[i])      
              this.contractDetails = this.contractList[i]
              this.contractName = this.contractList[i].params.contractName 
            }
          }   
        }).catch(e => { 
          console.log("Error: " + e.message);                     
        });
      },

      getTemplateFromContract: function(templateId, contractInfo) {
        var http = axios.create({
          baseURL: process.env.VUE_APP_GENERATOR_ENDPOINT,          
        });
        http.get('/' + OWNER + '/templates/' + templateId)
        .then(response => {         
                    
          //console.log(response.data.templatename)
          this.templateName = response.data.templatename
          this.html_preview = response.data.text          

          let mustacheVariable = this.getMustacheVariable(response.data.text) // array con le variabili mustache

          let htmlVariable = Object.keys(this.contractDetails.params) // array con le variabili html
          var tempArr = htmlVariable.filter(function(item) {
            return !mustacheVariable.includes(item); 
          });
          mustacheVariable = mustacheVariable.filter(function(item) {
            return !htmlVariable.includes(item); 
          });
          htmlVariable = tempArr;
          
          mustacheVariable = this.getMustacheVariable(response.data.text) // array con le variabili mustache
          
          // per ogni variabile mustache, rimpiazza key value dentro il html preview
          for(let i=0; i<mustacheVariable.length; i++) {            
            if(moment(contractInfo.params[mustacheVariable[i]].toString(), "YYYYMMDD", true).isValid()) { // true if the variable is a date
              let date = contractInfo.params[mustacheVariable[i]].toString()
              let formattedDate = date[6] + date[7] + "/" + date[4] + date[5] + "/" + date[0] + date[1] + date[2] + date[3] // convert from YYYYMMDD to DD/MM/YYYY
              this.html_preview = this.html_preview.replace("{{" + mustacheVariable[i] + "}}", "<b>" +  formattedDate + "</b>");
            } else {
              this.html_preview = this.html_preview.replace("{{" + mustacheVariable[i] + "}}", "<b>" + contractInfo.params[mustacheVariable[i]] + "</b>");
            }
            
            
          }          

          // per ogni params, rimpiazza key value dentro il html preview
          for(let i=0; i<htmlVariable.length; i++) {
            this.html_preview = this.html_preview.replace("[[" + htmlVariable[i] + "]]", "<b>" + contractInfo.params[htmlVariable[i]] + "</b>");
          }          

          this.templateSolidity = response.data.solidity 
        }).catch(e => { console.log("Error: " + e.message); });
      },

      getMustacheVariable: function(text) {
        //this.mustacheVariableOfTemplate = null
        let mustacheVariable = new Array()
        for(let i=0; i<text.length; i++) { // per ogni carattere della stringa        
          if((text[i] == '{') && (text[i+1] == '{') && (text[i+2] != '{')) { // se trova due '{'  è l'inizio di una variabile mustache
            let start_delimiter = i+2
            let end_delimiter = start_delimiter+1;
            while(end_delimiter <= text.length) { //scorri finché non trova due '}' oppure finisce la stringa
              if((text[end_delimiter+1] == '}') && (text[end_delimiter+2] == '}')) {
                let variable = text.substring(start_delimiter, end_delimiter+1);
                mustacheVariable.push(variable)
                break;
              }
              end_delimiter++;                                
            }
          }
        }
        return mustacheVariable;        
      },

      deleteContract: function() {
        if(confirm('Are you sure?')) {
          return new Promise((resolve, reject) => {             
            var http = axios.create({
              baseURL: process.env.VUE_APP_GENERATOR_ENDPOINT,                                   
            });
            http.delete('/' + OWNER + '/contracts/' + this.$route.params.id)
            .then(response => {             
              resolve(response.data);      
            })
            .catch(e => {
              console.log("Error: " + e.message);
              reject(e)
            })
          })
        }
      },
      goBack: function() {
        this.$router.go(-1)
      },
      modifyContract: function() {
        //this.$router.push("/contract/compile/" + this.$route.params.id);
        let routeData = this.$router.resolve("/contract/compile/" + this.$route.params.id);
        window.open(routeData.href, '_blank');
      },
      getTemplateDetails: function(item) {
        this.$router.push("/templateDetails/" + item.templateid);
      },
      deployContractForm: function() {
        this.deployDialog = true;
        this.selectedBlockchain = null
      },
      deployContract: function() {
        if(this.selectedBlockchain == null) {
          //this.selectBlockchainError = 'You must select a Blockchain'
          //this.showBlockchainError = true
          return
        }
        this.spinnerStatus = true;
        this.isDeploying = true;
        this.deployDialog = false; //nel .then
        for(let i=0; i<this.blockchainList.length; i++) {
          if(this.blockchainList[i].name == this.selectedBlockchain.name) {              
            axios.post(process.env.VUE_APP_PROXY_ENDPOINT + '/' + OWNER + '/smartcontracts/' +  this.selectedBlockchain.id, this.tableOne.data[0])
            .then(response => {          
              this.responseMsg = response.data
              this.spinnerStatus = false; //nel .then                      
              this.isDeploying = false;    
              this.$notify({
                message: 'Contract deployed',
                type: 'success',
                timeout: 10000,
                horizontalAlign: 'right',
                verticalAlign: 'bottom'
              })                    
            })        
            .catch(e => {
              this.responseMsg = e.message
              console.log("Error: " + e.message);
              this.spinnerStatus = false; //nel .then        
              this.deployDialog = false; //nel .then
              this.isDeploying = false;
              this.$notify({
                message: 'Error during contract deployment',
                type: 'danger',
                timeout: 10000,
                horizontalAlign: 'right',
                verticalAlign: 'bottom'
              })       
            })  
          }    
        }        
      },
      getBlockchainList: function() {
        return new Promise((resolve, reject) => {             
          var http = axios.create({
            baseURL: process.env.VUE_APP_PROXY_ENDPOINT,                                   
          });
          http.get('/' + OWNER + '/blockchains/')
          .then(response => {             
            for(let i=0; i<response.data.length; i++) {
              this.blockchainList.push(response.data[i])
            }
            resolve(response.data);            
          })
          .catch(e => {
            console.log("Error: " + e.message);
            reject(e)
          })
        })
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
  .decreaseMargin {
    margin-top: 0.05rem;
    margin-bottom: 0.05rem;
  }
  .md-checkbox {
    display: flex;
  }
  .md-dialog {
    max-width: 768px;
  }
  .demo-option {
    display: flex;
    flex-flow: wrap;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .select {
    margin: 0 6px;
    display: inline-flex;
    width: auto;
  }
</style>
