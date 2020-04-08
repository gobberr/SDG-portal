<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <div slot="header">
              <h4 class="card-title text-primary">HTML Template creation</h4>
              <button @click="goBack()" class="btn btn-primary btn-fill btn-round btn-icon float-right"><i class="nc-icon nc-stre-left"></i> Go Back</button>                     
            </div>          
          </card>
        </div>
      </div>
      <div class="row" v-if="steppers" v-on:keydown.9.capture.prevent.stop>       
        <div class="col-12">
          <md-card v-if="templateList.length > 0">
            <md-steppers :md-active-step.sync="active" md-linear>              


              <!-- FIRST STEPPER -->
              <md-step id="first" md-label="Skeleton" :md-error="firstStepError" :md-done.sync="first">                
                <card>
                  <div slot="header">
                    <h4 class="card-title text-primary"><i class="fa fa-user m-md-1"></i> Choose a technical template to start the template creation</h4><br>
                  </div>
                  <div>
                    <div class="row" v-for="(template, index) in templateList" v-bind:key="index">
                      <div class="col-md-3 d-flex align-items-left" >                         
                        <md-radio v-model="selectedTemplate" :value="template">{{ template.templatename }}</md-radio>  
                      </div>                

                      <!-- Overview button -->          
                      <div class="col-md-6 d-flex align-items-center" >  
                        <b-button v-b-modal="template.id">Overview</b-button>&nbsp;&nbsp;
                        <b-button @click="modifyTechnicalTemplateFlow(template.id)" >Modify</b-button> 
                        <b-modal :id="template.id" size="lg" title="Template overview" scrollable>
                          <md-tabs class="md-transparent">
                            <md-tab id="solidity" md-label="Solidity">
                              <card>
                                <pre>
                                  <br>{{template.solidity}}
                                </pre>                        
                              </card>                             
                            </md-tab>
                            <md-tab id="jsonschema" md-label="Json Schema">
                              <card>                                
                                <pre>
                                  <br>{{template.jsonschema}}
                                </pre>    
                              </card>                              
                            </md-tab>
                            <md-tab id="html" md-label="HTML preview" v-if="template.html.length>0">
                              <card>                                
                                <p v-html="template.html"></p>
                              </card>                              
                            </md-tab>
                          </md-tabs>
                        </b-modal>                      
                      </div>
                      <div> 
                                         
                      </div>
                    </div>   
                    <div class="row">
                      <div class="col-md-3 d-flex align-items-center"></div>
                      <div class="col-md-9">  
                        <button class="btn btn-secondary btn-square btn-icon"  @click="technicalTemplateFlow()"><i class="nc-icon nc-simple-add"></i> Add new</button><br><br>
                        <button class="btn btn-primary btn-square btn-icon" style="margin-right: 0.5em;" @click="enableImportTemplate()"><i class="fa fa-cloud-upload"></i> Import template</button>  
                        <!--<button class="btn btn-primary btn-square btn-icon float-right" style="margin-right: 0.5em;" v-if="showAddTemplateButtons" @click="enableImportTemplate()"><i class="fa fa-cloud-upload"></i> Import template</button>  
                        <button class="btn btn-primary btn-square btn-icon float-right" style="margin-right: 0.5em;" v-if="showAddTemplateButtons" @click="technicalTemplateFlow()"><i class="nc-icon nc-settings-90"></i> Create technical template</button>                                                                 
                        <button class="btn btn-primary btn-square btn-icon float-right" style="margin-right: 0.5em;" v-if="showAddTemplateButtons" @click="fullTemplateFlow()"><i class="nc-icon nc-puzzle-10"></i> Create full template</button>    -->
                      </div>                    
                    </div> 
                  </div>
                  <br>
                   
                  <div class="row">    
                    <div class="col-md-3 d-flex align-items-center" >
                      <button class="btn btn-primary btn-square btn-icon " @click="checkFirst()"><i class="nc-icon nc-check-2"></i> Continue</button>
                    </div>
                  </div>                  
                </card>         
                <card v-if="importTemplateEnabled">
                  <div slot="header">
                    <h4 class="card-title text-primary"><i class="fa fa-user m-md-1"></i> Import a template </h4><br>
                  </div>
                  <PostTemplateJSON></PostTemplateJSON> 
                </card>              
              </md-step>



              <!-- SECOND STEPPER --> 
              <md-step id="second" md-label="General Information" :md-error="secondStepError" :md-done.sync="second">
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
                          <md-input name="owner" id="owner" v-model="template.owner" :disabled="true" />
                        </md-field>
                      </div>
                      
                      <div class="col-md-6">
                        <md-field>
                          <label for="cid">Creator</label>
                          <md-input name="cid" id="cid" v-model="template.cid" :disabled="true" />
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
                <card>
                  <div slot="header">
                    <h4 class="card-title text-primary"><i class="fa fa-user m-md-1"></i> Template tags</h4>
                    <p class="card-category">You can add the necessary filters to quickly find your template</p>
                  </div>
                  <div>                                                      
                    <md-chips class="md-primary shake-on-error" name="filter" id="filter" v-model="filters" :md-format="isValidFilter" md-placeholder="Insert your template's tag here"></md-chips>                                    
                  </div>                  
                </card>
                <button class="btn btn-primary btn-square btn-icon " @click="checkSecond()"><i class="nc-icon nc-check-2"></i> Continue</button>                                               
              </md-step>



              <!-- THIRD STEPPER -->
              <md-step id="third" md-label="HTML" :md-error="thirdStepError" :md-done.sync="third">                
                <card>
                  <div slot="header">
                    <h4 class="card-title text-primary"><i class="fa fa-user m-md-1"></i> Write your html here</h4><br>
                  </div>             
       
                  <editor  
                    v-model="template.text"  
                    api-key="suwhjciiwnfmsxj43ncpn2340crvx9cuuv4ttvz6zw6gsweb"  
                    :init="{  
                      height: 600,  
                      imagetools_cors_hosts: ['picsum.photos'],  
                      menubar: 'file edit view insert format tools table help',  
                      plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',  
                      toolbar: 'undo redo | mustacheVariable htmlVariable | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | preview save print | insertfile image media link anchor codesample | ltr rtl',  
                      toolbar_sticky: true,  
                      autosave_ask_before_unload: true,  
                      autosave_interval: '30s',  
                      autosave_prefix: '{path}{query}-{id}-',  
                      autosave_restore_when_empty: false,  
                      autosave_retention: '2m',  
                       
                      content_css: [  
                        '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',  
                        '//www.tiny.cloud/css/codepen.min.css'  
                      ],  
                      link_list: [  
                        { title: 'My page 1', value: 'http://www.tinymce.com' },  
                        { title: 'My page 2', value: 'http://www.moxiecode.com' }  
                      ],  
                      template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',  
                      template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',  
                      image_caption: true,  
                      quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',  
                      noneditable_noneditable_class: 'mceNonEditable',  
                      toolbar_drawer: 'sliding',  
                      contextmenu: 'link image imagetools table spellchecker',  
  
  
                      setup: function (editor) {                

                        editor.ui.registry.addButton('htmlVariable', {
                          text: 'set Html variable',
                          tooltip: 'Select only html variable',
                          onAction: function (_) {
                            editor.focus();
                            if(editor.selection.getContent() && editor.selection.getContent().indexOf('{{') == -1 && editor.selection.getContent().indexOf('}}') == -1){
                              editor.selection.setContent('[[' + editor.selection.getContent() + ']]').formatter.apply({value : 'red'});;
                            }                        
                          }
                        });

                        editor.ui.registry.addMenuButton('mustacheVariable', {  
                          text: 'Insert variables', 
                          tooltip: 'Insert a solidity variable', 
                          fetch: function(callback) {  
                                  var items = [];  
                                    
                                  solidityMustacheVariable.forEach(menuitem)  
  
                                  function menuitem(value, index, array) {  
                                    var menuItem = {  
                                      type: 'menuitem',  
                                      text: value,  
                                      value: '{{'+value+'}}',  
                                      onSetup: function(buttonApi) {  
                                        var $this = this;  
                                        this.onAction = function() {  
                                          editor.insertContent($this.data.value);  
                                        };  
                                      },  
                                    };  
                                    items.push(menuItem);  
                                  }  
                                  callback(items);  
                        }  
                        });  
                      }  
                      }"  
                        
                  />  
                </card>
                <card v-if="missingSolidityVariableFlag==true">
                  <div v-if="fourthStepError==true">HINT: Missing HTML </div>
                  <div v-if="missingSolidityVariableFlag==true && missingSolidityVariableInHTML.length>0">HINT: The following solidity variables are not present in the html: {{missingSolidityVariableInHTML}}. You can define a variables in this way: {{solidityVariableExample}} </div>   
                </card>  
                <button class="btn btn-primary btn-square btn-icon " @click="checkThird()"><i class="nc-icon nc-check-2"></i> Continue</button>                                
              </md-step>



              <!-- FOURTH STEPPER -->
              <md-step id="fourth" md-label="Variables" :md-error="fourthStepError" :md-done.sync="fourth">   
                <card> 
                  <div slot="header">
                    <h4 class="card-title text-primary"><i class="fa fa-user m-md-1"></i> For each variable, select the HTML input type</h4><br>
                  </div>                 
                  <div class="row" v-for="(variable, index) in solidityMustacheVariable" v-bind:key="index">
                    <div class="col-md-2 d-flex align-items-center" > 
                      <b><span> {{ variable }} </span></b>                           
                    </div>
                    <div class="col-md-10">
                      <span>
                        <md-radio v-model="solidityVariableTypeInHTML[index][1]" value="text">String</md-radio>&nbsp;&nbsp;
                        <md-radio v-model="solidityVariableTypeInHTML[index][1]" value="boolean">Boolean</md-radio>&nbsp;&nbsp;                          
                        <md-radio v-model="solidityVariableTypeInHTML[index][1]" value="number">Number</md-radio>&nbsp;&nbsp;
                        <md-radio v-model="solidityVariableTypeInHTML[index][1]" value="date">Date</md-radio>&nbsp;&nbsp;
                        <md-radio v-model="solidityVariableTypeInHTML[index][1]" value="default_value">Fixed Value&nbsp;                          
                          <input type="text" placeholder="Insert here your fixed value" name="default_value" v-model="solidityVariableTypeInHTML[index][2]"/>
                        </md-radio>
                      </span>                        
                    </div> 
                    <hr>                      
                  </div>                                                      
                </card>        
                <button class="btn btn-primary btn-square btn-icon " @click="checkFourth()"><i class="nc-icon nc-check-2"></i> Continue</button>                                
             
              </md-step>



              <!-- FIFTH STEPPER -->
              <md-step id="fifth" md-label="Preview" :md-error="fifthStepError" :md-done.sync="fifth">                
                <card>
                  <div slot="header">
                    <h4 class="card-title text-primary"><i class="fa fa-user m-md-1"></i> Select how to display your html </h4><br>
                  </div>
                  <md-tabs class="md-transparent" md-alignment="fixed" @md-changed="setHTML">
                    <md-tab id="tab-complete" md-label="Complete">
                      <card>
                        <h4 class="card-title"><b>HTML complete form</b></h4><hr><br> <p v-html="completeFormHTML"></p>                        
                      </card>
                      <!--<button class="btn btn-primary btn-square btn-icon " align="rigth" @click="setHTML('complete')"><i class="nc-icon nc-check-2"></i> Save</button>-->                      
                    </md-tab>
                    <md-tab id="tab-semplified" md-label="Semplified">
                       <card>
                        <h4 class="card-title"><b>HTML semplified form</b></h4><hr><br> <p v-html="semplifiedFormHTML"></p>
                      </card>
                      <!--<button class="btn btn-primary btn-square btn-icon " @click="setHTML('semplified')"><i class="nc-icon nc-check-2"></i> Save </button>-->                      
                    </md-tab>
                  </md-tabs>
                  <br><br><hr><br>
                  <div>                    
                    <h4 class="card-title text-primary"><i class="fa fa-user m-md-1"></i> Preview</h4><br>                    
                    <h5><b>Template name:</b> {{template.templatename}}</h5>
                    <h5><b>Owner:</b> {{template.owner}}</h5>
                    <h5><b>Creator:</b> {{template.cid}}</h5>
                    <h5><b>Version:</b> {{template.version}}</h5>                    
                  </div>
                </card>        

                <button class="btn btn-primary btn-square btn-icon " v-if="postButton===true" @click="postTemplate()"><i class="nc-icon nc-check-2"></i> Post new template</button>
                <button class="btn btn-primary btn-square btn-icon " v-if="detailsButton===true" @click="templateDetailsPage()"><i class="nc-icon nc-zoom-split"></i> See template details</button>                
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
          <!--
          <md-card v-if="templateList.length == 0">
            <card>
              <div slot="header">
                <h4 class="card-title text-primary">No template found.</h4><br>
                <button class="btn btn-secondary btn-square btn-icon"  @click="technicalTemplateFlow()"><i class="nc-icon nc-simple-add"></i> Add new</button><br><br>
              </div>
            </card>
          </md-card>
          -->
        </div>
      </div>            
    </div>
  </div>
