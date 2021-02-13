/*global axios*/

//import { startsWith } from "core-js/fn/string";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    categories: undefined,
    message: undefined,
    messageColor: "green",
    imgList: [{
      img: undefined, category: undefined, rects: [{ rect0: { x: undefined, y: undefined }, rect1: { x: undefined, y: undefined }, label: undefined }]
    }],
    thumbPage: 0,
    focusImage: undefined,
    categoriesOptions: undefined,
    categoriesVisibilityOptions: undefined,
    drawing: false,
    rect0: { x: 0, y: 0 },
    rect1: { x: 0, y: 0 },
    selectedCategoryVisibility: "All",
    selectedCategory: undefined,
    metaList: undefined,
    selectedMeta: undefined,
    autoload: {},
    bookmark: [],
    selectedBookmark: undefined,
    stats: { rects: 0, categories: [], imgs: 0 }
  },
  mutations: {
    _AUTOLOAD: function (state, payload) {
      switch (payload.type) {
        case ("categories"):
          localStorage.setItem("al.categories", payload.data)
          state.autoload.categories = payload.data
          if (payload.data)
            state.categories = localStorage.getItem("lastUsedCategories");
          else
            state.categories = undefined
          break;
        case ("refThumb"):
          localStorage.setItem("al.refThumb", payload.data)
          break;
        case ("getThumb"):
          localStorage.setItem("al.getThumb", payload.data)
          break;
        case ("getMeta"):
          localStorage.setItem("al.getMeta", payload.data)
          break;
      }
    },
    _SETCATEGORIES: function (state, categories) {
      state.categories = categories;
      state.categoriesOptions = categories.split(',')
      state.categoriesVisibilityOptions = categories.split(',')
      state.categoriesVisibilityOptions.push("All")
      state.categoriesVisibilityOptions.push("None")
      if (state.autoload.categories) {
        localStorage.setItem("lastUsedCategories", state.categories)
      }
    },
    _SETCATEGORYVISIBILITY: function (state, category) {
      var asIs
      if (category === "All" && state.thumbPage !== 0) {
        asIs = state.imgList.filter((v) => {
          return v.category === state.selectedCategoryVisibility;
        });
        state.thumbPage = Math.round(state.imgList.findIndex(e => { return e.img === asIs[state.thumbPage * 16].img }) / 16)
      }
      else
        state.thumbPage = 0

      state.selectedCategoryVisibility = category;
    },
    _SETCATEGORY: function (state, category) {
      state.selectedCategory = category;
    },
    _PGUP: function (state) {
      if (state.thumbPage < Math.ceil(state.imgList.length / 16.0)) {
        state.focusImage = undefined;
        state.thumbPage = state.thumbPage + 1
      }
    },
    _PGDOWN: function (state) {
      if (state.thumbPage > 0) {
        state.focusImage = undefined;
        state.thumbPage = state.thumbPage - 1
      }
    },
    _GOTOPAGE: function (state, event) {
      if (state.selectedCategoryVisibility === "All")
        state.thumbPage = Math.ceil(event.offsetX / 1728 * state.imgList.length / 16)
      else {
        state.message = "Navigation only on All Categories"
        state.messageColor = "yellow"
      }
    },
    _PGUPBOOKMARK: function (state) {
      if (state.selectedBookmark === undefined) {
        state.selectedBookmark = 0
      }
      if (state.selectedBookmark < state.bookmark.length - 1) {
        state.selectedBookmark++
      }
      state.thumbPage = Math.round(state.bookmark[state.selectedBookmark].index / 16)
    },
    _PGDOWNBOOKMARK: function (state) {
      if (state.selectedBookmark !== undefined && state.selectedBookmark > 0)
        state.selectedBookmark--
      state.thumbPage = Math.round(state.bookmark[state.selectedBookmark].index / 16)
    },
    _SETFOCUS: function (state, focus) {
      var tmp
      if (state.selectedCategoryVisibility === "All") {
        tmp = focus
      }
      if (state.selectedCategoryVisibility === "None") {
        tmp = state.imgList.filter((v) => {
          return v.category === undefined
        });
        tmp = state.imgList.findIndex(e => { return e.img === tmp[focus].img })
      }
      if (state.selectedCategoryVisibility !== "None" && state.selectedCategoryVisibility !== "All") {
        tmp = state.imgList.filter((v) => {
          return v.category === state.selectedCategoryVisibility;
        });
        tmp = state.imgList.findIndex(e => { return e.img === tmp[focus].img })
      }
      state.focusImage = tmp;
      state.rect0.x = 0
      state.rect0.y = 0
      state.rect1.x = 0
      state.rect1.y = 0
    },
    _STARTRECT: function (state, event) {
      console.log("down")
      state.rect0.x = event.offsetX
      state.rect0.y = event.offsetY
      state.drawing = true;
    },
    _MOVERECT: function (state, event) {
      if (state.drawing) {
        console.log("move")
        state.rect1.x = event.offsetX
        state.rect1.y = event.offsetY
      }
    },
    _ENDRECT: function (state, event) {
      console.log("up")
      state.rect1.x = event.offsetX
      state.rect1.y = event.offsetY
      state.drawing = false;
    },
    _ADDRECT: function (state) {
      var add = { rect0: { x: state.rect0.x, y: state.rect0.y }, rect1: { x: state.rect1.x, y: state.rect1.y }, label: undefined }
      state.imgList[state.focusImage].rects.push(add)
      Vue.set(state.imgList, state.focusImage, state.imgList[state.focusImage])
    },
    _REMOVERECT: function (state, rect) {
      state.imgList[state.focusImage].rects = state.imgList[state.focusImage].rects.filter(item => item != rect)
      Vue.set(state.imgList, state.focusImage, state.imgList[state.focusImage])
    },
    _SEERECT: function (state, rect) {
      state.rect0.x = rect.rect0.x
      state.rect0.y = rect.rect0.y
      state.rect1.x = rect.rect1.x
      state.rect1.y = rect.rect1.y
    },
    _MARKCATEGORY: function (state, click) {
      var tmp
      if (state.selectedCategoryVisibility === "All") {
        tmp = click
      }
      if (state.selectedCategoryVisibility === "None") {
        tmp = state.imgList.filter((v) => {
          return v.category === undefined
        });
        tmp = state.imgList.findIndex(e => { return e.img === tmp[click].img })
      }
      if (state.selectedCategoryVisibility !== "None" && state.selectedCategoryVisibility !== "All") {
        tmp = state.imgList.filter((v) => {
          return v.category === state.selectedCategoryVisibility;
        });
        tmp = state.imgList.findIndex(e => { return e.img === tmp[click].img })
      }
      state.focusImage = tmp;
      state.imgList[tmp].category = state.selectedCategory;
      Vue.set(state.imgList, tmp, state.imgList[tmp])
    },
    _SETMETA: function (state, meta) {
      state.selectedMeta = meta
    },
    _GETSTATS(state) {
      state.stats.categories = []
      var acc = []
      for (var i = 0; i < state.categoriesOptions.length; i++)
        acc[state.categoriesOptions[i]] = 0
      state.stats.rects = 0
      state.stats.imgs = 0
      state.imgList.forEach((elem) => {
        if (elem.category !== undefined)
          acc[elem.category]++
        if (elem.rects !== undefined && elem.rects.length > 0)
          state.stats.rects = state.stats.rects + elem.rects.length
        state.stats.imgs++
      })
      for (i in acc) {
        state.stats.categories.push({ category: i, index: acc[i] })
      }
    }
  },
  actions: {
    //FIXME - is a put or a post
    refreshThumbs: async function ({ state }) {
      try {
        state.messageColor = "black";
        state.message = 'Requesting...';
        var ret = await axios.get("http://localhost:5000/refreshThumbs");
        //state.image = new Blob([ret.data],{ type:'image/jpeg'});
        if (ret.data.startsWith("Error:")) {
          state.messageColor = "red";
          state.message = ret.data;
        } else {
          state.message = ret.data;
          state.messageColor = "green";
        }
      } catch (err) {
        state.message = err;
        state.messageColor = "red";
      }
    },
    getThumbs: async function ({ state }) {
      try {
        //var acc = [];
        state.messageColor = "black";
        state.message = 'Requesting...';
        var ret = await axios.get("http://localhost:5000/getThumbs");
        if (ret.data.message.startsWith("Error:")) {
          state.messageColor = "red";
          state.message = ret.data;
        } else {
          for (var i = 0; i < ret.data.result.length; i++)
            state.imgList[i] = {
              img: ret.data.result[i],
              c0: ret.data.result[i][0] + "m_" + ret.data.result[i].substring(3, ret.data.result[i].length - 4) + "-0canny.jpg",
              category: undefined,
              rects: []
            }
          state.bookmark = []
          for (i = 0; i < ret.data.bookmark.length; i++) {
            var add = {}
            add.img = ret.data.bookmark[i]
            add.index = state.imgList.findIndex(a => {
              return (a.img === ret.data.bookmark[i])
            }
            )
            state.bookmark.push(add)
          }
          state.message = ret.data.message;
          state.messageColor = "green";
        }
      } catch (err) {
        state.message = err;
        state.messageColor = "red";
      }
    },
    getMetas: async function ({ state }) {
      try {
        //var acc = [];
        state.messageColor = "black";
        state.message = 'Requesting...';
        var ret = await axios.get("http://localhost:5000/getMetas");
        if (ret.data.message.startsWith("Error:")) {
          state.messageColor = "red";
          state.message = ret.data;
        } else {
          state.metaList = ret.data.result
          state.message = ret.data.message;
          state.messageColor = "green";
        }
      } catch (err) {
        state.message = err;
        state.messageColor = "red";
      }
    },
    getMasks: async function ({ state }) {
      try {
        //var acc = [];
        state.messageColor = "black";
        state.message = 'Requesting...';
        var ret = await axios.get("http://localhost:5000/getMasks");
        if (ret.data.message.startsWith("Error:")) {
          state.messageColor = "red";
          state.message = ret.data;
        } else {
          state.maskList = ret.data.result
          state.message = ret.data.message;
          state.messageColor = "green";
        }
      } catch (err) {
        state.message = err;
        state.messageColor = "red";
      }
    },
    saveMeta: async function ({ state }) {
      try {
        //var acc = [];
        state.messageColor = "black";
        state.message = 'Saving Meta...';
        var ret = await axios.post("http://localhost:5000/saveMeta", state.imgList);
        if (ret.data.message.startsWith("Error:")) {
          state.messageColor = "red";
          state.message = ret.data;
        } else {
          state.message = ret.data.message;
          state.messageColor = "green";
        }
      } catch (err) {
        state.message = err;
        state.messageColor = "red";
      }
    },
    getMeta: async function ({ state }) {
      try {
        //var acc = [];
        console.log("aaa")
        var warning = 0
        var counter = 0
        var merged = 0
        state.messageColor = "black";
        state.message = 'Merging Meta...';
        var ret = await axios.get("http://localhost:5000/getMeta", { params: { meta: state.selectedMeta } });
        if (ret.data.message.startsWith("Error:")) {
          state.messageColor = "red";
          state.message = ret.data;
        } else {
          state.message = ret.data.message;
          ret.data.result.sort((a, b) => { return ('' + a.img).localeCompare(b.img) })
          for (var i = 0; i < state.imgList.length; i++) {
            while (state.imgList[i].img > ret.data.result[counter].img && counter < ret.data.result.length) {
              warning++
              counter++
            }
            if (state.imgList[i].img === ret.data.result[counter].img) {
              merged++
              if (ret.data.result[counter].rects.length > 0)
                state.imgList[i].rects = ret.data.result[counter].rects
              if (ret.data.result[counter].category !== undefined)
                state.imgList[i].category = ret.data.result[counter].category
            }
            counter++
          }
        }
        state.messageColor = "green";
        state.message = "applied set " + counter + " founded " + merged; +" warnings " + warning
      } catch (err) {
        state.message = err;
        state.messageColor = "red";
      }
    }
  },
  modules: {},
});
