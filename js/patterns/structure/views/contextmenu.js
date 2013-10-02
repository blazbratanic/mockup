// Author: Nathan Van Gheem
// Contact: nathan@vangheem.us
// Version: 1.0
//
// Description:
//
// License:
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//


define([
  'jquery',
  'underscore',
  'backbone',
  'js/ui/views/base'
], function($, _, Backbone, BaseView) {
  "use strict";

  var ContextMenu = BaseView.extend({
    className: 'dropdown clearfix contextmenu',
    events: {
      'click .cut a': 'cutClicked',
      'click .copy a': 'copyClicked',
      'click .paste a': 'pasteClicked',
      'click .move-top a': 'moveTopClicked',
      'click .move-bottom a': 'moveBottomClicked',
      'click .set-default-page a': 'setDefaultPageClicked'
    },
    template: _.template(
      '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">' +
          '<li class="cut"><a href="#">Cut</a></li>' +
          '<li class="copy"><a href="#">Copy</a></li>' +
          '<li class="paste"><a href="#">Paste</a></li>' +
          '<li class="divider"></li>' +
          '<li class="move-top"><a href="#">Move to top of folder</a></li>' +
          '<li class="move-bottom"><a href="#">Move to bottom of folder</a></li>' +
          '<li class="divider"></li>' +
          '<li class="set-default-page"><a href="#">Set as default page</a></li>' +
      '</ul>'),
    active: null,
    initialize: function(){
      var self = this;
      BaseView.prototype.initialize.call(self);
    },
    render: function(){
      var self = this;
      self.$el.html(self.template({}));
      self.$el.hide();

      $('body').bind('modal-click click', function(){
        self.$el.hide();
        self.removeActiveClass();
      });

      self.$paste = self.$('.paste');
      self.$cut = self.$('.cut');
      self.$copy = self.$('.copy');
      self.$moveTop = self.$('.move-top');
      self.$moveBottom = self.$('.move-bottom');
      self.$setDefaultPage = self.$('.set-default-page');

      return this;
    },
    removeActiveClass: function(){
      this.container.$('.contextmenuactive').removeClass('contextmenuactive');
    },
    showHideButtons: function($el){
      var self = this;
      var folderish = $el.attr('data-folderish');
      if(folderish === 'true'){
        // its a valid folder type
        if(self.app.pasteAllowed){
          self.$paste.show();
        }else{
          self.$paste.hide();
        }
        self.$setDefaultPage.hide();
      }else{
        self.$paste.hide();
        self.$setDefaultPage.show();
      }
    },
    bind: function($el){
      var self = this;
      $el.bind('contextmenu', function(e){
        self.removeActiveClass();
        self.$el.css({
          display: 'block',
          left: e.pageX,
          top: e.pageY
        });
        self.showHideButtons($el);
        self.$active = $el;
        $el.addClass('contextmenuactive');
        return false;
      });
    },
    cutClicked: function(){
      this.cutCopyClicked('cut');
    },
    copyClicked: function(){
      this.cutCopyClicked('copy');
    },
    cutCopyClicked: function(operation){
      var self = this;
      self.app.pasteOperation = operation;

      var uid = self.$active.attr('data-UID');
      var model = self.app.collection.findWhere({UID: uid});
      if(model){
        self.app.pasteSelection = new Backbone.Collection();
        self.app.pasteSelection.add(model);
        self.app.setStatus(operation + ' 1 item');
        self.app.pasteAllowed = true;
        self.app.buttons.primary.get('paste').enable();
      }else{
        self.app.setStatus('could not ' + operation + ' item');
      }
    },
    pasteClicked: function(){
      this.app.pasteEvent(this.app.buttons.primary.get('paste'), {
        folder: this.$active.attr('data-path')
      });
    },
    moveTopClicked: function(){

    },
    moveBottomClicked: function(){

    },
    setDefaultPageClicked: function(){

    }
  });

  return ContextMenu;
});
