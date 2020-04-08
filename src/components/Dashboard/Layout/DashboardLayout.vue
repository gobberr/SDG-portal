<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/overview">
        <i class="nc-icon nc-grid-45"></i>
        <p>Home</p>
      </sidebar-link>

      <!-- HERA CUSTOMIZATION -->
      <!-- 
        <sidebar-link to="/createTemplate"> 
      -->
      <sidebar-link to="/html"> 
        <i class="nc-icon nc-button-play"></i>
        <p>Create template</p>
      </sidebar-link>      
      
      <sidebar-link to="/templateList">
        <i class="nc-icon nc-single-copy-04"></i>
        <p>Template list</p>
      </sidebar-link>
      <sidebar-link to="/contractList">
        <i class="nc-icon nc-paper-2"></i>
        <p>Contract list</p>
      </sidebar-link>
     
      <sidebar-link to="/smartContractList">
        <i class="nc-icon nc-paper-2"></i>
        <p>Smart Contract list</p>
      </sidebar-link>
      <!-- TODO: Hera customization -->
      <sidebar-link to="/tesoreria">
        <i class="nc-icon nc-paper-2"></i>
        <p>Contratto tesoreria</p>
      </sidebar-link>
      <sidebar-link to="/blockchainList">
        <i class="nc-icon nc-settings-gear-64"></i>
        <p>Blockchain settings</p>
      </sidebar-link>           
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click="toggleSidebar">

      </dashboard-content>

      <!--<content-footer></content-footer>-->
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import MobileMenu from './MobileMenu.vue'

  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu
    },
    data() {
      return {
        activeUser: null,
        usertype: ''
      }
    },
    beforeCreate: function () {
      if (this.$session.exists()) {
        this.activeUser = true;
      }
    },
    mounted() {
      this.usertype = this.$session.get("usertype");
    },
    methods: {
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      }
    }
  }

</script>
