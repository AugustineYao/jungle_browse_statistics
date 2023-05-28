import utils from "./utils";
import ws from "./websocket";
(function ($) {
    'use strict';
    // ws.initWebSocket()
    // 记录访客的所有浏览信息
    let ipInfo = jungle_browse_statistics
    // 发送Ajax请求到服务器端
    $.post(ipInfo.ajax_url, {
        action: 'user_cache',
        page_url: ipInfo.page_url,
        _ajax_nonce: ipInfo.nonce,
    });

    window.requestIdleCallback = window.requestIdleCallback || function (callback) {
        let start = Date.now();
        return setTimeout(function () {
            callback({
                didTimeout: false,
                timeRemaining: function () {
                    return Math.max(0, 50 - (Date.now() - start));
                }
            });
        }, 1);
    }

    window.cancelIdleCallback = window.cancelIdleCallback || function (id) {
        clearTimeout(id);
    }

    function sendData() {
        let userIsActive = false;
        let timeoutId;
        /*****监听用户一切可能的行为， */
        // 1. 为了避免用户正在活跃中，突然断网（这种类似的用户行为）所以在活跃中的的用户，
        function resetTimer(action) {
            console.log((action ? action.type : '开始执行时') + ': ' + utils.getCurentTime());
            clearTimeout(timeoutId);
            userIsActive = true;
            timeoutId = setTimeout(() => {
                userIsActive = false;
                console.log('没动啦：' + utils.getCurentTime());
            }, 5000);
        }

        window.addEventListener('click', resetTimer);
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                console.log('Tab is not in focus');
            } else {
                console.log('Tab is in focus');
            }
        });

        resetTimer();  // Start the timer


    }

    function scheduleDataSend() {
        // 空闲的时候开始执行，不占用客户一切资源，
        window.requestIdleCallback(() => {
            sendData();
        });
    }
    scheduleDataSend();

    let ws = new WebSocket('ws://localhost.com:8080');

    ws.onopen = () => {
        console.log('Connected to server');

        // 发送心跳
        setInterval(() => {
            ws.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
        }, 1000); // 5秒发送一次
    };

    ws.onmessage = (event) => {
        let data = JSON.parse(event.data);
        if (data.type === 'heartbeat') {
            console.log('Received server heartbeat');
        }
        // 处理其他消息类型...
    };

    ws.onclose = () => {
        console.log('Disconnected from server');
    };

    ws.onerror = (error) => {
        console.log('WebSocket error: ' + error);
    };


})(jQuery);



