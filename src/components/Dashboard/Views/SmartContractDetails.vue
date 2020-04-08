<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">          
          <card>
            <template slot="header">
              <h4 class="card-title text-primary">Details of Smart Contract <b>{{tableOne.data[0].contract.params.contractName}}</b></h4>  
              <button v-on:click="smartContractListPage()" class="btn btn-primary btn-fill btn-round btn-icon float-right"><i class="nc-icon nc-stre-left"></i> Go Back</button><br>       
              <button v-on:click="deleteSmartContract().then(smartContractListPage())" class="btn btn-danger btn-square btn-icon "><i class="nc-icon nc-simple-remove"></i> Delete</button>              
            </template>
          </card>
          

          <!-- Tabella overview smart contract -->
          <card>          
            <div class="row">
              <div class="col-12">
                <b-table id="tableOne" :no-provider-sorting=true ref="tableOne" responsive bordered hover :items="tableOne.data" :fields="tableOne.fields">
                  <template slot="contract.params.contractName" slot-scope="cell">
                    <a href="" @click.prevent="contractDetailsPage(cell.item)" class="link text-primary">{{tableOne.data[cell.index].contract.params.contractName}}</a>
                  </template>                
                </b-table>
              </div>  
            </div>
          </card>
          

          <!-- Tabs con i dettagli dello smart contract -->
          <card>            
            <md-tabs class="md-transparent" md-alignment="fixed">
              <md-tab id="abi" md-label="Functions">
                <card v-if='abi.length>0'>                                        
                  <br>                  
                  <div class="row">
                    <div class="col-md-2 align-items-end">
                      <h5>Availables methods: </h5>
                      <b-select v-model="selectedMethod" @change="updateMethodDetails()">                      
                        <option v-for="functions in abi"  v-bind:key="functions.name">
                          <span>
                            {{ functions.name }}
                          </span>                            
                        </option>                                            
                      </b-select>
                    </div>
                    
                    <!-- input field for transaction that modify the state of blockchain -->
                    <div class="col-md-4 align-items-end" v-if="showInputBox">
                      <h5>Inputs: </h5>
                      <div v-for="(input, index) in inputMatrix" v-bind:key="index"> 
                        {{input[0]}} : <input :type="input[1]" v-model="input[2]"><br>
                      </div>
                      
                    </div>

                    <div class="col-md-2 align-items-end d-flex align-items-bottom" v-if="selectedMethod != ''">
                      <button class="btn btn-primary btn-icon btn-fill" :disabled="executedButtonDisabled" @click="executeTransaction()"><i class="fa fa-sm fa-paper-plane-o"></i>&nbsp;&nbsp;&nbsp;Execute</button>
                    </div>
                    <div class="col-md-4 align-items-end" v-if="methodResult != null">
                      <h5>Response: </h5>
                      {{methodResult}}
                    </div>
                  </div>
                </card>
                <card v-else>                      
                  <h4> No functions found on smart contract</h4>
                </card>                  
              </md-tab>

              <md-tab id="solidity" md-label="Solidity">
                <card>                                        
                  <pre><br>{{smartContract.contract.solidity}}</pre>                        
                </card>                  
              </md-tab>            
              <md-tab id="html" md-label="Contract values" v-if="html_preview.length>0">
                <card>
                  <br><p v-html="html_preview"></p>
                </card>
              </md-tab>
            </md-tabs>              
          </card>     

          <!-- 
          <card>
            {{methodDetails}}
          </card>
          -->
        </div>        
      </div>     
    </div>
  </div>
  
