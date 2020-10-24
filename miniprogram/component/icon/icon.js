// miniprogram/component/icon/icon.js
Component({
  options: {
    addGlobalClass: true
  },

  externalClasses: ['custom-class'],

  properties: {
    info: null,
    name: String,
    size: String,
    color: String
  },

  methods: {
    onClick() {
      this.triggerEvent('click');
    }
  }
});