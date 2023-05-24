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
//25-05-2023
//1 object is 1 popup
class Popup23 {

    constructor(data = {}) {
        if (typeof Popup23.z_index === 'undefined') {
            Popup23.z_index = 15001;
        }

        ++Popup23.z_index;
        this.create(data);
    }

    create(data = {}) {
        this.node = document.createElement('div');
        let div_id = this.create_id('popw-');
        this.node.setAttribute('id', div_id);
        this.node.className = 'popup23-wrapper';
        this.close_word = typeof data.close_word !== 'undefined' ? data.close_word : 'Close';
        this.start_content = typeof data.start_content !== 'undefined' ? data.start_content : 'Loading ...';
        this.node.innerHTML = this.get_template();
        document.querySelector('body').appendChild(this.node);
        this.node.querySelector('.popup23').style.zIndex = Popup23.z_index;
        this.node.querySelector('.popup23-backdrop').style.zIndex = Popup23.z_index - 1;

        this.node.querySelectorAll('.popup23-close, .popup23-footer-button-close').forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                this.close();
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
            this.clear_content();
            this.append_content(iframe);
        }

        //***

        if (typeof data.title !== 'undefined' && data.title.length > 0) {
            this.set_title(data.title);
        }

        if (typeof data.help_title !== 'undefined' && data.help_title.length > 0) {
            if (typeof data.help_link !== 'undefined' && data.help_link.length > 0) {
                this.set_title_info(`<a href="${data.help_link}" class="popup23-btn" target="_blank">${data.help_title}</a>`);
            } else {
                this.set_title_info(data.help_title);
            }
        }

        if (typeof data.width !== 'undefined') {
            this.node.querySelector('.popup23').style.maxWidth = data.width + 'px';
        }

        if (typeof data.height !== 'undefined') {
            this.node.querySelector('.popup23').style.maxHeight = data.height + 'px';
        }

        if (typeof data.left !== 'undefined') {
            this.node.querySelector('.popup23').style.left = data.left + '%';
        }

        if (typeof data.right !== 'undefined') {
            this.node.querySelector('.popup23').style.right = data.right + '%';
        }

        if (typeof data.action !== 'undefined' && data.action.length > 0) {
            document.dispatchEvent(new CustomEvent(data.action, {detail: {...data, ... {popup: this}}}));
        }

        this.node.querySelector('.popup23-content-wrapper').addEventListener('scroll', (e) => {
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
        <div class="popup23">
               <div class="popup23-inner">
                   <div class="popup23-header">
                       <h3 class="popup23-title">&nbsp;</h3>
                       <div class="popup23-title-info">&nbsp;</div>
                       <a href="javascript: void(0);" class="popup23-close"></a>
                   </div>
                   <div class="popup23-content-wrapper">
                       <div class="popup23-content">${this.start_content}</div>
                   </div>
                   <div class="popup23-footer">
                       <a href="javascript: void(0);" class="button popup23-footer-button-close">${this.close_word}</a>
                   </div>
               </div>
           </div>

        <div class="popup23-backdrop"></div>
    `;
    }

    close() {
        this.node.remove();
    }

    create_id(prefix = '') {
        return prefix + Math.random().toString(36).substring(7);
    }

    set_title(title) {
        this.node.querySelector('.popup23-title').innerHTML = title;
    }

    set_title_info(info) {
        this.node.querySelector('.popup23-title-info').innerHTML = info;
    }

    set_content(content) {
        this.node.querySelector('.popup23-content').innerHTML = content;
        document.dispatchEvent(new CustomEvent('popup23-set-content', {detail: {popup: this, content: content}}));
    }

    clear_content(content = '') {
        this.node.querySelector('.popup23-content').innerHTML = content;
        document.dispatchEvent(new CustomEvent('popup23-clear-content', {detail: {popup: this, content: content}}));
    }

    append_content(node) {
        this.node.querySelector('.popup23-content').appendChild(node);
    }

    get_content_area_height() {
        return this.node.querySelector('.popup23-content-wrapper').offsetHeight - 50;
    }
}