</template>
<script>
  
  import LTable from 'src/components/UIComponents/Table.vue'
  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import axios from 'axios'
  import {OWNER} from "../../../app.config" 

  const tableOneColumns = [    
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
      label: 'contract Name'
    },
    {
      key: 'address',      
      label: 'Address'
    },        
    {
      key: 'blockchains[0].name', 
      label: 'Blockchain'
    }
  ];

  export default {
    components: {
      LTable,
      Card      
    },

    data() {
      return {
        title: this.$route.params.id,
        templateInfo: null,
        tableOne: {
          fields: [...tableOneColumns],
          data: []
        },
        smartContract: null,                
        blockchainList: [],
        html_preview: '',
        abi: [],
        selectedMethod: "",
        methodDetails: {},
        methodResult: null,
        executedButtonDisabled: false,
        showInputBox: false,
        inputMatrix: [], // matrix to append in the input box. Example: [[input1,int,InsertedValue],[input2,string,InsertedValue]]
      }
    },
    
    mounted: function() {      
      this.getSmartContractById();
      this.getBlockchainName();          
    },

    methods: {
            
      getSmartContractById: function () {
        var http = axios.create({
          baseURL: process.env.VUE_APP_PROXY_ENDPOINT,          
        });
        http.get('/' + OWNER + '/smartcontracts/' + this.$route.params.id)
        .then(response => {                               
          for(let i=0; i<JSON.parse(response.data.abi).length; i++) {            
            if(JSON.parse(response.data.abi)[i].type == "function") { // mostra solo se il metodo è type=function
              //console.log(JSON.parse(response.data.abi)[i])
              this.abi.push(JSON.parse(response.data.abi)[i])
            }            
          }          
          this.tableOne.data.push(response.data);
          this.smartContract = response.data
          this.getTemplateFromContract(response.data.contract.templateid, response.data.contract.params)          
        }).catch(e => { 
          console.log("Error: " + e.message); 
        });
      },

      updateMethodDetails: function() {     
        this.executedButtonDisabled = false      
        this.inputMatrix = []              
        this.methodResult = null
        for(let i=0; i<this.abi.length; i++) {
          if(this.abi[i].name == this.selectedMethod) {
            this.methodDetails = this.abi[i]
            if(this.methodDetails.inputs.length > 0) { // se il metodo ha degli input                               
              this.showInputBox = true              
              for(let j=0; j<this.methodDetails.inputs.length; j++) { // per ogni input del metodo
                //console.log(j, this.methodDetails.inputs[j].name, this.methodDetails.inputs[j].type)      
                switch (this.methodDetails.inputs[j].type) { // in base al tipo del parametro del metodo, aggiungo il relativo input box
                  case "uint256":
                    this.inputMatrix.push([this.methodDetails.inputs[j].name, "number" , null]) // se uint256
                    break;
                  case "uint":
                    this.inputMatrix.push([this.methodDetails.inputs[j].name, "number" , null]) // se uint 
                    break;
                  default: 
                    this.inputMatrix.push([this.methodDetails.inputs[j].name, "text" , null]) // altrimenti il campo è una generica stringa                              
                }                
              }              
            } else {              
              this.showInputBox = false
              
            } 
          }
        }
      },

      executeTransaction: function() {

        // prepare output fields for tx array
        this.executedButtonDisabled = true

        //console.log(this.methodDetails)

        //configure gli input
        let inputFields = []
        for(let i=0; i<this.inputMatrix.length; i++) {                  
          if(this.inputMatrix[i][1] == "number") { // provo a vedere se è un numero, se si lo converto altimenti lo lascio string)
            inputFields.push(Number(this.inputMatrix[i][2])) 
          } else {
            inputFields.push(this.inputMatrix[i][2])
          }                      
        }

        // configuro gli output
        let outputsFields = []         
        for(let i=0; i<this.methodDetails.outputs.length; i++) {                    
          switch(this.methodDetails.outputs[i].type) {
            case "string":
              outputsFields.push('string')
              break;
            case "byte32":
              outputsFields.push('string')
            case "address":
              outputsFields.push('address')
              break;
            case "uint256":
              outputsFields.push('int')
              break;
            default:
              //console.log('unsupported type')
          }
        }      

        let changeBlockchainState = false;
        if((this.methodDetails.stateMutability != "view") && (this.methodDetails.stateMutability != "pure")) { //TODO: ensure that this if is respecting the expected behavior
          changeBlockchainState = true
        }

        // define tx array
        let txArray = {
          "blockchainIdentifier": this.smartContract.blockchains[0].id,
          "contractIdentifier": this.tableOne.data[0].address,
          "functionPayload": {
            "changeBlockchainState":  changeBlockchainState,
            "functionName": this.selectedMethod,
            "input": inputFields,
            "output": outputsFields,
            "walletId": "not_yet_implemented"
          },
          "senderIdentifier": "0x627306090abaB3A6e1400e9345bC60c78a8BEf57" 
        }
        
        //console.log(txArray)
        // send call to proxy
        var http = axios.create({
          baseURL: process.env.VUE_APP_PROXY_ENDPOINT,          
        });
        http.post('/' + OWNER + '/call/', txArray)
        .then(response => {                      
          this.methodResult = response.data      
          this.executedButtonDisabled = false    
        }).catch(e => { this.methodResult = e });
      },
      
      getTemplateFromContract: function(templateId, params) {
        var http = axios.create({
          baseURL: process.env.VUE_APP_GENERATOR_ENDPOINT,          
        });
        http.get('/' + OWNER + '/templates/' + templateId)
        .then(response => {           
          this.templateInfo = response.data                  
          this.html_preview = response.data.text
          let mustacheVariable = this.getMustacheVariable(response.data.text)
          // per ogni variabile, la rimpiazza dentro la preview html
          for(let i=0; i<mustacheVariable.length; i++) {
            this.html_preview = this.html_preview.replace("{{" + mustacheVariable[i] + "}}", "<b>" + params[mustacheVariable[i]] + "</b>");
          }          
        }).catch(e => { 
          console.log("Error: " + e.message); 
        });
      },
      getMustacheVariable: function(text) {        
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
      contractDetailsPage: function(item) {
        var app = this;
        app.$router.push("/contractDetails/" + this.tableOne.data[0].contract.id);
      },
      smartContractListPage: function() {
        this.$router.push("/SmartContractList");
      },      
      getBlockchainName: function() {
        return new Promise((resolve, reject) => {             
          var http = axios.create({
            baseURL: process.env.VUE_APP_PROXY_ENDPOINT,                                   
          });
          http.get('/' + OWNER + '/blockchains/')
          .then(response => {             
            //console.log(response.data)
            for(let i=0; i<response.data.length; i++) {
              this.blockchainList.pop()
              this.blockchainList.push(response.data[i].name)
            }
            resolve(response.data);            
          })
          .catch(e => {
            console.log("Error: " + e.message);
            reject(e)
          })
        })
      },
      deleteSmartContract: function() {
        if(confirm('Are you sure?')) {
          return new Promise((resolve, reject) => {             
            var http = axios.create({
              baseURL: process.env.VUE_APP_PROXY_ENDPOINT,                                   
            });
            http.delete('/' + OWNER + '/smartcontracts/' + this.$route.params.id)
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
</style>
