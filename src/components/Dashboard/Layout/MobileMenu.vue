<template>
  <ul class="nav nav-mobile-menu">
    <li class="nav-item">
      <a class="nav-link">
        <div v-show="owner != ''">
          <b-button variant="danger" @click="logout">Logout</b-button>
        </div>
      </a>
    </li>
  </ul>
</template>
<script>

  import DropDown from 'src/components/UIComponents/Dropdown.vue'
  import {AUTH_LOGOUT} from 'src/store/actions/auth'
  
  export default {
    components: {
      DropDown
    },
    methods: {
      logout() {        
        this.$store.dispatch(AUTH_LOGOUT).then(() => {                  
          console.log('Removed access token from Vue App session')
          window.location = "https://dev.dfil-tech.eu/aac-hera/logout?target=http://localhost:8000/" // //FIXME: when this app will be deployed, update the target param with your own url         
        });        
      }
    }
  }
</script>
<style>
</style>
