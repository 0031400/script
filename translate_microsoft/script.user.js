// ==UserScript==
// @name         withme translate microsoft
// @namespace    http://blog.withme.top/
// @version      2025-05-25
// @description  withme translate microsoft
// @author       withme
// @match        *://*/*
// @grant        GM_notification
// @grant        GM_addElement
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_deleteValue
// ==/UserScript==

(function () {
    'use strict';
    GM_registerMenuCommand('set up', () => {
        let isWantSet = window.prompt('do you want to set up(yes or no)')
        if (isWantSet != 'yes') return
        let key = window.prompt('key')
        if (!key) {
            window.alert('key null')
            return
        }
        let region = window.prompt('region')
        if (!region) {
            window.alert('region null')
            return
        }
        GM_setValue('key', key)
        GM_setValue('region', region)
        window.alert('ok')
    })
    GM_registerMenuCommand('clean', () => {
        let isWantSet = window.prompt('do you want to clean appId and appKey(yes or no)')
        if (isWantSet != 'yes') return
        GM_deleteValue('appId')
        GM_deleteValue('appKey')
        window.alert('ok')
    })

    var key = GM_getValue('key')
    var region = GM_getValue('region')
    if (!key || !region) return

    document.body.addEventListener('dblclick', action);
})();
function action(e) {


    const inputText = window.getSelection().toString().trim();
    if (!inputText) return

    var key = GM_getValue('key')
    var region = GM_getValue('region')

    let data
    var endpoint = 'https://api.cognitive.microsofttranslator.com'
    var dictApi = '/dictionary/lookup'
    var params = { 'api-version': '3.0', 'from': 'en', 'to': 'zh-Hans' }
    var url = endpoint + dictApi + '?' + Object.entries(params).map(item => item[0] + '=' + item[1]).join('&')
    var requestItem = { 'text': inputText }
    var requestBody = [requestItem]
    var requestHeaders = { 'Ocp-Apim-Subscription-Key': key, 'Ocp-Apim-Subscription-Region': region }

    GM_xmlhttpRequest({
        url: url, method: 'POST', headers: { ...requestHeaders, 'Content-Type': 'application/json' }, data: JSON.stringify(requestBody), responseType: 'json', onload: async (res) => {
            if (res.status != 200) {
                console.error(`status: ${res.status} response: ${res.response}`);
                data = 'fail'
            } else {
                data = res.response[0].translations.map(item => item.displayTarget).join(' ') || 'null'
            }
            let div = document.createElement('div')
            div.innerText = data
            div.style.left = e.clientX + 10 + 'px'
            div.style.top = e.clientY + 10 + 'px'
            div.style.position = 'fixed'
            div.style['z-index'] = 999
            div.style['font-size'] = '1rem'
            document.body.appendChild(div)
            setTimeout(() => {
                if (div) div.remove()
            }, 3000);
        }
    })



}