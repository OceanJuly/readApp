const store = {
  state: {
    hotSearchOffsetY: 0,
    flapCardVisible: false,
    isEditMode: false, // 编辑模式变量
    // 书架列表
    shelfList: [],
    shelfSelected: [], // 书架书籍选中列表
    shelfTitleVisible: true, // 显示书籍标题
    shelfCategory: [], // 书架分类列表数据
    currentType: 1 // 书架列表 1 书架分类列表2
  },
  mutations: {
    SET_HOT_SEARCH_OFFSETY (state, offsetY) {
      state.hotSearchOffsetY = offsetY
    },
    SET_FLAP_CARD_VISIBLE (state, visible) {
      state.flapCardVisible = visible
    },
    SET_IS_EDIT_MODE (state, isEditMode) {
      state.isEditMode = isEditMode
    },
    SET_SHELF_LIST (state, list) {
      state.shelfList = list
    },
    SET_SHELF_SELECTED (state, selected) {
      state.shelfSelected = selected
    },
    SET_SHELF_TITLE_VISIBLE (state, visible) {
      state.shelfTitleVisible = visible
    },
    SET_SHELF_CATEGORY (state, category) {
      state.shelfCategory = category
    },
    SET_CURRENT_TYPE (state, type) {
      state.currentType = type
    }
  }
}

export default store
