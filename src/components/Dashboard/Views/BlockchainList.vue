<template>
  <div class="content">
    <div class="container-fluid">

      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h4 class="card-title text-primary">Blockchain settings</h4>
              
              <!-- POST BLOCKCHAIN -->
              <div>
                <md-dialog :md-active.sync="postDialog" >
                  <md-dialog-title>Add a new blockchain</md-dialog-title>
                  <md-tabs md-dynamic-height>
                    <md-tab md-label="General Info">
                      <div class="row">
                        <div class="col-md-6">
                          <md-field>
                            <label for="owner">Owner: {{owner}}</label>
                            <md-input name="owner" id="owner" :disabled="true" /></md-field>
                        </div>
                        <div class="col-md-6">
                          <md-field>
                            <label for="name">Name</label>
                            <md-input name="name" id="name" v-model="blockchain.name"/></md-field>
                        </div>
                        <div class="col-md-6">
                          <md-field>
                            <label for="host">Host</label>
                            <md-input name="host" id="host" v-model="blockchain.host"/></md-field>
                        </div>
                        <div class="col-md-6">
                          <md-field>
                            <label for="port">Port</label>
                            <md-input name="port" id="port" v-model="blockchain.port"/></md-field>
                        </div>
                        <div class="col-md-6">
                          <md-field>
                            <label for="platform">Platform</label>
                            <md-input name="platform" id="platform" v-model="blockchain.blockchain_platform"/></md-field>
                        </div>
                        <div class="col-md-6">
                          <md-field>
                            <label for="networkId">Network Id</label>
                            <md-input name="networkId" id="networkId" v-model="blockchain.networkId"/></md-field>
                        </div>
                      </div>                    
                    </md-tab>
                  </md-tabs>
                  <md-dialog-actions>
                    <md-button class="md-primary" @click="postDialog = false">Close</md-button>
                    <md-button class="md-primary" @click="postBlockchain()">Save</md-button>
                  </md-dialog-actions>
                </md-dialog>
              </div>

              <!-- PUT BLOCKCHAIN -->    
              <div v-if="putDialog==true">
                <md-dialog :md-active.sync="putDialog" >
                  <md-dialog-title>Modify blockchain <b>{{blockchain.name}}</b></md-dialog-title>
                  <md-tabs md-dynamic-height>
                    <md-tab md-label="General Info">
                      <div class="row">
                        <div class="col-md-6">
                          <md-field>
                            <label for="owner">Owner: {{owner}}</label>
                            <md-input name="owner" id="owner" :disabled="true" /></md-field>
                        </div>
                        <div class="col-md-6">
                          <md-field>
                            <label for="name">Name</label>
                            <md-input name="name" id="name" v-model="blockchain.name"/></md-field>
                        </div>
                        <div class="col-md-6">
                          <md-field>
                            <label for="host">Host</label>
                            <md-input name="host" id="host" v-model="blockchain.host"/></md-field>
                        </div>
                        <div class="col-md-6">
                          <md-field>
                            <label for="port">Port</label>
                            <md-input name="port" id="port" v-model="blockchain.port"/></md-field>
                        </div>
                        <div class="col-md-6">
                          <md-field>
                            <label for="platform">Platform</label>
                            <md-input name="platform" id="platform" v-model="blockchain.blockchain_platform"/></md-field>
                        </div>
                        <div class="col-md-6">
                          <md-field>
                            <label for="networkId">Network Id</label>
                            <md-input name="networkId" id="networkId" v-model="blockchain.networkId"/></md-field>
                        </div>
                      </div>                    
                    </md-tab>
                  </md-tabs>
                  <md-dialog-actions>
                    <md-button class="md-primary" @click="putDialog = false">Close</md-button>
                    <md-button class="md-primary" @click="putBlockchain()">Save</md-button>
                  </md-dialog-actions>
                </md-dialog>
              </div>

              <button class="btn btn-success btn-square btn-icon float-right" @click="postBlockchainDialog()"><i class="nc-icon nc-simple-add"></i> Add</button>              
            </template>

            <b-table id="tableOne" responsive ref="tableOne" bordered :items="tableOne.data" :fields="tableOne.fields">
              <template slot="actions" slot-scope="cell">                
                <button v-on:click="putBlockchainDialog(cell.item).then(refreshTableOne())" class="btn btn-primary btn-square btn-icon "><i class="nc-icon nc-settings-tool-66"></i> Modify</button>
                <button v-on:click="deleteBlockchain(cell.item).then(refreshTableOne())" class="btn btn-danger btn-square btn-icon "><i class="nc-icon nc-simple-remove"></i> Delete</button>
              </template>
            </b-table>
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
      key: 'name',
      label: 'Name'
    },
    {
      key: 'host',
      label: 'Host'
    },    
    {
      key: 'port',
      label: 'Port'
    },
    {
      key: 'networkId',
      label: 'Network Id'
    },
    {
      key: 'blockchain_platform',
      label: 'platform'
    },
    {
      key: 'actions',
      label: 'Actions'
    }
   
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
        owner: OWNER,
        postDialog: false,
        putDialog: false,
        blockchainId: null,
        blockchain: {
          name: null,
          owner: OWNER,
          host: null,
          port: null,
          networkId: null
        }
      }
    },
    created: function() {
      this.getBlockchain();
    },
    methods: {
      getBlockchain: function () {
        var http = axios.create({
          baseURL: process.env.VUE_APP_PROXY_ENDPOINT,          
        });
        http.get('/' + OWNER + '/blockchains')
        .then(response => {
          this.tableOne.data = response.data          
        }).catch(e => { 
          console.log("Error: " + e.message); 
        });
      },
      refreshTableOne: function() {
        this.$refs.tableOne.refresh();
        this.getBlockchain()
      },
      deleteBlockchain: function(item) {
        if(confirm('Are you sure?')) {
          return new Promise((resolve, reject) => {             
            var http = axios.create({
              baseURL: process.env.VUE_APP_PROXY_ENDPOINT,                                   
            });
            http.delete('/' + OWNER + '/blockchains/' + item.id)
            .then(response => {               
              resolve(response.data);
              this.getBlockchain()              
            })
            .catch(e => {              
              reject(e)
            })
          })
        }
      },
      postBlockchainDialog: function(item) {
        this.postDialog = true
        this.blockchain.name = null
        this.blockchain.host = null
        this.blockchain.port = null
        this.blockchain.networkId = null
        
      },
      putBlockchainDialog: function(item) {
        return new Promise((resolve, reject) => {             
          var http = axios.create({
            baseURL: process.env.VUE_APP_PROXY_ENDPOINT,                                   
          });
          http.get('/' + OWNER + '/blockchains/' + item.id)
          .then(response => { 
            resolve(response.data);
            this.blockchain = response.data    
            this.blockchainId = response.data.id   
            this.putDialog = true              
          })
          .catch(e => {
            console.log("Error: " + e.message);            
          })
        })
      },
      putBlockchain: function() {
        return new Promise((resolve, reject) => {             
          var http = axios.create({
            baseURL: process.env.VUE_APP_PROXY_ENDPOINT,                                   
          });
          http.put('/' + OWNER + '/blockchains/' + this.blockchainId, this.blockchain)
          .then(response => { 
            resolve(response.data);
            this.getBlockchain()
            this.putDialog = false;         
          })
          .catch(e => {
            console.log("Error: " + e.message);            
          })
        })
      },
      postBlockchain() {        
        this.showDialog = false;        
        axios.post(process.env.VUE_APP_PROXY_ENDPOINT + '/' + OWNER + '/blockchains', this.blockchain)
        .then(response => {           
          this.getBlockchain()
          this.postDialog = false;
        })        
        .catch(e => {
          console.log("Error: " + e.message);
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
</style>
