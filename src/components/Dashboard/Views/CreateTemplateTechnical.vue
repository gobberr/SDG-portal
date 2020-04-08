<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <div slot="header">
              <h4 class="card-title text-primary">Technical Template creation</h4>
              <button v-on:click="goBack()" class="btn btn-primary btn-fill btn-round btn-icon float-right"><i class="nc-icon nc-stre-left"></i> Go Back</button>                     
            </div>          
          </card>
        </div>
      </div>
      <div class="row" v-if="steppers" v-on:keydown.9.capture.prevent.stop>       
        <div class="col-12">
          <md-card>
            <md-steppers :md-active-step.sync="active" md-linear>              

              <!-- FIRST STEPPER --> 
              <md-step id="first" md-label="General Information" :md-error="firstStepError" :md-done.sync="first">
                <card>
                  <div slot="header">
                    <h4 class="card-title text-primary"><i class="fa fa-user m-md-1"></i> Basic Information</h4>
                    <p class="card-category">Basic information of the template</p>
                  </div>
                  <form>
                    <div class="row">
                      <div class="col-md-6">
                        <md-field>
                          <label for="owner">Owner</label>
                          <md-input name="owner" id="owner" :placeholder="[[template.owner]]" v-model="template.owner" :disabled="true" />
                        </md-field>
                      </div>
                      
                      <div class="col-md-6">
                        <md-field>
                          <label for="cid">Creator</label>
                          <md-input name="cid" id="cid" :placeholder="[[template.cid]]" v-model="template.cid" :disabled="true" />
                        </md-field>
                      </div>
                      
                      <div class="col-md-6">
                        <div class="md-layout-item md-small-size-100">
                          <md-field >
                            <label for="templatename">Template name</label>
                            <md-input name="templatename" id="templatename" placeholder="Template Name" v-model="template.templatename" />                            
                          </md-field>
                          <span v-if="templatenameError" style="color:red">{{templatenameErrorMessage}}</span>
                        </div>
                      </div> 
                      <div class="col-md-6">
                        <div class="md-layout-item md-small-size-100">
                          <md-field >
                            <label for="version">Version</label>
                            <md-input name="version" id="version" placeholder="Version" v-model="template.version" />
                          </md-field>
                          <span v-if="versionError" style="color:red">{{versionErrorMessage}}</span>
                        </div>
                      </div>       
                    </div>                   
                    <span v-if="constraintError" style="color:red">{{constraintErrorMessage}}</span>
                  </form>
                </card>
                <!--
                <card>
                  <div slot="header">
                    <h4 class="card-title text-primary"><i class="fa fa-user m-md-1"></i> Template tags</h4>
                    <p class="card-category">You can add the necessary filters to quickly find your template</p>
                  </div>
                  <div>                                                      
                    <md-chips class="md-primary shake-on-error" name="filter" id="filter" v-model="filters" :md-format="isValidFilter" md-placeholder="Insert your template's tag here"></md-chips>                                    
                  </div>                  
                </card>
                -->
                <button class="btn btn-primary btn-square btn-icon " @click="checkFirst()"><i class="nc-icon nc-check-2"></i> Continue</button>                                               
              </md-step>




              <!-- SECOND STEPPER -->
              <md-step id="second" md-label="Solidity code" :md-error="secondStepError" :md-done.sync="second">                
                <card>
                  <div slot="header">
                    <h4 class="card-title text-primary"><i class="fa fa-user m-md-1"></i> Upload or write your solidity code</h4><br>
                  </div>
                  <h4>Upload your solidity here</h4>                 
                  <SolidityReader @load="template.solidity = $event"></SolidityReader>
                  <br>
                  <h4>Or write it here</h4>                  
                  <b-form-textarea                      
                    v-model="template.solidity"
                    placeholder="Solidity code"
                    rows="10"
                    no-resize="true"
                    max-rows="10"
                  ></b-form-textarea>
                  <br>
                  <div v-if="solidityVariableError==true">HINT: There must be solidity variables in the template. Example: {{solidityVariableExample}}</div>  
                  <div v-if="solidityContractNameVariableError==true">HINT: There must be a solidity variable called "contractName"</div>                
                  <br>
                  <button class="btn btn-primary btn-square btn-icon " @click="checkSecond()"><i class="nc-icon nc-check-2"></i> Continue</button>
                </card>
                                                
              </md-step>




              <!-- THIRD STEPPER -->
              <md-step id="third" md-label="Constraint" :md-error="thirdStepError" :md-done.sync="third">                
                <card>
                  <div slot="header">
                    <h4 class="card-title text-primary"><i class="fa fa-user m-md-1"></i> Upload or write your json schema and define the type of the solidity variables</h4><br>
                  </div>
                  <h4>Upload your json schema here</h4>
                  <JsonSchemaReader @load="template.jsonschema = $event"></JsonSchemaReader>
                  <br>
                  <h4>Or write it here</h4>                  
                  <b-form-textarea                      
                    v-model="template.jsonschema"
                    placeholder="Json schema"
                    rows="15"
                    no-resize="true"
                    max-rows="15"
                  ></b-form-textarea>
                  <br>
                  <br>
                  <div v-if="jsonSchemaNotCorrect==true">HINT: The json in input is not correct. Remember to insert all Mustache Variables, with their default values</div>  
                  <div v-if="jsonSchemaNotCorrect==true && missingVariableInJsonSchema.length>0">MISSING: {{missingVariableInJsonSchema}}</div>  
                </card>                
                <button class="btn btn-primary btn-square btn-icon " @click="checkThird()"><i class="nc-icon nc-check-2"></i> Continue</button>                                
              </md-step>

              <!-- SIXTH STEPPER -->
              <md-step id="sixth" md-label="Preview" :md-error="sixthStepError" :md-done.sync="sixth">                
                <card>
                  <div slot="header">
                    <h4 class="card-title text-primary"><i class="fa fa-user m-md-1"></i> Preview</h4><br>
                    <hr>
                    <h5><b>Template name:</b> {{template.templatename}}</h5>
                    <h5><b>Owner:</b> {{template.owner}}</h5>
                    <h5><b>Creator:</b> {{template.cid}}</h5>
                    <h5><b>Version:</b> {{template.version}}</h5>
                    <h5><b>Tags:</b> {{template.metadata}}</h5> <br>                   
                    <h5><b>Solidity: </b><br><br><pre>{{template.solidity}}</pre></h5>
                    <h5><b>Json schema:</b><br><br> <pre>{{template.jsonschema}}</pre></h5>                    
                  </div>
                </card>                
                <button class="btn btn-primary btn-square btn-icon " v-if="postButton===true" @click="postTemplate()"><i class="nc-icon nc-check-2"></i> Post new template</button>
                <button class="btn btn-primary btn-square btn-icon " v-if="detailsButton===true" @click="templateDetails()"><i class="nc-icon nc-zoom-split"></i> See template details</button>                
                <div v-if="responseMsg.id!=null && responseMsg.id!=0">
                  <h4>Server Response: <i class="nc-icon nc-app"> Success </i></h4>
                  <hr>                
                </div>
                <div v-else-if="responseMsg.id!=0">
                  <h4>Server Response: <i class="nc-icon nc-app"> {{responseMsg}} </i></h4>                          
                </div>
                <div v-if="errorDescriptionLabel">
                  <h4>{{errorDescriptionMessage}} </h4>
                </div>
              </md-step>        
        
            </md-steppers>
          </md-card>
        </div>
      </div>            
    </div>
  </div>