</template>

<script>

  import Card from 'src/components/UIComponents/Cards/Card.vue'    
  import PostTemplateJSON from 'src/components/UIComponents/Inputs/PostTemplateJson'
  import {OWNER} from "../../../app.config"
  
  import axios from 'axios'

  import editor from '@tinymce/tinymce-vue'


  export default {
    components: {
      Card, editor, PostTemplateJSON
    },
    data() {
      return {

        steppers: true,
        

        //steppers configuration
        active: 'first',        
        first: false,
        firstStepError: null,
        templateList: [],       
        selectedTemplate: null,  
        importTemplateEnabled: false,   
        showAddTemplateButtons: false,
        

        second: false,
        secondStepError: null,
        filters: [], 
        metadata: {},
        key: "",
        value: "",        
        solidityMustacheVariable: [],   // elenco variabili mustache presenti nel solidity   -->   ["contractName", "owner"]
        solidityVariableTypeInHTML: [], // elenco variabili mustache presenti nel solidity   -->   [["contractName", "string", "contratto1"],["owner", "string", "0x2ba3....."]]
        templatenameError: false,  
        templatenameErrorMessage: "",  
        versionError: false,  
        versionErrorMessage: "",  
        constraintError: false,  
        constraintErrorMessage: "", 


        fourth: false,
        fourthStepError: null,        
        missingSolidityVariableFlag: false,
        missingSolidityVariableInHTML: [],
        fifth: false,
        fifthStepError: null,
        choosenTemplateForm: "tab-complete",
        completeFormHTML: "",
        semplifiedFormHTML: "",        


        sixth: false,
        sixthStepError: null,
        postButton: true,
        detailsButton: false,
        
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
        responseMsg: {
          id: 0
        }               
      }
    },
  
    mounted() {
      this.getTechnicalTemplates()      
      
    },
    methods: {

      //check if first step is correct
      checkFirst() {
        if(this.selectedTemplate == null) {
          this.setError('first', 'Select a template')
        } else if(this.templateList.length > 0) {
          this.template = this.selectedTemplate                
          delete this.template.id
          delete this.template.date
          this.template.templatename = ''
          this.template.version = ''     
          this.template.published = false
          this.solidityMustacheVariable = this.getMustacheVariable(this.template.solidity)  
          this.setDone('first', 'second') 
          this.getTemplates() 
        } else {        
          this.setError('first', 'No templates found')
        }
      },
      modifyTechnicalTemplateFlow: function(templateId) {
        this.$router.push("/template/modifyTechnical/" + templateId);
      },
      enableAddTemplateButtons: function() {
        this.showAddTemplateButtons = true
      },
      enableImportTemplate: function() {
        if(this.importTemplateEnabled == true) {
          this.importTemplateEnabled = false
        } else {
          this.importTemplateEnabled = true
        }
      },
      technicalTemplateFlow: function() {
        this.$router.push("/technical/");
      },
      fullTemplateFlow: function() {
        this.$router.push("/full/");        
      },

      // check if the second step is correct, validation constraint
      checkSecond() {        
        for(let i=0; i<this.templateList.length; i++) {
          if((this.templateList[i].version == this.template.version) && (this.templateList[i].templatename == this.template.templatename) && (this.templateList[i].cid == this.template.cid) && ((this.templateList[i].owner == this.template.owner))) {
            this.setError('second', 'Error')
            this.constraintError = true
            this.constraintErrorMessage = "A template with this name and version already exists"
            return
          }
        }
        this.constraintError = false
        if(this.template.templatename === '' || this.template.templatename === null) { 
          this.templatenameError = true
          this.templatenameErrorMessage = "Error: template name is required"
          this.setError('second', 'Error'); 
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
          this.setError('second', 'Error'); 
          return 
        }       
        this.versionError = false   
        this.addFiltersToMetadata();          
        this.firstStepError = null
        this.setDone('second', 'third')
      },   
      addFiltersToMetadata: function() { 
        for(let i=0; i<this.filters.length; i++) {
          let key = this.filters[i]          
          this.template.metadata[key] = "tags"
        }        
      },
      getTechnicalTemplates: function () {      
        return new Promise((resolve, reject) => {
          var http = axios.create({
            baseURL: process.env.VUE_APP_GENERATOR_ENDPOINT,          
          });
          http.get('/' + OWNER + '/templates/')
          .then(response => {                        
            for(let i=0; i<response.data.length; i++) {
              if(response.data[i].html == "") {
                this.templateList.push(response.data[i])
              }
            }
            
            this.selectedTemplate = this.templateList[0]
            this.template.metadata = {}            
            this.template.cid = this.$store.state.auth.owner
          }).catch(e => { 
            this.templateList = []            
            this.setError('first', 'No templates found.')
          });
        })
      },
      getTemplates: function () {        
        return new Promise((resolve, reject) => {
          var http = axios.create({
            baseURL: process.env.VUE_APP_GENERATOR_ENDPOINT,          
          });
          http.get('/' + OWNER + '/templates/')
          .then(response => {                                    
            this.templateList = response.data  
            this.selectedTemplate = this.templateList[0]
            this.template.metadata = {}            
            this.template.cid = this.$store.state.auth.owner
          }).catch(e => { 
            this.templateList = []            
            this.setError('first', 'No templates found.')
          });
        })
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
        for(let i=0; i<mustacheVariable.length; i++) {
          this.solidityVariableTypeInHTML.push([mustacheVariable[i], "text", ""])
        }        
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
        return mustacheVariable;
      },


      //controlla se tutte le variabili solidity sono nell'html
      checkThird: function() {
        this.semplifiedFormHTML = ""
        this.completeFormHTML = ""
        let error = false;
        if(this.template.text != null && this.template.text != '') { // if editor is not empty
          this.missingSolidityVariableInHTML = [] // array of missing variables, to print in HINT message
          for(let i=0; i<this.solidityMustacheVariable.length; i++) { // replace html variable with input typ                         
            let indices = this.getIndicesOf("{{" + this.solidityMustacheVariable[i] + "}}", this.template.text)  
            if(indices.length < 1) { // if some solidity variable is not written in html
              this.missingSolidityVariableInHTML.push(this.solidityMustacheVariable[i])
              this.missingSolidityVariableFlag = true
              this.setError('fourth', 'Invalid HTML')     
              error = true                       
            }
          }        
          if(error) return // if error break          
          this.setDone('third', 'fourth')
          this.missingSolidityVariableFlag=false
          this.fourthStepError = null
        } else {
          this.setError('third', 'Missing HTML')
        }   
      },

      checkFourth: function() {              
        for(let i=0; i<this.solidityVariableTypeInHTML.length; i++) {
          if(this.solidityVariableTypeInHTML[i][1] == "default_value") {                        
            this.sobstituteDefaultVariable(this.solidityVariableTypeInHTML[i][0], this.solidityVariableTypeInHTML[i][2])            
          }
        }
        // quando ha finito le sostituzioni, genera l'html dal text        
        this.semplifiedFormHTML = this.generateSemplifiedForm(this.template.text)
        this.completeFormHTML = this.generateCompleteForm(this.template.text) // genero l'html
        this.template.html = this.completeFormHTML        
        this.setDone('fourth', 'fifth')
      },

      sobstituteDefaultVariable: function(mustacheVariable, defaultVariable) {
        // togliere dal solidity e template.text {{nome_variabile}} e mettere il default_value cioè this.solidityVariableTypeInHTML[i][1]        
        this.template.text = this.replaceAll(this.template.text, "{{" + mustacheVariable + "}}", defaultVariable);
        this.template.solidity = this.replaceAll(this.template.solidity, "{{" + mustacheVariable + "}}", defaultVariable);        
        // togliere anche il required della variabile dal jsonschema
        let jsonschemaParsed = JSON.parse(this.template.jsonschema)
        let requiredVariableInSchema = jsonschemaParsed.required        
        var index = requiredVariableInSchema.indexOf(mustacheVariable);
        if (index !== -1) requiredVariableInSchema.splice(index, 1);        
        jsonschemaParsed.required = requiredVariableInSchema        
        this.template.jsonschema = JSON.stringify(jsonschemaParsed)        
      },

      replaceAll: function(str, find, replace) {          
        return str.replace(new RegExp(find, 'g'), replace);
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
      generateCompleteForm: function(html) {  //Nota: html is the editor content         
        for(let i=0; i<this.solidityVariableTypeInHTML.length; i++) { // for each variable found in editor content
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
          } else if (indices.length > 1) { // se più di un occorrenza, il primo è un input text, le altre label output
            html = html.replace("{{"+this.solidityVariableTypeInHTML[i][0]+"}}", string_mustache)
            offset+=(string_mustache.length-this.solidityVariableTypeInHTML[i][0].length-4)       
            for(let j=1; j<indices.length; j++) {
              let second_var =  "<output name='" + this.solidityVariableTypeInHTML[i][0] +"'></output>"
              html = this.replaceVariables(html, offset+indices[j], "{{"+this.solidityVariableTypeInHTML[i][0]+"}}", second_var)
              offset+=(second_var.length-this.solidityVariableTypeInHTML[i][0].length-4)
            }   
          }
        }
        let htmlComplete = this.transformHtmlVariablesComplete(html);        
        return htmlComplete;
      },
      transformHtmlVariablesComplete: function(html) {        
        let startDelimiterIndexes = this.getIndicesOf("[[", html)
        let endDelimiterIndexes = this.getIndicesOf("]]", html)
        let offset = 0;
        if(startDelimiterIndexes.length == endDelimiterIndexes.length) {
          for(let i=0; i<startDelimiterIndexes.length; i++) { //per ogni variabile html

            let variable = html.substring(startDelimiterIndexes[i]+2+offset, endDelimiterIndexes[i]+offset) // var1 
            //console.log('variable', variable)
            let indicesHTMLVariable = this.getIndicesOf("[["+variable+"]]", html)
            if(indicesHTMLVariable.length == 1) { // se c'è solo un occorrenza                  
              //console.log(variable, "una sola occorrenza")
              let inputVariable = "<input id='" + variable + "' type='text'  value='{{" + variable + "}}'>"
              html = this.replaceVariables(html, startDelimiterIndexes[i]+offset, "[["+variable+"]]", inputVariable)
              offset+=(inputVariable.length-variable.length-4)      
            } else if (indicesHTMLVariable.length > 1) { // se più di un occorrenza, il primo è un input text, le altre label output
              //console.log(variable, "più occorrenze")
              /*let inputVariable = "<input id='" + variable + "' type='text'  value='{{" + variable + "}}'>"
              html = this.replaceVariables(html, startDelimiterIndexes[i]+offset, "[["+variable+"]]", inputVariable)
              offset+=(inputVariable.length-variable.length-4)
              for(let j=1; j<indicesHTMLVariable.length; j++) {
                let second_var =  "<output name='" + variable + "'></output>"
                html = this.replaceVariables(html, offset+indicesHTMLVariable[j], "[["+variable+"]]", second_var)
                offset+=(second_var.length-variable.length-4)
              }*/
            }
          }
        }
        return html; 
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
            let html_temp = html    
            html = this.replaceVariables(html_temp, indices[j]+offset, "{{"+this.solidityVariableTypeInHTML[i][0]+"}}", variable)
            offset+=(variable.length-this.solidityVariableTypeInHTML[i][0].length-4)            
          }
        }        
        // replace html variables
        let htmlVariables = this.getHtmlVariables(html)  
        for(let i=0; i<htmlVariables.length; i++) {
          let htmlVariableIndexes = this.getIndicesOf("[["+htmlVariables[i]+"]]", html)
          let offset = 0;
          declarationVariable += "<div>"+ htmlVariables[i] + ": <input id='" + htmlVariables[i] + "' type='text'  value='{{" + htmlVariables[i] + "}}' oninput=\"updateLabel('" + htmlVariables[i] + "')\"> </div>"              
          let variable = "<output name='" + htmlVariables[i] +"'></output> "   
          let html_temp = html   
          html = this.replaceVariables(html_temp, htmlVariableIndexes[0]+offset, "[["+htmlVariables[i]+"]]", variable)
          offset+=(variable.length-htmlVariables[i].length-4)                      
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
      


      // setta la tipologia di form del template
      setHTML: function(activeTab) {        
        this.choosenTemplateForm = activeTab
        if(activeTab=='tab-complete') {
          this.template.html = this.completeFormHTML
        } else if(activeTab=='tab-semplified') {
          this.template.html = this.semplifiedFormHTML
        } 
        return                        
      },


      // error management
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
            this.fifthStepError = message
            break          
          default:
            console.log('debug: Unknown error')
            break
        }         
      },


      // navigation
      goBack: function() {
        this.$router.go(-1)
      },
      setSuccess: function() {
        this.postButton = false
        this.detailsButton = true
      },
      templateDetailsPage: function() {
        this.$router.push("/templateDetails/"+this.responseMsg.id);
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
      },      
    }
  }
</script>

<style>

</style>