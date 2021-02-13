<template>
  <div class="columns">
    <!-- griglia-->
    <div class="column">
      <div class="columns">
        <div class="column">
          <svg width="1728" height="86">
            <image
              href="http://localhost:5000/thumbnails/index.jpg"
              width="1728"
              height="54"
              @click="_GOTOPAGE($event)"
            />
            <line
              v-for="line in bookmark"
              :key="line.img"
              :x1="(line.index / imgList.length) * 1728"
              :x2="(line.index / imgList.length) * 1728"
              y1="54"
              y2="86"
              style="stroke: rgb(255, 0, 0); stroke-width: 1"
            ></line>
            <rect
              :x="((thumbPage * 16) / imgList.length) * 1728"
              y="0"
              :width="(16 / imgList.length) * 1728"
              height="54"
              stroke="yellow"
              fill="gray"
              fill-opacity="0.7"
              stroke-opacity="0.9"
            />
          </svg>
        </div>
      </div>
      <div class="columns">
        <div class="column is-7">
          <div class="columns">
            <div class="column">
              <nav class="pagination" role="navigation" aria-label="pagination">
                <a class="pagination-previous" @click="_PGDOWN()">Previous</a>
                <a class="pagination-next" @click="_PGUP()">Next page</a>
              </nav>
            </div>
          </div>
          <div
            v-show="imgList.length > 1"
            v-for="row in 4"
            :key="row"
            class="columns"
          >
            <div v-for="column in 4" :key="column" class="column">
              <img
                :src="
                  'http://localhost:5000/thumbnails/' +
                  imgList[16 * thumbPage + (row - 1) * 4 + (column - 1)].img
                "
                @mouseover.ctrl="
                  _SETFOCUS(16 * thumbPage + (row - 1) * 4 + (column - 1))
                "
                @click="
                  _MARKCATEGORY(16 * thumbPage + (row - 1) * 4 + (column - 1))
                "
              />
              <p style="font-size: 10px">
                {{ imgList[16 * thumbPage + (row - 1) * 4 + (column - 1)].img }}
              </p>
              <p>
                {{
                  imgList[16 * thumbPage + (row - 1) * 4 + (column - 1)]
                    .category
                }}
              </p>
            </div>
          </div>
        </div>
        <!-- controllo-->
        <div class="column">
          <div class="columns">
            <div class="column">Page</div>
            <div class="column">
              {{ thumbPage }}
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <font-awesome-icon
                @click="_PGDOWNBOOKMARK"
                icon="arrow-circle-left"
                style="font-size: 24"
              />
            </div>
            <div class="column">
              {{ bookmark[selectedBookmark] }}
            </div>
            <div class="column">
              <font-awesome-icon
                @click="_PGUPBOOKMARK"
                icon="arrow-circle-right"
                style="font-size: 24"
              />
            </div>
          </div>
          <div class="columns">
            <div class="column">get Stats</div>
            <div class="column">
              <i>images:{{ stats.imgs }}</i>
              <i>rects:{{ stats.rects }}</i>
              <i v-for="item in stats.categories" :key="item">
                {{ item.category }}: {{ item.index }}
              </i>
            </div>
            <div class="column">
              <font-awesome-icon
                @click="_GETSTATS"
                icon="chart-bar"
                style="font-size: 24"
              />
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <svg
                width="640"
                height="360"
                @mousedown="_STARTRECT($event)"
                @mouseup="_ENDRECT($event)"
                @mousemove="_MOVERECT($event)"
              >
                <image
                  v-show="focusImage.img !== undefined"
                  :href="'http://localhost:5000/images/' + focusImage.img"
                  width="640"
                  height="360"
                />
                <rect
                  :x="rect0.x"
                  :y="rect0.y"
                  :width="rect1.x - rect0.x"
                  :height="rect1.y - rect0.y"
                  stroke="blue"
                  fill="purple"
                  fill-opacity="0.3"
                  stroke-opacity="0.9"
                />
              </svg>
            </div>
          </div>
          <div class="columns">
            <div class="column">visibility</div>
            <div class="column">
              <select v-model="selectedCategoryVisibility">
                <option
                  v-for="option in categoriesVisibilityOptions"
                  :key="option"
                >
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
          <div class="columns">
            <div class="column">classify</div>
            <div class="column">
              <select v-model="selectedCategory">
                <option v-for="option in categoriesOptions" :key="option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
          <div class="columns">
            <div class="column">add rect</div>
            <div class="column">
              <font-awesome-icon
                @click="_ADDRECT"
                icon="plus-square"
                style="font-size: 24"
              />
            </div>
          </div>
          <div
            class="columns"
            v-for="(rect, index) in focusImage.rects"
            :key="index"
          >
            <div class="column">
              <input v-model="rect.label" />
              {{ rect.rect0.x }}, {{ rect.rect0.y }}, {{ rect.rect1.x }},
              {{ rect.rect1.y }},
            </div>
            <div class="column">
              <font-awesome-icon
                @click="_SEERECT(rect)"
                icon="eye"
                style="font-size: 24"
              />
              <font-awesome-icon
                @click="_REMOVERECT(rect)"
                icon="minus-square"
                style="font-size: 24"
              />
            </div>
          </div>
          <div class="columns">
            <div class="column">save meta</div>
            <div class="column">
              <font-awesome-icon
                icon="save"
                style="font-size: 24"
                @click="saveMeta()"
              />
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
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data: () => {
    return {};
  },
  computed: {
    ...mapState([
      "thumbPage",
      "bookmark",
      "categoriesOptions",
      "categoriesVisibilityOptions",
      "selectedBookmark",
      "rect0",
      "rect1",
      "stats",
    ]),
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
    focusImage: {
      get() {
        if (this.$store.state.focusImage !== undefined)
          return this.$store.state.imgList[this.$store.state.focusImage];
        return { img: undefined, category: undefined, rects: [] };
      },
    },
    selectedCategoryVisibility: {
      get() {
        return this.$store.state.selectedCategoryVisibility;
      },
      set(category) {
        this.$store.commit("_SETCATEGORYVISIBILITY", category);
      },
    },
    selectedCategory: {
      get() {
        return this.$store.state.selectedCategory;
      },
      set(category) {
        this.$store.commit("_SETCATEGORY", category);
      },
    },
  },
  methods: {
    ...mapActions(["refreshThumbs", "getThumbs", "saveMeta"]),
    ...mapMutations([
      "_PGUP",
      "_PGDOWN",
      "_GOTOPAGE",
      "_SETFOCUS",
      "_STARTRECT",
      "_ENDRECT",
      "_MOVERECT",
      "_ADDRECT",
      "_REMOVERECT",
      "_SEERECT",
      "_MARKCATEGORY",
      "_PGUPBOOKMARK",
      "_PGDOWNBOOKMARK",
      "_GETSTATS",
    ]),
  },
};
</script>

<style>
.control {
  position: fixed;
  right: 0;
}
.fitting {
  max-width: 100%;
  max-height: 100%;
}
</style>
