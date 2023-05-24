/**
 * @summary     Popup23
 * @description popup window
 * @version     1.0.5
 * @file        popup-23
 * @author      realmag777
 * @contact     https://pluginus.net/contact-us/
 * @github      https://github.com/realmag777/popup-23
 * @copyright   Copyright 2023 PluginUs.NET
 *
 * This source file is free software, available under the following license:
 *   MIT license - https://en.wikipedia.org/wiki/MIT_License
 */
'use strict';
//25-05-2023 modificated
//1 object == 1 popup
class Popup23 {

    constructor(data = {}) {
        if (typeof Popup23.z_index === 'undefined') {
            Popup23.z_index = 15003;
        }

        ++Popup23.z_index;
        this.create(data);
    }

    create(data = {}) {
        this.node = document.createElement('div');
        let div_id = this.create_id('popw-');
        this.node.setAttribute('id', div_id);
        this.node.className = 'popup23-dynamic-popup-wrapper';
        this.node.innerHTML = this.get_template();
        document.querySelector('body').appendChild(this.node);
        this.node.querySelector('.popup23-modal').style.zIndex = Popup23.z_index;
        this.node.querySelector('.popup23-modal-backdrop').style.zIndex = Popup23.z_index - 1;

        this.node.querySelectorAll('.popup23-modal-close, .popup23-modal-button-close').forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();

                this.node.remove();
                return false;
            });
        });

        //***

        if (typeof data.iframe !== 'undefined' && data.iframe.length > 0) {
            let iframe = document.createElement('iframe');
            iframe.className = 'popup23-iframe-in-popup';

            if (typeof data.height !== 'undefined') {
                iframe.height = data.height;
            } else {
                iframe.height = this.get_content_area_height();
            }

            iframe.frameborder = 0;
            iframe.allowfullscreen = '';
            iframe.allow = typeof data.allow !== 'undefined' ? data.allow : '';

            iframe.src = data.iframe;
            this.set_content('');
            this.append_content(iframe);
        }

        //***

        if (typeof data.title !== 'undefined' && data.title.length > 0) {
            this.set_title(data.title);
        }

        if (typeof data.help_title !== 'undefined' && data.help_title.length > 0) {
            if (typeof data.help_link !== 'undefined' && data.help_link.length > 0) {
                this.set_title_info(`<a href="${data.help_link}" class="popup23-btn" target="_blank">${data.help_title}</a>`);
            }
        }

        if (typeof data.width !== 'undefined') {
            this.node.querySelector('.popup23-modal').style.maxWidth = data.width + 'px';
        }

        if (typeof data.height !== 'undefined') {
            this.node.querySelector('.popup23-modal').style.maxHeight = data.height + 'px';
        }

        if (typeof data.left !== 'undefined') {
            this.node.querySelector('.popup23-modal').style.left = data.left + '%';
        }

        if (typeof data.left !== 'undefined') {
            this.node.querySelector('.popup23-modal').style.right = data.right + '%';
        }

        if (typeof data.action !== 'undefined' && data.action.length > 0) {
            document.dispatchEvent(new CustomEvent(data.action, {detail: {...data, ... {popup: this}}}));
        }


        //***

        this.node.querySelector('.popup23-modal-inner-content').addEventListener('scroll', (e) => {
            document.dispatchEvent(new CustomEvent('popup23-scrolling', {
                detail: {
                    top: e.srcElement.scrollTop,
                    self: this
                }
            }));


        });

        //***

        return this.node;
    }

    get_template() {
        return `
        <div class="popup23-modal">
               <div class="popup23-modal-inner">
                   <div class="popup23-modal-inner-header">
                       <h3 class="popup23-modal-title">&nbsp;</h3>
                       <div class="popup23-modal-title-info">&nbsp;</div>
                       <a href="javascript: void(0);" class="popup23-modal-close"></a>
                   </div>
                   <div class="popup23-modal-inner-content">
                       <div class="popup23-form-element-container">Loading ...</div>
                   </div>
                   <div class="popup23-modal-inner-footer">
                       <a href="javascript: void(0);" class="btn btn-big btn-blue popup23-modal-button-close">Close</a>
                   </div>
               </div>
           </div>

        <div class="popup23-modal-backdrop"></div>
    `;
    }

    close() {
        if (this.is_custom_node) {
            this.node.style.display = 'none';
        } else {
            this.node.remove();
        }
    }

    create_id(prefix = '') {
        return prefix + Math.random().toString(36).substring(7);
    }

    set_title(title) {
        this.node.querySelector('.popup23-modal-title').innerHTML = title;
    }

    set_title_info(info) {
        this.node.querySelector('.popup23-modal-title-info').innerHTML = info;
    }

    set_content(content) {
        this.node.querySelector('.popup23-form-element-container').innerHTML = content;
        document.dispatchEvent(new CustomEvent('popup23-popup-smth-loaded', {detail: {popup: this, content: content}}));
    }

    append_content(node) {
        this.node.querySelector('.popup23-form-element-container').appendChild(node);
    }

    get_content_area_height() {
        return this.node.querySelector('.popup23-modal-inner-content').offsetHeight - 50;
    }
}