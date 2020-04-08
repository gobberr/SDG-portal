<template>
  <div class="content" v-if="renderComponent">
    <div class="container-fluid">
      
        <!--<template slot="header">
          <h4 class="card-title text-primary">Compile template</h4>
          <p class="card-category"></p>
        </template>-->
        <div :templateId="id" :cid="cid" class="templateSM">{{id}} {{cid}} (press CTRL+R)</div> 


        
      
    </div>
  </div>
</template>

<script>
  import Card from 'src/components/UIComponents/Cards/Card.vue'

  export default {
    components: {
	  Card 
    },
    data() {
      return {
  		renderComponent: true,
		id: this.$route.params.id,
		cid: this.$store.state.auth.owner,
      }
	},
	mounted :function () {
	  	  
	  let initScript = document.createElement('script')
	  initScript.setAttribute('src', 'static/plugins/init.js')
	  document.head.appendChild(initScript)

	  let smtbScript = document.createElement('script')
	  smtbScript.setAttribute('src', 'static/plugins/smtb.js')
	  document.head.appendChild(smtbScript)
	  
	},
	beforeDestroy() {
	  
	  const gsc = document.getElementById('grecaptchascript');
	  gsc.parentElement.removeChild(gsc);
	  
	},
	methods: {
	  
    }
  }

</script>
<style lang="scss">
  .downloadDocumentButton {
    color: black;
    padding: 1px 1px;
    min-height: 40px; /* minimum height */
    min-width: 360px;
    position: relative;
    cursor: pointer;
    padding-top: 3%;
    padding-bottom: 3%;
    word-break: break-all;
  }

  .downloadDocumentButton:hover {
    background: lightcyan; /* when mouse over to the drop zone, change color */
  }

  .big-size-icon {
    font-size: 1.8em;
    vertical-align: -4%;
    margin-right: 3%;
  }
</style>
<style>

	.templateSM
	{
		background-color: #fff;
		background-image: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#eee));
		background-image: -webkit-linear-gradient(top, #fff, #eee);
		background-image: -moz-linear-gradient(top, #fff, #eee);
		background-image: -ms-linear-gradient(top, #fff, #eee);
		background-image: -o-linear-gradient(top, #fff, #eee);
		background-image: linear-gradient(top, #fff, #eee);  
		margin: 50px;
		padding: 30px;
		position: absolute;
		z-index: 0;
		-moz-border-radius: 3px;
		-webkit-border-radius: 3px;
		border-radius: 3px;  
		-webkit-box-shadow:
		    0 0 2px rgba(0, 0, 0, 0.2),
		    0 1px 1px rgba(0, 0, 0, .2),
		    0 3px 0 #fff,
		    0 4px 0 rgba(0, 0, 0, .2),
		    0 6px 0 #fff,  
		    0 7px 0 rgba(0, 0, 0, .2);
		-moz-box-shadow:
		    0 0 2px rgba(0, 0, 0, 0.2),  
		    1px 1px   0 rgba(0,   0,   0,   .1),
		    3px 3px   0 rgba(255, 255, 255, 1),
		    4px 4px   0 rgba(0,   0,   0,   .1),
		    6px 6px   0 rgba(255, 255, 255, 1),  
		    7px 7px   0 rgba(0,   0,   0,   .1);
		box-shadow:
		    0 0 2px rgba(0, 0, 0, 0.2),  
		    0 1px 1px rgba(0, 0, 0, .2),
		    0 3px 0 #fff,
		    0 4px 0 rgba(0, 0, 0, .2),
		    0 6px 0 #fff,  
		    0 7px 0 rgba(0, 0, 0, .2);
	}

	.templateSM:before
	{
		content: '';
		position: absolute;
		z-index: -1;
		border: 1px dashed #ccc;
		top: 5px;
		bottom: 5px;
		left: 5px;
		right: 5px;
		-moz-box-shadow: 0 0 0 1px #fff;
		-webkit-box-shadow: 0 0 0 1px #fff;
		box-shadow: 0 0 0 1px #fff;
	}

	.templateSM h1 
	{
		text-transform: uppercase;
		color: #666;
		font: normal 26px/1 Verdana, Helvetica;
		position: relative;
	}

	.templateSM input
	{
		padding: 8px 8px 8px 15px;
		margin: 0 0 10px 0;
		width: 185px; 
		border: 1px solid #ccc;
		-moz-border-radius: 5px;
		-webkit-border-radius: 5px;
		border-radius: 5px;
		-moz-box-shadow: 0 1px 1px #ccc inset, 0 1px 0 #fff;
		-webkit-box-shadow: 0 1px 1px #ccc inset, 0 1px 0 #fff;
		box-shadow: 0 1px 1px #ccc inset, 0 1px 0 #fff;
	}

	.templateSM output
	{
		margin: 10px 0px;
		padding:12px;
	}

	.templateSM input[type=button] 
	{   
		background-color: #726f79;
		margin: 12px;
		border-style: solid;
		height: 35px;
		width: 120px;
		padding: 0;
		cursor: pointer;
		font: bold 15px Arial, Helvetica;
		color: #ffffff;
	}	

	.templateSM fieldset {
	    border: 0;
	}


</style> 