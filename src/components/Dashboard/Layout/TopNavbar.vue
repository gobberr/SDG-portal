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
        <h4 class="card-title text-primary">User: <b>{{user}}</b></h4>        
      </div>       
      <div class="collapse navbar-collapse justify-content-center">
        <h4 class="card-title text-primary">Owner: <b>{{APP_OWNER}}</b></h4>        
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
        user: this.$store.state.auth.owner,                
        APP_OWNER: OWNER
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
          window.location = "https://dev.dfil-tech.eu/aac-hera/logout?target=https://dev.dfil-tech.eu/hera-contract-portal/"          
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
