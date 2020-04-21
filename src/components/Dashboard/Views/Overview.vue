<template>
  <div class="content " >
    <div class="container-fluid">            
      <div class="row">
           
        <!-- Lista prodotti -->
        <div class="col-6">
          <card>
            <h4 class="text-primary">Prodotti acquistabili </h4><br><br>
                            
            <card>
              <md-card-header>
                <md-card-header-text>
                  <div class="md-title"><h3><b>HERA Led</b></h3></div><br><br>
                  <div class="md-subhead"><h5>Inizia subito a risparmiare sui tuoi consumi elettrici grazie al kit di lampadine LED</h5></div><br>
                  <div><h4>30 Token</h4></div>
                </md-card-header-text>

                <md-card-media md-big>
                  <img src="static/img/hera_led.png" alt="hera_led">
                </md-card-media>
              </md-card-header>

              <md-card-actions>                
                <button v-on:click="seeDetails()"
                  class="btn btn-primary btn-wd btn-icon "><i class="nc-icon nc-zoom-split"></i>&nbsp;&nbsp;Details
                </button>
              </md-card-actions>
            </card>

          </card>
        </div>
      </div>      
    </div>
  </div>

</template>
<script>  

  import Card from 'src/components/UIComponents/Cards/Card.vue'  
  import AuthService from '../../../services/AuthService.js';  
  import axios from 'axios';  
  import {AUTH_REQUEST} from 'src/store/actions/auth'  
  
  export default {
    components: {     
      Card
    },
    data() {
      return {        
        auth: new AuthService()        
      }
    },
    mounted() {
      if(!this.isAuthenticated()) {
        // same of login button of login page
        //console.log('user is not autenticated')
        this.auth.getUser().then((response) => {
          if(response != null) {            
            this.$store.dispatch(AUTH_REQUEST, { userInfo: response }).then(() => {                                
              let routeData = this.$router.resolve('/');
              this.$router.go(routeData);    
              this.auth.login()    
            })              
          } else { // no user found in localStorage, so redirect to AC for login            
            this.auth.login()
          }
        })        
      } 
    },
    methods: {

      isAuthenticated: function() {
        if (this.$store.getters.isAuthenticated) {          
          return true
        } else {
          return false
        }
      },

      logout: function() {
        this.auth.logout();
      }
    }
  }
</script>
<style>
  .central {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 50%;
    margin-top: 0.75rem;
  }

  .img-size-fix {
    width: 100px;
    height: 100px;
  }

  .top-logo-heading-overview {
    width: 17%;
    margin-bottom: 0rem;
    margin-top: 0rem;
  }
</style>
