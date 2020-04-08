<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h4 class="card-title text-primary">Template list</h4>        
              
              <div class="row">
                <!-- Filtri -->              
                <div class="col-md-10">                  
                  <br>                
                  <md-chips class="md-primary shake-on-error" name="filter" id="filter" v-model="filters" :md-format="isValidFilter" md-placeholder='Insert tags here to filter your template list'></md-chips>                  
                </div>
                <div class="col-md-2 align-items-end">
                  <h5>Available Owners:</h5>                  
                  <b-select v-model="selected" @change="updateOwnerAndRefreshTable()">
                    <option v-for="option in options" v-bind:key="option.value">
                      {{ option.text }}
                    </option>
                  </b-select>                  
                </div>
              </div>
            </template>
              

            <!-- Tabella templates -->
            <div class="justify-content-center">
              <b-table id="tableOne" responsive ref="tableOne" bordered hover :items="updateTableByFilter(filters)" :fields="tableOne.fields" v-if="updateTableByFilter(filters).length>0" >
                <template slot="id" slot-scope="cell">
                  <a href="" @click.prevent="showDetails(cell.item, cell.index)" class="link text-primary"><i class="fa fa-2x fa-search-plus" aria-hidden="true"></i></a>
                </template>                
              </b-table>
            </div>


            <!-- Messaggio template not found -->
            <!--<h3 v-if="updateTableByFilter(filters).length<=0"> No templates found for Owner <b>{{selected}}</b></h3><br>-->            
            <h3 v-if="templatesNotFoundMessage"> No templates found for Owner <b>{{selected}}</b></h3><br>

            <!-- Pagination -->
            <card v-if="updateTableByFilter(filters).length>0 || page > 0">
              <div class="row justify-content-center d-flex align-items-center" > 
                <div class="col-md-3">                  
                  <md-button class="md-dense md-primary" :disabled="page<1 || (tableOne.data.lenght < rowPerPage && tableOne.data.lenght != 0)" v-on:click="decreasePage()"><i class="fa fa-chevron-left" aria-hidden="true"></i></md-button>
                </div>
                <div class="col-md-6 d-flex align-items-center">    
                  <md-button class="md-primary" :disabled="rowPerPage<2" v-on:click="decreaseTemplatePerPage()"> - </md-button>
                  <label> Show <b> {{ rowPerPage }} </b> Templates per page </label>
                  <md-button class="md-primary" :disabled="rowPerPage>19" v-on:click="increaseTemplatePerPage()"> + </md-button>
                </div>
                <div class="col-md-3">
                  <md-button class="md-dense md-primary" :disabled="updateTableByFilter(filters).length<=0 || (tableOne.data.length < rowPerPage && tableOne.data.length != 0)" v-on:click="increasePage()"><i class="fa fa-chevron-right" aria-hidden="true"></i></md-button>
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
      key: 'templatename',      
      label: 'Name'
    },
    {
      key: 'version',      
      label: 'Version'
    },
    {
      key: 'date',      
      label: 'Creation Date',
      //formatter: (value) => { return moment(value).format('MMMM Do YYYY, h:mm:ss a'); }
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
        tableOne: {
          fields: [...tableOneColumns],
          data: []          
        },               
        filters: [],
        rowPerPage: 10,
        page: 0,       
        creator: this.$store.state.auth.owner, 

        selected: 'Hera',
        options: [
          { text: 'Hera', value: 'Hera' },
          { text: 'DFIL-Tech', value: 'DFIL-Tech' },          
        ],
        templatesNotFoundMessage: false
      }
    },
    created: function() {
      this.getTemplate();            
    },

    methods: {

      increaseTemplatePerPage: function () {        
        this.rowPerPage ++;
      },

      decreaseTemplatePerPage: function () {
        this.rowPerPage --;
      },

      increasePage: function () {        
        this.page ++;
        this.tableOne.data = []
        this.getTemplate()
      },     

      decreasePage: function () {        
        this.page --;
        this.tableOne.data = []
        this.getTemplate()
      },

      getTemplate: function () {
        var http = axios.create({
          baseURL: process.env.VUE_APP_GENERATOR_ENDPOINT,          
        });
        http.get('/' + this.selected + '/templates/?limit=' + this.rowPerPage + '&offset=' + this.page)
        .then(response => {
          if(response.data.length==0) {
            this.templatesNotFoundMessage = true
          } else {
            this.templatesNotFoundMessage = false
          }
          
          // filter technical template from template list
          for(let i=0; i<response.data.length;i++) {            
            if(response.data[i].html != "") {
              this.tableOne.data.push(response.data[i])
            }            
          }          
        }).catch(e => {           
          this.tableOne.data = []
          
        });
      },

      showDetails(item, index) {
        var app = this;
        app.$router.push("/templateDetails/" + item.id);
      },
      
      refreshTableOne: function() {
        this.$refs.tableOne.refresh();  
        this.getTemplate(this.selected)  
      },

      isValidFilter: function(filter) { 
        
        if(filter.length == 0) return false
        try {
          JSON.parse('{"' + filter + '":"tags"}');
        } catch (e) {          
          return false;
        }        
        return filter
      },      
            
      updateTableByFilter: function(filtersArray) {      
        //console.log(filtersArray)  
        let filteredTemplate = []
        if((filtersArray.length > 0) && (this.tableOne.data.length > 0)) { // se ci sono filtri e template
          this.tableOne.data.forEach(function (template) { // per ogni template, se possiede i filtri allora lo stampo 
            //console.error('- Template ' + template.templatename)             
            let templateIsOk = true;                 
            let metadataOfTemplate = template.metadata            
            var keysOfTemplate = Object.keys(template.metadata); // estraggo tutte le key del template
            
            for (let i=0; i<filtersArray.length; i++) { // per tutti i filtri ricercati, controllo se esistono nel template  
              //console.log(' - Filter ' + filtersArray[i])            
              let filterFound = false;
              keysOfTemplate.forEach(function (key) { // controlla tutte le chiavi del template                                
                //console.log(' - Key ' + key)
                if(filtersArray[i] == key) {                   
                  filterFound = true;                  
                } 
              })
              if(filterFound == false) {
                templateIsOk = false; 
              }                              
            }  
            if(templateIsOk) {              
              filteredTemplate.push(template)                          
            }                      
          });          
        } else { // if no filter or no template is present, skip the filtering          
          return this.tableOne.data
        }        
        return filteredTemplate //return the filtered table
      },

      updateOwnerAndRefreshTable: function() {
        this.tableOne.data = []
        this.getTemplate()
      }
    },
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
