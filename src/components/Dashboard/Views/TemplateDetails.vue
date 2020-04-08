<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h4 class="card-title text-primary">Details of <b>{{templateInfo.templatename}}</b></h4><br><br>
              <button v-on:click="goBack()" class="btn btn-primary btn-fill btn-round btn-icon float-right"><i class="nc-icon nc-stre-left"></i> Go Back</button>                     
              <button v-on:click="publishTemplate()" v-if="templateInfo.published==false" class="btn btn-primary btn-square btn-icon "><i class="nc-icon nc-check-2"></i> Publish</button>                            
              <button v-on:click="modifyTemplate()" v-if="templateInfo.published==false" class="btn btn-primary btn-square btn-icon "><i class="nc-icon nc-settings-tool-66"></i> Modify</button>              
              <button v-on:click="compileTemplate()" class="btn btn-primary btn-square btn-icon "><i class="nc-icon nc-cloud-upload-94"></i> Compile</button>
              <button v-on:click="downloadObjectAsJson(templateInfo, templateInfo.templatename)" class="btn btn-primary btn-square btn-icon "><i class="nc-icon nc-cloud-download-93"></i> Export</button>
              <button v-on:click="deleteTemplate().then(goBack())" class="btn btn-danger btn-square btn-icon "><i class="nc-icon nc-simple-remove"></i> Delete</button>              
              
            </template>
            <template slot="footer">
              <h5 class="text-primary" v-if="templateInfo.published==true"><br> Template published </h5>
            </template>
          </card>

          <!-- Dettagli del template -->
          <card>
            <div class="row">
              <div class="col-12">       
                <b-table id="tableOne" :no-provider-sorting=true ref="tableOne" responsive bordered hover :items="tableOne.data" :fields="tableOne.fields"></b-table>                
              </div>  
            </div>
          </card>
                    
          <!-- Tabs coi campi da mostrare -->
          <card>
            <div class="row">
              <div class="col-md-12">
                <md-tabs class="md-transparent" md-alignment="fixed">
                  <md-tab v-if='templateInfo.text != ""' id="html" md-label="HTML preview">
                    <card>                      
                      <p v-html="templateInfo.text"></p>
                    </card>                  
                  </md-tab>
                  <md-tab id="solidity" md-label="Solidity">
                    <card>                      
                      <pre>
                        <br>{{templateInfo.solidity}}
                      </pre>                        
                    </card>                  
                  </md-tab>
                  <md-tab id="jsonschema" md-label="Json Schema">
                    <card>                      
                      <pre>
                        <br>{{templateInfo.jsonschema}}
                      </pre>    
                    </card>                              
                  </md-tab>
                  <md-tab v-if="tags.length > 0" id="metadata" md-label="Tags">
                    <card>                                                                  
                      <br>{{tags}}                                            
                    </card>                              
                  </md-tab>                  
                </md-tabs>
              </div>               
            </div>                       
          </card>

          <!--<card>
            {{templateInfo.html}}
          </card>-->
          
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
      key: 'templatename',      
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
      key: 'published',
      label: 'Published'
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
        templateInfo: {},

        tableOne: {
          fields: [...tableOneColumns],
          data: []
        },
        tags: []
      }
    },
    
    mounted: function() {      
      this.getTemplateById(this.$route.params.id);
    },
    methods: {
      
      goBack: function() {
        this.$router.go(-1)
      },    

      getTemplateById: function(id) {
        return new Promise((resolve, reject) => {   
          var http = axios.create({
            baseURL: process.env.VUE_APP_GENERATOR_ENDPOINT,            
          });
          http.get('/' + OWNER + '/templates/' + this.$route.params.id)
          .then(response => { 
            resolve(response.data); 
            //console.log(response.data.metadata)
            this.tableOne.data.push(response.data)
            this.templateInfo = response.data
            this.tags = Object.keys(this.templateInfo.metadata)
          })
          .catch(e => {
            console.log("Error: " + e.message);
            reject(e)
          });
        })
      },

      publishTemplate: function() {
        this.templateInfo.published = true
        return new Promise((resolve, reject) => {             
          axios.put(process.env.VUE_APP_GENERATOR_ENDPOINT + '/' + OWNER + '/templates/' + this.$route.params.id , this.templateInfo)
          .then(response => { 
            resolve(response.data);             
          })
          .catch(e => {
            console.log("Error: " + e.message);
            reject(e)
          })
        })
      },

      deleteTemplate: function() {
        if(confirm('Are you sure?')) {
          return new Promise((resolve, reject) => {             
            var http = axios.create({
              baseURL: process.env.VUE_APP_GENERATOR_ENDPOINT,                                   
            });
            http.delete('/' + OWNER + '/templates/' + this.$route.params.id)
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

      compileTemplate: function() {
        //this.$router.push("/template/compile/" + this.$route.params.id);
        let routeData = this.$router.resolve("/template/compile/" + this.$route.params.id);
        window.open(routeData.href, '_blank');
      },

      downloadObjectAsJson: function(exportObj, exportName){
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      },

      modifyTemplate: function() {
        this.$router.push("/template/modifyTemplateHTML/" + this.$route.params.id);
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
</style>
