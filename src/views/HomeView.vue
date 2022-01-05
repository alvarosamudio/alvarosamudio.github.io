<template>
  <v-container>
    <v-card class="mx-auto" elevation="4" max-width="500">
      <v-list-item>
        <v-list-item-content>
          <h2>Alvaro Samudio</h2>
          <p>
            <v-icon>mdi mdi-cake-variant</v-icon> Feb. 1997
          </p>
          <p>
            <v-icon>mdi mdi-city</v-icon> Panama 🇵🇦
          </p>
          <p>
            <v-icon>mdi mdi-heart</v-icon> Linux 🐧
          </p>
          <p>
            <v-icon>mdi mdi-code-braces</v-icon> C C++ Python PHP JavaScript 
          </p>
        </v-list-item-content>

        <v-spacer />

        <v-avatar class="profile" color="grey" size="20%">
          <v-img src="https://avatars.githubusercontent.com/u/25090546?v=4" max-width="200px"></v-img>
        </v-avatar>
      </v-list-item>

      <v-card-actions>
        <v-btn icon @click="dialog_email = true">
          <v-icon>fas fa-envelope</v-icon>
        </v-btn>
        <v-btn icon href="https://github.com/alvarosamudio">
          <v-icon>fab fa-github</v-icon>
        </v-btn>
        <v-btn icon href="https://twitter.com/alvarolsamudio">
          <v-icon>fab fa-twitter</v-icon>
        </v-btn>
        <v-btn icon href="https://www.instagram.com/alvarosamudio/">
          <v-icon>fab fa-instagram</v-icon>
        </v-btn>
        <v-btn icon @click="dialog_btc = true">
          <v-icon>fab fa-bitcoin</v-icon>
        </v-btn>
 
      </v-card-actions>
    </v-card>
    
    <v-card class="mx-auto" elevation="4" max-width="500" title="About Me">
      <HistoryTimeLine :items="history" />


      <v-list lines="one">
        <v-list-item prependIcon="mdi" title="⚔️ Cybersecurity enthusiast. 🛡️"/>
        <v-list-item prependIcon="mdi" title="⚙️ Open source."/>
        <v-list-item prependIcon="mdi" title="🌱 Nature lover."/>
        <v-list-item prependIcon="mdi" title="I like to program 👨‍💻, read 📚, take pictures 📸."/>
        <v-list-item prependIcon="mdi" title="⚡ You can find my contact information on the left."/>
      </v-list>
    </v-card>

    <v-card class="mx-auto" elevation="4" max-width="500" title="Skills">
      <v-list lines="two">
        <v-list-item prependIcon="mdi mdi-linux" title="Linux" subtitle="kernel build, userland, server settings" />
        <v-list-item prependIcon="mdi mdi-package-variant" title="Container Techs" subtitle="Docker" />
        <v-list-item prependIcon="mdi mdi-web" title="Web Development" subtitle="JavaScript, PHP" />
      </v-list>
    </v-card>


    <v-dialog v-model="dialog_email">
      <v-card title="Email">
        <v-card-text>
          alvarosamudio@criptext.com
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn href="mailto:alvarosamudio@criptext.com">
            Open in App
          </v-btn>
          <v-btn text @click="dialog_email = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog_btc">
      <v-card title="Bitcoin">
        <v-card-text>
          bc1qte89nq55d65javmncg4paxymv9mww4m3ngrr3h
        </v-card-text>
        <v-layout center>
          <v-img src="@/assets/img/btc.jpg" max-width="500px"></v-img>
        </v-layout>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn href="bitcoin:bc1qte89nq55d65javmncg4paxymv9mww4m3ngrr3h">
            Open in App
          </v-btn>
          <v-btn text @click="dialog_btc = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import HistoryTimeLine from "@/components/HistoryTimeLine.vue";
  export default defineComponent({
    components: {
      HistoryTimeLine
    },
    data() {
      return {
        dialog_email: false,
        dialog_btc: false,

      }
    }
  });
</script>

<style>
  .mx-auto {
    margin: 10px auto;
  }
</style>