</template>

<script>

  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import SolidityReader from 'src/components/UIComponents/Inputs/SolidityReader'  
  import JsonSchemaReader from 'src/components/UIComponents/Inputs/JsonSchemaReader'
  import {OWNER} from "../../../app.config"
  import {CID} from "../../../app.config"  
  import axios from 'axios'
  import editor from '@tinymce/tinymce-vue'


  export default {
    components: {
      Card, SolidityReader, JsonSchemaReader, editor
    },
    data() {
      return {

        steppers: true,

        //steppers configuration
        active: 'first',
        first: false,
        firstStepError: null,
        filters: [], 
        metadata: {},        
        templatenameError: false,  
        templatenameErrorMessage: "",  
        versionError: false,  
        versionErrorMessage: "",  
        constraintError: false,  
        constraintErrorMessage: "", 

        second: false,
        secondStepError: null,
        solidityVariableError: false,
        solidityVariableExample: '{{my_variable}}',
        solidityContractNameVariableError: false,
        solidityMustacheVariable: [],   // elenco variabili mustache presenti nel solidity   -->   ["contractName", "owner"]


        thirdStepError: false,

        sixth: false,
        sixthStepError: null,
        postButton: true,
        detailsButton: false,
        responseMsg: {
          id: 0
        },       
        
        // Data to post in the request
        template: {
          owner: OWNER,
          version: null,
          templatename: null,
          cid: this.$store.state.auth.owner,
          jsonschema: null,
          solidity: null,
          html: "",
          text: "",
          published: false, 
          metadata: {}       
        },        
                
      }
    },
  
    methods: {
      
      // check if the first step is correct, validation constraint
      checkFirst() {
        this.getTemplate().then((templateList) => {          
          for(let i=0; i<templateList.length; i++) {
            if((templateList[i].version == this.template.version) && (templateList[i].templatename == this.template.templatename) && (templateList[i].cid == this.template.cid) && ((templateList[i].owner == this.template.owner))) {
              this.setError('first', 'Error')
              this.constraintError = true
              this.constraintErrorMessage = "A template with this name and version already exists"
              return
            }
          }
          this.constraintError = false
          if(this.template.templatename === '' || this.template.templatename === null) { 
            this.templatenameError = true
            this.templatenameErrorMessage = "Error: template name is required"
            this.setError('first', 'Error'); 
            return 
          }
          if(this.template.templatename.trim().indexOf(' ') != -1) {
            this.templatenameError = true
            this.templatenameErrorMessage = "Error: the name must have be composed of only one word"
            return
          }
          this.templatenameError = false
          if(this.template.version === '' || this.template.version === null) { 
            this.versionError = true
            this.versionErrorMessage = "Error: version is required"
            this.setError('first', 'Error'); 
            return 
          }       
          this.versionError = false   
          this.addFiltersToMetadata();          
          this.firstStepError = null
          this.setDone('first', 'second')          
        })
      },   
      addFiltersToMetadata: function() {

        for(let i=0; i<this.filters.length; i++) {
          let key = this.filters[i]          
          this.template.metadata[key] = "tags"
        }        
      },
      getTemplate: function () {
        return new Promise((resolve, reject) => {
          var http = axios.create({
            baseURL: process.env.VUE_APP_GENERATOR_ENDPOINT,          
          });
          http.get('/' + OWNER + '/templates/')
          .then(response => {
            resolve(response.data)          
          }).catch(e => { 
            resolve([])
          });
        })
      },
      isValidFilter: function(filter) { // Example:   "2019" will be {"tag":"2019"}        
        if(filter.length == 0) return false
        try {
          JSON.parse('{"tag":"' + filter + '"}');
        } catch (e) {          
          return false;
        }                
        return filter
      },      


      // check solidity constraint
      checkSecond() {
        this.solidityVariableTypeInHTMLFlag = false
        this.solidityMustacheVariable = this.getMustacheVariable(this.template.solidity) 
        if(this.solidityMustacheVariable.length > 0 ) { //if there is not constraint error
          let contractNameVariable = false
          for(let i=0; i<this.solidityMustacheVariable.length; i++) {
            if(this.solidityMustacheVariable[i]=='contractName') { contractNameVariable = true }
          }
          if(contractNameVariable == true) {
            this.setDone('second', 'third')
            this.secondStepError = null
            return
          } else {
            this.setError('second', 'Mustache variable error')
            this.solidityContractNameVariableError = true  
            return
          }          
        } else {
          this.setError('second', 'Mustache variable error')
          this.solidityVariableError = true
          return
        }
      },
      getMustacheVariable: function(solidity) { // chiamato solo nel checkSecond
        let mustacheVariable = new Array()
        for(let i=0; i<solidity.length; i++) { // per ogni carattere della stringa        
          if((solidity[i] == '{') && (solidity[i+1] == '{') && (solidity[i+2] != '{')) { // se trova due '{'  è l'inizio di una variabile mustache
            let start_delimiter = i+2
            let end_delimiter = start_delimiter+1;
            while(end_delimiter <= solidity.length) { //scorri finché non trova due '}' oppure finisce la stringa
              if((solidity[end_delimiter+1] == '}') && (solidity[end_delimiter+2] == '}')) {
                let variable = solidity.substring(start_delimiter, end_delimiter+1);
                mustacheVariable.push(variable)
                break;
              }
              end_delimiter++;                                
            }
          }
        }
        //fill the structure solidityVariableTypeInHTML 
        this.solidityVariableTypeInHTML = [] 
        if(this.solidityVariableTypeInHTMLFlag==false) {
          for(let i=0; i<mustacheVariable.length; i++) {
            this.solidityVariableTypeInHTML.push([mustacheVariable[i], "text"])
          }
          this.solidityVariableTypeInHTMLFlag = true
        } 
        return mustacheVariable;
      },


      //check third step, json correctness
      checkThird: function() {        
        let jsonCorrectness = this.isValidJsonString(this.template.jsonschema)   
        console.log(jsonCorrectness)     
        if(jsonCorrectness && this.template.jsonschema!='' && this.template.jsonschema!=null) {
          this.setDone('third', 'sixth')
          this.thirdStepError = null                    
        } else {          
          this.jsonSchemaNotCorrect = true
          this.setError('third', 'Invalid json schema')                    
        }
      },
      isValidJsonString: function(jsonString) {
        this.missingVariableInJsonSchema = []
        try { JSON.parse(jsonString); } 
        catch (e) { 
          console.log(e)          
          return false; 
        } 
        let result = true;
        for(let i=0; i<this.solidityMustacheVariable.length; i++) {
          let schema = JSON.parse(jsonString);
          try { (schema.properties[this.solidityMustacheVariable[i]])               
            if(schema.properties[this.solidityMustacheVariable[i]] === undefined) {
              this.missingVariableInJsonSchema.push(this.solidityMustacheVariable[i])
              result = false                
            }
          } catch (e) {
            this.missingVariableInJsonSchema.push(this.solidityMustacheVariable[i])
            result = false              
          }          
        }
        return result;
      },
      
      // stepper management
      setDone(id, index) {
        this[id] = true
        if (index) { this.active = index }
      },
      setError(step, message) {
        switch(step) {
          case 'first': 
            this.firstStepError = message
            break
          case 'second':
            this.secondStepError = message
            break
          case 'third':
            this.thirdStepError = message
            break
          case 'sixth':
            this.sixthStepError = message
            break
          default:
            console.log('debug: Unknown error')
            break
        }         
      },

      //navigation
      goBack: function() {
        this.$router.go(-1)        
      },            
      setSuccess: function() {
        this.postButton = false
        this.detailsButton = true
      },
      templateDetails: function() {
        this.$router.push("/html");
      },
      postTemplate() {
        
        axios.post(process.env.VUE_APP_GENERATOR_ENDPOINT + '/' + OWNER + '/templates', this.template)
        .then(response => { 
          this.responseMsg = response.data
          if(response.data.id!=null) {
            this.setSuccess()
          }
        })        
        .catch(e => {           
          this.responseMsg = e.message; 
          this.errorDescriptionLabel = true
          this.errorDescriptionMessage = e.response.data.error_description          
          console.log("Error: " + e.message); 
        })
      }
    }
  }
</script>

<style>
  
</style>