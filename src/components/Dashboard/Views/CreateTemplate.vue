<template>
  <div class="content">
    <div class="container-fluid">      
      <div class="row">                
        <div class="col-12"> 
          
           <card>
            <h4 class="card-title text-primary">Select how to create your template</h4><hr><br>
            <div class="row">              
              <div class="col-md-3">              
                <button v-on:click="enableTechnicalTemplate()" class="btn choiceButton text-primary ml-4"><br>
                  <i class="nc-icon nc-settings-90 big-size-icon"></i>&nbsp;Technical Template
                  <p class="card-category"><br>&nbsp;&nbsp;Solidity and Json Schema <br> step-by-step procedure&nbsp;&nbsp;</p><br>
                </button>
              </div> 

              <div class="col-md-3">
                <button v-on:click="enableHTMLTemplate()" class="btn choiceButton text-primary ml-4"><br>
                  <i class="fa fa-file-text big-size-icon"></i>&nbsp;&nbsp;HTML Template
                  <p class="card-category"><br>&nbsp;&nbsp;Semplified <br> step-by-step procedure&nbsp;&nbsp;</p><br>
                </button>
              </div> 

              <div class="col-md-3">              
                <button v-on:click="enableFullTemplate()" class="btn choiceButton text-primary ml-4"><br>
                  <i class="nc-icon nc-puzzle-10 big-size-icon"></i>&nbsp;Full Template
                  <p class="card-category"><br>&nbsp;&nbsp;Full <br> step-by-step procedure&nbsp;&nbsp;</p><br>
                </button>
              </div>    

              <div class="col-md-3">
                <button v-on:click="enableImportTemplate()" class="btn choiceButton text-primary ml-4"><br>
                  <i class="fa fa-cloud-upload big-size-icon"></i>&nbsp;&nbsp;&nbsp;Import Template
                  <p class="card-category"><br>&nbsp;&nbsp;Upload your template in json format&nbsp;&nbsp;</p><br>
                </button>
              </div>
            </div>
            <br>
            </card>
          

          <card v-if="importTemplateEnabled">    
            <h4 class="card-title text-primary">Import Template Guide</h4><hr><br>
            <p>
              1) create your json file with the following structure:
            </p><br><br>

            <pre>
              {
                "cid": "your username",                
                "html": "your html here",                
                "jsonschema": "your json schema here",
                "metadata": { "your metadata here" },
                "owner": "Hera",
                "published": false,
                "solidity": "your solidity here",
                "templatename": "your template name here",
                "text": "your template text",
                "version": "your version"
              }
            </pre>    

            <p>
            2) upload your file in the following box: 
            </p> <br><br>

            <PostTemplateJSON></PostTemplateJSON> 
          </card>

          <card v-if="htmlTemplateEnabled">   
            <h4 class="card-title text-primary">HTML Template Guide</h4><hr><br>                     
            <p>
            1) choose a template skeleton <br>
            2) write your template's tags and your html in order to customize your own template<br>
            3) post your template
            </p> <br><br>
            <button type="submit" class="btn btn-primary btn-fill" @click.prevent="htmlTemplateProcedure">
              Start creating your template
            </button>            
          </card>

          <card v-if="technicalTemplateEnabled">     
            <h4 class="card-title text-primary">Technical Template Guide</h4><hr><br>    
            <p>                           
            1) write your template's tags <br>
            2) write your solidity <br>
            3) write your json schema <br>                      
            4) post your template 
            </p> <br><br>

            <button type="submit" class="btn btn-primary btn-fill" @click.prevent="technicalTemplateProcedure">
              Start creating your template
            </button>
          </card>

          <card v-if="fullTemplateEnabled">     
            <h4 class="card-title text-primary">Full Template Guide</h4><hr><br>    
            <p>                           
            1) write your template's tags <br>
            2) write your solidity <br>
            3) write your json schema <br>                      
            4) write your html <br>                      
            5) post your template
            </p> <br><br>

            <button type="submit" class="btn btn-primary btn-fill" @click.prevent="fullTemplateProcedure">
              Start creating your template
            </button>
          </card>

        </div>  
      </div>            
    </div>
  </div>
</template>

<script>

  import Card from 'src/components/UIComponents/Cards/Card.vue'
  import SolidityReader from 'src/components/UIComponents/Inputs/SolidityReader'  
  import PostTemplateJSON from 'src/components/UIComponents/Inputs/PostTemplateJson'
  import JsonSchemaReader from 'src/components/UIComponents/Inputs/JsonSchemaReader'
  import {OWNER} from "../../../app.config"
  import axios from 'axios'


  

  export default {
    components: {
      Card, PostTemplateJSON
    },
    data() {
      return {
        importTemplateEnabled: false,
        technicalTemplateEnabled: false,
        htmlTemplateEnabled: false,
        fullTemplateEnabled: false

      }
    },
  
    methods: {

      technicalTemplateProcedure: function() {
        this.$router.push("/technical/");
      },

      fullTemplateProcedure: function() {
        this.$router.push("/full/");
      },

      htmlTemplateProcedure: function() {
        this.$router.push("/html/");
      },

      enableImportTemplate: function() {
        if(this.importTemplateEnabled == false) {
          this.importTemplateEnabled = true
          this.technicalTemplateEnabled = false
          this.htmlTemplateEnabled = false
          this.fullTemplateEnabled = false
        } 
      },

      enableTechnicalTemplate: function() {
        if(this.technicalTemplateEnabled == false) {
          this.technicalTemplateEnabled = true
          this.htmlTemplateEnabled = false
          this.importTemplateEnabled = false
          this.fullTemplateEnabled = false
        }
      },

      enableFullTemplate: function() {
        if(this.fullTemplateEnabled == false) {
          this.fullTemplateEnabled = true
          this.htmlTemplateEnabled = false
          this.technicalTemplateEnabled = false
          this.importTemplateEnabled = false
        }
      },

      enableHTMLTemplate: function() {
        if(this.htmlTemplateEnabled == false) {
          this.htmlTemplateEnabled = true
          this.importTemplateEnabled = false
          this.technicalTemplateEnabled = false
          this.fullTemplateEnabled = false
        }
      }
    }
  }
</script>

<style lang="scss">
  
  .choiceButton {
    color: black;
    padding: 1px 1px;
    min-height: 250px; /* minimum height */
    min-width: 240px;
    position: relative;
    cursor: pointer;
    padding-top: 4%;
    padding-bottom: 4%;
  }

  .choiceButton:hover {
    background: lightcyan; /* when mouse over to the drop zone, change color */
    text: "";
  }

  .big-size-icon {
    font-size: 1.8em;
    vertical-align: -4%;
    margin-right: 3%;
  }

</style>
