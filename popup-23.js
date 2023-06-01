/**
 * @summary     Popup23
 * @description popup window
 * @version     1.0.6
 * @file        popup-23
 * @author      realmag777
 * @contact     https://pluginus.net/contact-us/
 * @github      https://github.com/realmag777/popup-23
 * @copyright   Copyright 2023 PluginUs.NET
 *
 * This source file is free software, available under the following license: MIT license - https://en.wikipedia.org/wiki/MIT_License
 */

'use strict';
//29-05-2023
//1 object is 1 popup
export default class Popup23 {

    constructor(data = {}) {
        if (typeof Popup23.z_index === 'undefined') {
            Popup23.z_index = 15001;
        }

        ++Popup23.z_index;
        this.create(data);
    }

    create(data = {}) {
        this.data = data;
        this.data.close_word = data.close_word ?? 'Close';
        this.data.start_content = data.start_content ?? 'Loading ...';

        this.node = document.createElement('div');

        if (typeof data.id === 'undefined') {
            data.id = this.create_id();
        }
        this.node.setAttribute('id', data.id);

        this.node.className = 'popup23-wrapper';
        this.node.innerHTML = this.get_template();

        document.querySelector('body').appendChild(this.node);
        this.node.querySelector('.popup23').style.zIndex = Popup23.z_index;

        if (!this.data.hide_backdrop) {
            this.node.querySelector('.popup23-backdrop').style.zIndex = Popup23.z_index - 1;
        } else {
            this.node.querySelector('.popup23-backdrop').remove();
        }

        this.node.querySelectorAll('.popup23-close, .popup23-footer-button-close').forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                this.close();
                return false;
            });
        });

        //***

        this.set_title(data.title);

        if (typeof data.help_info !== 'undefined') {
            this.set_title_info(data.help_info);
        }

        if (typeof data.width !== 'undefined') {
            this.node.querySelector('.popup23').style.maxWidth = data.width;
            this.node.querySelector('.popup23').style.minWidth = data.width;
        }

        if (typeof data.height !== 'undefined') {
            this.node.querySelector('.popup23').style.maxHeight = data.height;
            this.node.querySelector('.popup23').style.minHeight = data.height;
        }

        if (typeof data.left !== 'undefined') {
            this.node.querySelector('.popup23').style.left = data.left;
        }

        if (typeof data.right !== 'undefined') {
            this.node.querySelector('.popup23').style.right = data.right;
        }

        if (typeof data.top !== 'undefined') {
            this.node.querySelector('.popup23').style.top = data.top;
        }

        if (typeof data.bottom !== 'undefined') {
            this.node.querySelector('.popup23').style.bottom = data.bottom;
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
        if (typeof data.mousemove !== 'undefined') {

            let can_move = false;
            let header = this.node.querySelector('.popup23-header');
            header.onmouseover = () => header.style.cursor = 'move';

            header.addEventListener('mousedown', e => {
                can_move = true;
            });

            document.addEventListener('mouseup', e => {
                can_move = false;
            });


            let position = localStorage.getItem(data.id) ? JSON.parse(localStorage.getItem(data.id)) : {};
            if (position.left) {
                this.node.querySelector('.popup23').style.setProperty('left', position.left);
            }

            if (position.top) {
                this.node.querySelector('.popup23').style.setProperty('top', position.top);
            }

            let timer = null;

            //+++

            let prev_screenX = -1;
            let prev_screenY = -1;
            document.addEventListener('mousemove', e => {

                if (can_move) {

                    if (prev_screenX !== -1 && e.which === 1 && e.clientX > 0) {
                        let left = this.node.querySelector('.popup23').style.left;
                        let diff = parseInt(e.screenX) - prev_screenX;
                        position.left = `calc(${left} + ${diff}px)`;
                        this.node.querySelector('.popup23').style.setProperty('left', position.left);
                    }

                    if (prev_screenY !== -1 && e.which === 1 && e.clientY > 0) {
                        let top = this.node.querySelector('.popup23').style.top;
                        let diff = parseInt(e.screenY) - prev_screenY;
                        position.top = `calc(${top} + ${diff}px)`;
                        this.node.querySelector('.popup23').style.setProperty('top', position.top);
                    }

                    prev_screenX = parseInt(e.screenX);
                    prev_screenY = parseInt(e.screenY);
                    if (timer) {
                        clearInterval(timer);
                    }
                    timer = setTimeout(() => localStorage.setItem(data.id, JSON.stringify(position)), 777);

                }

            });
        }
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
                       <div class="popup23-content">${this.data.start_content}</div>
                   </div>
                   <div class="popup23-footer">
                       <a href="javascript: void(0);" class="button popup23-footer-button-close">${this.data.close_word}</a>
                   </div>
               </div>
           </div>

        <div class="popup23-backdrop"></div>
    `;
    }

    close() {
        this.node.remove();
    }

    create_id(prefix = 'pop23-') {
        return prefix + Math.random().toString(36).substring(7);
    }

    set_title(title = '') {
        this.node.querySelector('.popup23-title').innerHTML = title;
    }

    set_title_info(info) {
        let container = this.node.querySelector('.popup23-title-info');
        container.innerHTML = '';
        if (typeof info === 'object') {
            container.appendChild(info);
        } else {
            container.innerHTML = info;
        }
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
