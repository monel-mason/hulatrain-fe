<template>
  <div class="columns">
    <!-- griglia-->
    <div class="column">
      <div class="columns">
        <div class="column">
          <div v-for="column in 16" :key="column" class="picbox">
            <img
              :src="
                'http://localhost:5000/thumbnails/' +
                imgList[16 * thumbPage + (column - 1)].img
              "
            />
            <p style="font-size: 10px">
              {{ imgList[16 * thumbPage + (column - 1)].img }}
            </p>
            <p>
              {{ imgList[16 * thumbPage + (column - 1)].category }}
            </p>
          </div>
        </div>
        <div class="column ">
          <div v-for="column in 16" :key="column" class="picbox">
            <img
              :src="
                'http://localhost:5000/thumbnails/' +
                imgList[16 * thumbPage + (column - 1)].c0
              "
            />
          </div>
        </div>
        <div class="column is-5"></div>
        <!-- controllo-->
        <div class="column is-5 nav">
          <nav class="pagination" role="navigation" aria-label="pagination">
            <a class="pagination-previous" @click="_PGDOWN()">Previous</a>
            <a class="pagination-next" @click="_PGUP()">Next page</a>
          </nav>
          <div class="columns">
            <div class="column">Page</div>
            <div class="column">
              {{ thumbPage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "Filter",
  props: {
    msg: String,
  },
  data: () => {
    return {};
  },
  computed: {
    ...mapState(["thumbPage"]),
    imgList: {
      get() {
        var ret;
        if (this.$store.state.selectedCategoryVisibility === "All")
          return this.$store.state.imgList;
        if (this.$store.state.selectedCategoryVisibility === "None")
          ret = this.$store.state.imgList.filter((v) => {
            return v.category === undefined;
          });
        else
          ret = this.$store.state.imgList.filter((v) => {
            return v.category === this.$store.state.selectedCategoryVisibility;
          });
        if (ret.length === 0) {
          return this.$store.state.imgList;
        }
        return ret;
      },
    },
  },
  methods: {
    ...mapActions(["saveMeta"]),
    ...mapMutations(["_PGUP"]),
  },
};
</script>

<style>
.picbox{
  height: 205px;
}
.nav {
  position: fixed;
  top: 300;
  right: 0;
  padding: 10px !important;
  width: 30%;
  height: 50px;
}
.control {
  position: fixed;
  right: 0;
}
.fitting {
  max-width: 100%;
  max-height: 100%;
}
</style>
