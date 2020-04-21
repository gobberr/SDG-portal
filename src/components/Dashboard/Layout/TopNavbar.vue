<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <!--<a class="navbar-brand" href="#">Dashboard</a>-->
      <button type="button"
              class="navbar-toggler navbar-toggler-right"
              :class="{toggled: $sidebar.showSidebar}"
              aria-controls="navigation-index"
              aria-expanded="false"
              aria-label="Toggle navigation"
              @click="toggleSidebar">
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-left">
        <h4 class="card-title text-primary">Nome: <b>{{name}}</b></h4>        
        
      </div>       
      <div class="collapse navbar-collapse justify-content-left">
        <h4 class="card-title text-primary">Email: <b>{{email}}</b></h4>        
        
      </div>       
      <div class="collapse navbar-collapse justify-content-left">
        <h4 class="card-title text-primary">Wallet address: <b>{{wallet_address}}</b></h4>        
      </div>  
      <div class="collapse navbar-collapse justify-content-left">
        <h4 class="card-title text-primary">Token: <b>{{token_counter}}TK</b></h4>        
      </div>       
      <div  class="collapse navbar-collapse justify-content-end">
        <button v-show="owner != ''" @click="logout" class="btn btn-danger btn-square btn-icon justify-content-end"><i class="nc-icon nc-key-25"></i>&nbsp;&nbsp; Logout</button>
      </div>    
      
    </div>    
  </nav>
</template>
<script>

  
  import {OWNER} from "../../../app.config";
  import {AUTH_LOGOUT} from 'src/store/actions/auth'
  import axios from 'axios';  

  export default {

    computed: {      
      routeName() {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      }
    },

    data() {
      return {        
        name: this.$store.state.auth.owner,                
        //email: this.$store.state.auth.email,
        //wallet_address: this.$store.state.auth.wallet_address,
        //token_counter: this.$store.state.auth.token_counter,

        //FIXME: these are mockup data
        email: "utente@email.it",
        wallet_address: "0x5eD8Cee6b63b1c6AFce3AD7c92f4fD7E1B8fAd9F",
        token_counter: "136"
      }
    },    

    mounted() {    
      
    },

    methods: {
      
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown() {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown() {
        this.activeNotifications = false
      },
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false)
      },
      logout() {                
        this.$store.dispatch(AUTH_LOGOUT).then(() => {                  
          console.log('Removed access token from Vue App session')
          window.location = "https://dev.dfil-tech.eu/aac-hera/logout?target=http://localhost:8000/" //FIXME: when this app will be deployed, update the target param with your own url
        });        
      },
      debug() {
        console.log(this.$store.state.auth)
      }

    }
  }

</script>
<style>

</style>
