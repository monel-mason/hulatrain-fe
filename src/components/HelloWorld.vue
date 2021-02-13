<template>
  <div class="container">
    <h1 class="title">{{ msg }}</h1>
    <div class="columns">
      <div class="column is-7 has-text-right-tablet">Categories:</div>
      <div class="column is-4 has-text-right-tablet">
        <input placeholder="mosse,nonmosse" v-model="categories" />
      </div>
      <div class="column has-text-left-tablet">
        <input type="checkbox" v-model="histCategory" />
      </div>
    </div>
    <div class="columns">
      <div class="column is-7 has-text-right-tablet">
        Refresh Thumbs & indexes
      </div>
      <div class="column is-4 has-text-right-tablet">
        <font-awesome-icon
          icon="sync-alt"
          style="font-size: 24px"
          @click="refreshThumbs()"
        />
      </div>
      <div class="column has-text-left-tablet">
        <input type="checkbox" v-model="histRefThumb" />
      </div>
    </div>

    <div class="columns">
      <div class="column is-7 has-text-right-tablet">Get Thumbs</div>
      <div class="column is-4 has-text-right-tablet">
        <font-awesome-icon
          icon="sync-alt"
          style="font-size: 24px"
          @click="getThumbs()"
        />
      </div>
      <div class="column has-text-left-tablet">
        <input type="checkbox" v-model="histGetThumb" />
      </div>
    </div>
    <div class="columns">
      <div class="column is-7 has-text-right-tablet">Get Meta</div>
      <div class="column is-4 has-text-right-tablet">
        <font-awesome-icon
          icon="sync-alt"
          style="font-size: 24px"
          @click="getMetas()"
        />
      </div>
      <div class="column has-text-left-tablet">
        <input type="checkbox" v-model="histGetMeta" />
      </div>
    </div>
    <div class="columns">
      <div class="column is-7 has-text-right-tablet">Load</div>
      <div class="column is-4 has-text-right-tablet">
        <select v-model="selectedMeta">
          <option v-for="option in metaList" :key="option">
            {{ option }}
          </option>
        </select>
        <font-awesome-icon
          icon="object-group"
          style="font-size: 24px"
          @click="getMeta()"
        />
      </div>
      <div class="column has-text-left-tablet">
        <input type="checkbox" />
      </div>
    </div>
    <div class="columns">
      <div class="column is-7 has-text-right-tablet">Get Masks</div>
      <div class="column is-4 has-text-right-tablet">
        <font-awesome-icon
          icon="sync-alt"
          style="font-size: 24px"
          @click="getMasks()"
        />
      </div>
      <div class="column has-text-left-tablet">
        <input type="checkbox" v-model="histGetMask" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data: () => {
    return {};
  },
  created: async function () {
    this.$store.state.autoload.categories = JSON.parse(
      localStorage.getItem("al.categories")
    );
    this.$store.state.autoload.refThumb = JSON.parse(
      localStorage.getItem("al.refThumb")
    );
    this.$store.state.autoload.getThumb = JSON.parse(
      localStorage.getItem("al.getThumb")
    );
    this.$store.state.autoload.getMeta = JSON.parse(
      localStorage.getItem("al.getMeta")
    );
    this.$store.state.autoload.getMask = JSON.parse(
      localStorage.getItem("al.getMask")
    );
    if (this.$store.state.autoload.categories) {
      this.$store.state.categories = localStorage.getItem("lastUsedCategories");
      this.$store.state.categoriesOptions = this.$store.state.categories.split(
        ","
      );
      this.$store.state.categoriesVisibilityOptions = this.$store.state.categories.split(',')
      this.$store.state.categoriesVisibilityOptions.push("All")
      this.$store.state.categoriesVisibilityOptions.push("None")
    }
    if (this.$store.state.autoload.refThumb)
      await this.$store.dispatch("refreshThumbs");
    if (this.$store.state.autoload.getThumb)
      await this.$store.dispatch("getThumbs");
    if (this.$store.state.autoload.getMeta)
      await this.$store.dispatch("getMetas");
    if (this.$store.state.autoload.getMask)
      await this.$store.dispatch("getMasks");
    console.log("ok");
  },
  computed: {
    ...mapState(["message", "messageColor", "metaList", "autoload"]),
    histGetMeta: {
      get() {
        return this.$store.state.autoload.getMeta;
      },
      set(dataCheck) {
        this.$store.commit("_AUTOLOAD", {
          type: "getMeta",
          data: dataCheck,
        });
      },
    },
    histGetThumb: {
      get() {
        return this.$store.state.autoload.getThumb;
      },
      set(dataCheck) {
        this.$store.commit("_AUTOLOAD", {
          type: "getThumb",
          data: dataCheck,
        });
      },
    },
    histRefThumb: {
      get() {
        return this.$store.state.autoload.refThumb;
      },
      set(dataCheck) {
        this.$store.commit("_AUTOLOAD", {
          type: "refThumb",
          data: dataCheck,
        });
      },
    },
    histCategory: {
      get() {
        return this.$store.state.autoload.categories;
      },
      set(dataCheck) {
        this.$store.commit("_AUTOLOAD", {
          type: "categories",
          data: dataCheck,
        });
      },
    },
    selectedMeta: {
      get() {
        return this.$store.state.selectedMeta;
      },
      set(selectedMeta) {
        this.$store.commit("_SETMETA", selectedMeta);
      },
    },
    categories: {
      get() {
        return this.$store.state.categories;
      },
      set(categories) {
        this.$store.commit("_SETCATEGORIES", categories);
      },
    },
  },
  methods: {
    ...mapActions(["refreshThumbs", "getThumbs", "getMetas", "getMeta","getMasks"]),
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
i {
  outline: 2px solid;
  padding: 10px 30px;
}
</style>
