// By Tianfu.D.He@outlook.com

// check if visited in history.
// for efficiency it's stored as a dictionary

vst_dict = JSON.parse(localStorage.getItem("sgamer_topic_visited"));
if (!vst_dict)
    vst_dict = new Object();
var tthre = new Date(localStorage['time_thres']);
home_url = 'http://bbs.sgamer.com/forum-44-1.html';

/*******************Time line***************
Read one topic:
-------->|-------->|-------->|-------->|-------->|-------->|-------->|-------->|
Reply:
          -->|      -->|      -->|      -->|      -->|      -->|      -->|
********************************************/
function famufamu(farm_reps) {
    // count repeats of "get list and farm a round".
    var reps = -1;
    var i = 0;
    var topic_cnt = 0;
    var topic_list = null;
    var success_cnt = 0;

    function uLoop() {
        if (i < topic_cnt) {
            //20 - 45 seconds
            var wtime = parseInt(Math.random() * 25000 + 20000)
            setTimeout(function () {
                console.log('进度：' + (i + 1).toString() + '/' + topic_cnt.toString() + '\t树木ID：' + topic_list[i]);
                var post_ok = true;
                //伐木伐木
                one_tree(topic_list[i]);
                if (post_ok) {
                    success_cnt++;
                    vst_dict[topic_list[i]] = 1;
                    localStorage.setItem('sgamer_topic_visited', JSON.stringify(vst_dict));
                }
                i++;
                uLoop();
            }, wtime);
        } else {
            reps++;
            if (farm_reps - reps) {
                console.log('加载第一版页...等15秒');
                var mw = window.open(home_url);
                setTimeout(function () {
                    console.log('OK开始伐木>>>\n');
                    var list_container = mw.document.getElementById('threadlisttableid');
                    topic_list = new Array();
                    for (var i1 = 0; i1 < list_container.children.length; i1++) {
                        var tmp_post = list_container.children[i1];

                        var tmp_id = tmp_post.id;
                        if (tmp_id.indexOf('normalthread_') == -1)
                            continue;
                        var topic_id = tmp_id.substr(13);
                        var tmp = tmp_post.children[0].children[2].children[1].children[0];
                        if (tmp.className=="xi1")
                        {
                            var topic_time = tmp.children[0].title;
                        }
                        else if(tmp.className=="")
                        {
                            var topic_time = tmp.innerText;
                        }
                        
                        // check if out of date
                        if (new Date(topic_time) < tthre)
                            continue;
                        // check if visited
                        if (vst_dict[topic_id])
                            continue;
                        
                        topic_list.push(topic_id);
                    }
                    topic_cnt = topic_list.length;
                    i = 0;
                    mw.close();
                    uLoop();
                }, 15000);
            }
            else {
                var time_now = new Date();
                if(time_now - tthre > 432000000)
                {
                    localStorage['time_thres'] = time_now.toString();
                    tthre = time_now;
                    localStorage.setItem('sgamer_topic_visited', JSON.stringify(new Object()));
                }
                console.log('伐木' + success_cnt.toString() + '颗，获得' + (success_cnt * 2 / 3).toString() + '积分！');
            }
        }
    }
    uLoop();
}

function one_tree(topic_id) {
    var topic_url = 'http://bbs.sgamer.com/thread-' + topic_id + '-1-1.html';
    tw = window.open(topic_url);
    setTimeout(function () {
        setTimeout(function () {
            tw.close();
        }, 5000);
        var reply = intelij_reply(tw);
        if (reply.length < 12) {
            reply = reply + '            ';
        }
        tw.document.getElementById('vmessage').value = reply;
        tw.document.getElementById('vfastpostform').submit();
    }, 10000);
}

////////////////////////////////////////////////////////////////////////////////
// Intelij modules are implemented here.
// 
// 1. randomly choose what content to post
// 2. try to cover a wide range of content
// 3. try to simply set rules so that the reply is make sense, e.g. given
//    a `ROLL` topic, I should choose '来了来了' or relevant reply sentence.

function intelij_reply(tw) {
    function lz_pid() {
        return tw.document.getElementById('postlist').children[2].id.substr(5);
    }
    function lz_text() {
        console.log('楼主内容');
        var lzpid = lz_pid();
        var content = tw.document.getElementById('postmessage_' + lzpid).innerText;
        return '#在这里快速回复#' + content.substr(Math.max(0, content.length - 12));
    }
    function lz_figure() {
        console.log('楼主头像');
        var lzpid = lz_pid();
        var img_url = null;
        for (var tchild in tw.document.getElementById('favatar' + lzpid).children[3].children)
            if (tchild.className == 'avatar')
                img_url = tchild.children[0].children[0].src;
        return '[img]' + img_url + '[/img]';
    }
    function subject_text() {
        console.log('标题内容');
        return tw.document.getElementById('thread_subject').innerText;
    }
    function sofa_text() {
        console.log('沙发内容');
        var pl = tw.document.getElementById('postlist');
        if (pl.length < 4) {
            return null;
        }
        var msgid = 'postmessage_' + pl.children[3].id.substr(5);
        return tw.document.getElementById(msgid).innerText;
    }
    function select_one_comment() {
        console.log('点评内容');
        // choose one comment if there is.
        // return `null` else.
        function number_of_comments(comments) {
            var len = comments.children.length;
            return Math.min(len - 1, 5);
        }
        var lzpid = lz_pid();
        var comments = tw.document.getElementById('comment_' + lzpid);

        if ((!comments) || (!comments.children.length)) {
            return null;
        }
        var idx = parseInt(Math.random() * number_of_comments(comments)) + 1;
        return comments.children[idx].children[1].innerText.split('\n')[1];
    }



    var r = Math.random();

    // paste comment at the very first!点评往往最经典啊
    var comment = select_one_comment();
    if (comment) {
        if (r < 0.2)
            return "伐木伐木";
        else
            return comment;
    }

    if (r < 0.22) {
        return "伐木伐木"
    } else if (r < 0.66) {
        if (r < 0.30) return lz_figure();
        return lz_text();
    } else {
        var sofa = sofa_text();
        if (!sofa)
            return subject_text();
        else
            return sofa;
    }
}

famufamu(3);