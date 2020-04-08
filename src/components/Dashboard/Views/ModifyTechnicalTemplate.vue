<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <div slot="header">
              <h4 class="card-title text-primary">Modify technical template <b>{{template.templatename}}</b></h4>
              <button v-on:click="goBack()" class="btn btn-primary btn-fill btn-round btn-icon float-right"><i class="nc-icon nc-stre-left"></i> Go Back</button>                     
            </div>          
          </card>
        </div>
      </div>
      <div class="row" v-if="steppers" v-on:keydown.9.capture.prevent.stop>       
        <div class="col-12">
          <card>
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
                          <label for="cid">Client id</label>
                          <md-input name="cid" id="cid" :placeholder="[[template.cid]]" v-model="template.cid" :disabled="true" />
                        </md-field>
                      </div>
                      <div class="col-md-6">
                        <div class="md-layout-item md-small-size-100">
                          <md-field >
                            <label for="templatename">Template name</label>
                            <md-input v-on:keydown="keyhandler" name="templatename" id="templatename" placeholder="Template Name" v-model="template.templatename" />                            
                          </md-field>
                          <span v-if="templatenameError" style="color:red">{{templatenameErrorMessage}}</span>
                        </div>
                      </div> 
                      <div class="col-md-6">
                        <div class="md-layout-item md-small-size-100">
                          <md-field >
                            <label for="version">Version</label>
                            <md-input v-on:keydown="keyhandler" name="version" id="version" placeholder="Version" v-model="template.version" />
                          </md-field>                          
                          <span v-if="versionError" style="color:red">{{versionErrorMessage}}</span>
                        </div>
                      </div>       
                    </div>                   
                    <span v-if="constraintError" style="color:red">{{constraintErrorMessage}}</span>
                  </form>
                </card>
                
                <card>
                  <div slot="header">
                    <h4 class="card-title text-primary"><i class="fa fa-user m-md-1"></i> Template tags</h4>
                    <p class="card-category">You can add the necessary filters to quickly find your template</p>
                  </div>
                  <div>                                                      
                    <md-chips v-on:keydown="keyhandler" class="md-primary shake-on-error" name="filter" id="filter" v-model="filters" :md-format="isValidFilter" md-placeholder="Insert your template's tag here"></md-chips>                                    
                  </div>                  
                </card>
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
                </card>
                <button class="btn btn-primary btn-square btn-icon " @click="checkSecond()"><i class="nc-icon nc-check-2"></i> Continue</button>                                
              </md-step>




              <!-- THIRD STEPPER -->
              <md-step id="third" md-label="Json schema" :md-error="thirdStepError" :md-done.sync="third">                
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
                  <div v-if="jsonSchemaNotCorrect==true">HINT: The json in input is not correct. Remember to insert all Mustache Variables, with their default values</div>  
                  <div v-if="jsonSchemaNotCorrect==true">MISSING: {{missingVariableInJsonSchema}}</div>  
                </card>
                
                <button class="btn btn-primary btn-square btn-icon " @click="checkThird()"><i class="nc-icon nc-check-2"></i> Continue</button>                                
              </md-step>



              <!-- SIXTH STEPPER -->
              <md-step id="sixth" md-label="Preview" :md-error="sixthStepError" :md-done.sync="sixth">  

                <card>
                  <div slot="header">
                    <h4 class="card-title text-primary"><i class="fa fa-user m-md-1"></i> Select how to display your html </h4><br>
                  </div>
                  <md-tabs class="md-transparent" md-alignment="fixed" @md-changed="setHTML">
                    <md-tab id="tab-complete" md-label="Complete">
                      <card>
                        <h4 class="card-title"><b>HTML complete form</b></h4><hr><br> <p v-html="completeFormHTML"></p>
                      </card>                      
                    </md-tab>
                    <md-tab id="tab-semplified" md-label="Semplified">
                       <card>
                        <h4 class="card-title"><b>HTML semplified form</b></h4><hr><br> <p v-html="semplifiedFormHTML"></p>
                      </card>                      
                    </md-tab>
                  </md-tabs>
                </card>

                <card>
                  <div slot="header">
                    <h4 class="card-title text-primary"><i class="fa fa-user m-md-1"></i> Preview</h4><br>
                    <hr>
                    <h5><b>Template name:</b> {{template.owner}}</h5>
                    <h5><b>Creator:</b> {{template.cid}}</h5>
                    <h5><b>Version:</b> {{template.version}}</h5>
                    <h5><b>Tags:</b>{{filters}}</h5>
                    
                    <h5><b>Solidity:</b></h5> <pre>{{template.solidity}}</pre>
                    <h5><b>Json schema:</b></h5><pre>{{template.jsonschema}}</pre></h5>                    
                  </div>
                </card>                
                <button class="btn btn-primary btn-square btn-icon " v-if="postButton===true" @click="putTemplate()"><i class="nc-icon nc-check-2"></i> Modify template</button>
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
          </card>
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
  import axios from 'axios'
  import editor from '@tinymce/tinymce-vue'

  export default {
    components: {
      Card, SolidityReader, JsonSchemaReader, editor
    },
    data() {
      return {
        
        title: this.$route.params.id,
        steppers: true,

        //steppers configuration
        active: 'first',
        first: false,
        firstStepError: null,
        metadata: {},
        filters: [],
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
        solidityMustacheVariable: [],


        third: false,
        thirdStepError: null,
        jsonSchemaNotCorrect: false,
        missingVariableInJsonSchema: [],
        solidityVariableTypeInHTMLFlag: false,
        solidityVariableTypeInHTML: [],


        fourth: false,
        fourthStepError: null,
        missingSolidityVariableFlag: false,
        missingSolidityVariableInHTML: [],


        fifth: false,
        fifthStepError: null,
        completeFormHTML: null,
        semplifiedFormHTML: null,        
        choosenTemplateForm: "tab-complete",


        sixth: false,
        sixthStepError: null,
        postButton: true,
        detailsButton: false,
              
        //template to post
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
          metadata: null       
        },

        // support variables
        responseMsg: {
          id: 0
        },                
      }
    },
    beforeMount: function() {
      this.getTemplateById();      
    },    
    methods: {
      //prevent tab button
      keyhandler(event) {
        if(event.keyCode == 9) {
          event.preventDefault()
        }       
        
      },

      getTemplateById: function() {        
        return new Promise((resolve, reject) => {
          var http = axios.create({
            baseURL: process.env.VUE_APP_GENERATOR_ENDPOINT,          
          });
          http.get('/' + OWNER + '/templates/' + this.$route.params.id)
          .then(response => {            
            this.template = response.data;
            this.metadata = response.data.metadata;                      
          }).catch(e => { 
            resolve([])
          });
        })
      },
    

      // check if the first step is correct, validation constraint
      checkFirst: function() {
       this.getTemplate().then((templateList) => {          
          /*for(let i=0; i<templateList.length; i++) {
            if((templateList[i].version == this.template.version) && (templateList[i].templatename == this.template.templatename) && (templateList[i].cid == this.template.cid) && ((templateList[i].owner == this.template.owner))) {
              this.setError('first', 'Error')
              this.constraintError = true
              this.constraintErrorMessage = "A template with this name and version already exists"
              return
            }
          }*/
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

      isValidFilter: function(filter) { // Example:   2019  -->  {"tag":"2019"}        
        if(filter.length == 0) return false
        try {
          JSON.parse('{"tag":"' + filter + '"}');
        } catch (e) {          
          return false;
        }                
        return filter
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


    

      // check solidity constraint
      checkSecond: function() {        
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


      getMustacheVariable: function(solidity) {
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
        this.solidityVariableTypeInHTML = []        
        if(this.solidityVariableTypeInHTMLFlag==false) { //set up the structure solidityVariableTypeInHTML  
          for(let i=0; i<mustacheVariable.length; i++) { 
            this.solidityVariableTypeInHTML.push([mustacheVariable[i], "text"]) 
          }           
        }
        return mustacheVariable;
      },


      //check third step, json correctness
      checkThird: function() {
        let jsonCorrectness = this.isValidJsonString(this.template.jsonschema)
        if(jsonCorrectness && this.template.jsonschema!='' && this.template.jsonschema!=null) {
          let mustacheVariable = this.solidityMustacheVariable
          if(this.solidityVariableTypeInHTMLFlag==false) {
            for(let i=0; i<mustacheVariable.length; i++) {              
              let jsonSchema = JSON.parse(this.template.jsonschema)
              let jsonProperties = jsonSchema.properties              
              let jsonPropertyOfVariable = jsonProperties[mustacheVariable[i]] || {type: "string", title: "Variable not defined in json schema", default: "missing_var", pattern: "^(.*)$" }              
              for(let j=0; j<this.solidityVariableTypeInHTML.length; j++) {
                if(mustacheVariable[i] == this.solidityVariableTypeInHTML[j][0]) {
                  switch(jsonPropertyOfVariable["type"]) {
                    case 'string':
                      this.solidityVariableTypeInHTML[j][1] = "text"
                      break;
                    case 'integer':
                      this.solidityVariableTypeInHTML[j][1] = "number"                      
                      break;
                    case 'double':
                      this.solidityVariableTypeInHTML[j][1] = "number"                      
                      break;
                    case 'number':
                      this.solidityVariableTypeInHTML[j][1] = "number"                      
                      break
                    case 'date':
                      this.solidityVariableTypeInHTML[j][1] = "date"                      
                      break;
                    case 'boolean':
                      this.solidityVariableTypeInHTML[j][1] = "boolean"                      
                      break;
                    default:                
                      this.solidityVariableTypeInHTML[j][1] = "text"                      
                  } 
                }               
              }              
            }
            this.solidityVariableTypeInHTMLFlag = true          
          }          
          this.setDone('third', 'sixth')
          this.thirdStepError = null          
          return
        } else {
          this.setError('third', 'Invalid json schema')
          this.jsonSchemaNotCorrect = true
          return
        }
      },


      isValidJsonString: function(jsonString) {
        this.missingVariableInJsonSchema = []
        try { JSON.parse(jsonString); } 
        catch (e) { return false; } 
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


      


      getIndicesOf: function(searchStr, str) {
        let searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
          return [];
        }
        let startIndex = 0, index, indices = [];
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
          indices.push(index);
          startIndex = index + searchStrLen;
        }
        return indices;
      },


      addVariableToHTML: function(selectedVariable) {        
        this.template.text = this.template.text.concat(" {{" + selectedVariable + "}} ")
      },


      generateCompleteForm: function(html) {               
        for(let i=0; i<this.solidityVariableTypeInHTML.length; i++) { // replace html variable with input type      
          let offset = 0
          let indices = this.getIndicesOf("{{"+this.solidityVariableTypeInHTML[i][0]+"}}", html)
          let string_mustache;
          if(this.solidityVariableTypeInHTML[i][1] == 'boolean') {
            string_mustache = "<select id='"+this.solidityVariableTypeInHTML[i][0]+"_option' onchange=\"document.getElementById('"+this.solidityVariableTypeInHTML[i][0]+"').value = document.getElementById('"+this.solidityVariableTypeInHTML[i][0]+"_option').value\"> <option disabled selected>"+this.solidityVariableTypeInHTML[i][0]+"</option><option value='true'>true</option><option value='false'>false</option></select><input id='"+this.solidityVariableTypeInHTML[i][0]+"' type='hidden' value='true'></input>"
          } else {
            string_mustache = "<input id='" + this.solidityVariableTypeInHTML[i][0] + "' type='" + this.solidityVariableTypeInHTML[i][1] +"' value='{{" + this.solidityVariableTypeInHTML[i][0] + "}}' oninput=\"updateLabel('" + this.solidityVariableTypeInHTML[i][0] + "')\"></input>"
          }
          if(indices.length == 1) { // se c'è solo un occorrenza      
            html = html.replace("{{"+this.solidityVariableTypeInHTML[i][0]+"}}", string_mustache)
            offset+=(string_mustache.length-this.solidityVariableTypeInHTML[i][0].length-4)
          } else if (indices.length > 1) { // se più di un occorrenza, il primo è un input text, le altre label
            html = html.replace("{{"+this.solidityVariableTypeInHTML[i][0]+"}}", string_mustache)
            offset+=(string_mustache.length-this.solidityVariableTypeInHTML[i][0].length-4)       
            for(let j=1; j<indices.length; j++) {
              let second_var =  "<output name='" + this.solidityVariableTypeInHTML[i][0] +"'></output> "
              html = this.replaceVariables(html, offset+indices[j], "{{"+this.solidityVariableTypeInHTML[i][0]+"}}", second_var)
              offset+=(second_var.length-this.solidityVariableTypeInHTML[i][0].length-4)                  
            }   
          }
        }
        let htmlComplete = this.transformHtmlVariablesComplete(html);
        return htmlComplete;
      },


      generateSemplifiedForm: function(html) {        
        let declarationVariable = '';
        // create semplified form
        for(let i=0; i<this.solidityVariableTypeInHTML.length; i++) {     
          if(this.solidityVariableTypeInHTML[i][1] == 'boolean') {
            declarationVariable += "<div>"+ this.solidityVariableTypeInHTML[i][0] + ": <select id='"+this.solidityVariableTypeInHTML[i][0]+"_option' onchange=\"document.getElementById('"+this.solidityVariableTypeInHTML[i][0]+"').value = document.getElementById('"+this.solidityVariableTypeInHTML[i][0]+"_option').value\"> <option disabled selected>"+this.solidityVariableTypeInHTML[i][0]+" value</option><option value='true'>true</option><option value='false'>false</option></select><input id='"+this.solidityVariableTypeInHTML[i][0]+"' type='hidden' value='true'  oninput=\"updateLabel('" + this.solidityVariableTypeInHTML[i][0] + "')\"></div>"
          } else {
            declarationVariable +=  "<div>"+ this.solidityVariableTypeInHTML[i][0] + ": <input id='" + this.solidityVariableTypeInHTML[i][0] + "' type='" + this.solidityVariableTypeInHTML[i][1] +"' value='{{" + this.solidityVariableTypeInHTML[i][0] + "}}' oninput=\"updateLabel('" + this.solidityVariableTypeInHTML[i][0] + "')\"></div> "
          }          
        }        
        // replace mustache variables
        for(let i=0; i<this.solidityVariableTypeInHTML.length; i++) { 
          let indices = this.getIndicesOf("{{"+this.solidityVariableTypeInHTML[i][0]+"}}", html)
          let offset = 0;  // offset variable used to manage the string length
          for(let j=0; j<indices.length; j++) {
            let variable = "<output name='" + this.solidityVariableTypeInHTML[i][0] +"'></output> "      
            html = this.replaceVariables(html, indices[j]+offset, "{{"+this.solidityVariableTypeInHTML[i][0]+"}}", variable)
            offset+=(variable.length-this.solidityVariableTypeInHTML[i][0].length-4)            
          }
        }        
        // replace html variables
        let htmlVariables = this.getHtmlVariables(html)  
        for(let i=0; i<htmlVariables.length; i++) {
          let htmlVariableIndexes = this.getIndicesOf("[["+htmlVariables[i]+"]]", html)
          let offset = 0;
          declarationVariable += "<div> HTML variable: "+ htmlVariables[i] + " <input id='" + htmlVariables[i] + "' type='text'  placeholder='" + htmlVariables[i] + "' oninput=\"updateLabel('" + htmlVariables[i] + "')\">"    
          for(let j=0; j<htmlVariableIndexes.length; j++) {
            let variable = "<output name='" + htmlVariables[i] +"'></output> "      
            html = this.replaceVariables(html, htmlVariableIndexes[i]+offset, "[["+htmlVariables[i]+"]]", variable)
            offset+=(variable.length-htmlVariables[i].length-4)            
          }
        }
        let returnHtml = declarationVariable + "<br>" + html
        return returnHtml;
      },


      getHtmlVariables: function(html) {
        let htmlVariablesList = []        
        let startDelimiterIndexes = this.getIndicesOf("[[", html)
        let endDelimiterIndexes = this.getIndicesOf("]]", html)        
        if(startDelimiterIndexes.length == endDelimiterIndexes.length) {
          for(let i=0; i<startDelimiterIndexes.length; i++) {
            let variable = html.substring(startDelimiterIndexes[i]+2, endDelimiterIndexes[i]) 
            htmlVariablesList.push(variable)
          } 
        }
        return htmlVariablesList
      },


      replaceVariables: function(string, index, fromString, toString) {
        let hasWrongParams = typeof index !== 'number'
                    || !fromString || typeof fromString !== 'string'
                    || !toString || typeof toString !== 'string';
        if(hasWrongParams) return '';
        let fromIndex = index;
        let toIndex = index + fromString.length;
        return string.substr(0, fromIndex) + toString + string.substr(toIndex);
      },


      transformHtmlVariablesComplete: function(html) {
        let startDelimiterIndexes = this.getIndicesOf("[[", html)
        let endDelimiterIndexes = this.getIndicesOf("]]", html)
        let offset = 0;
        if(startDelimiterIndexes.length == endDelimiterIndexes.length) {
          for(let i=0; i<startDelimiterIndexes.length; i++) {
            let variable = html.substring(startDelimiterIndexes[i]+2+offset, endDelimiterIndexes[i]+offset) // var1 
            let inputVariable = "<input id='" + variable + "' type='text'  placeholder='" + variable + "'>"
            html = this.replaceVariables(html, startDelimiterIndexes[i]+offset, "[["+variable+"]]", inputVariable)
            offset+=(inputVariable.length-variable.length-4)      
          }
        }
        return html; 
      },


      // setta la tipologia di form del template
      checkFifth: function(formType) {
        this.choosenTemplateForm = formType
        if(formType=='complete') {
          this.template.html = this.completeFormHTML
        } else if(formType=='semplified') {
          this.template.html = this.semplifiedFormHTML
        } else {
          this.setError('fifth', 'Error in html generation')
          return
        }
        this.setDone('fifth', 'sixth')
      },

      //FIXME:
      setHTML: function(activeTab) {        
        this.choosenTemplateForm = activeTab
        if(activeTab=='tab-complete') {
          this.template.html = this.completeFormHTML
        } else if(activeTab=='tab-semplified') {
          this.template.html = this.semplifiedFormHTML
        } 
        return                        
      },


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
          case 'fourth':
            this.fourthStepError = message
            break
          case 'fifth':
            this.fifthStepError = message
            break
          case 'sixth':
            this.sixthStepError = message
            break
          default:
            //console.log('debug: Unknown error')
            break
        }         
      },


      templateListPage: function() {
        this.$router.push("/templateList");
      },


      putTemplate() {        
        axios.put(process.env.VUE_APP_GENERATOR_ENDPOINT + '/' + OWNER + '/templates/' + this.$route.params.id, this.template)
        .then(response => { 
          this.responseMsg = response.data
          if(response.data.id!=null) {
            this.setSuccess()
          }
        })        
        .catch(e => { 
          this.responseMsg = e 
          this.errorDescriptionLabel = true
          this.errorDescriptionMessage = e.response.data.error_description          
          console.log(e)          
        })
      },


      setSuccess: function() {
        this.postButton = false
        this.detailsButton = true
      },


      templateDetails: function() {
        this.$router.push("/html");
      },
      // navigation
      goBack: function() {
        this.$router.go(-1)
      },    
    }
  }
</script>

<style>
  .ck-editor__editable {
    min-height: 300px;
  }
</style>