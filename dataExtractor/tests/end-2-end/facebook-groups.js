const request = require('request');
const api = require('../infrastructure/backend-api');
const prod = true;



// var udpateIndexes = async function () {
//     return new Promise((resolve, reject) => {
//         let url = "http://localhost:1337/advertisements/createAvertisementIndex";
//         if (prod) {
//             url = 'https://automanxbe.herokuapp.com/advertisements/createAvertisementIndex';
//         }
//         request.post({
//             headers: { 'content-type': 'application/json', 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYjdiNjNiNmU1NjZkMDAxOGVhODE4ZSIsImlzQWRtaW4iOnRydWUsImlhdCI6MTU4OTQ0MjU5MywiZXhwIjoxNTkyMDM0NTkzfQ.QAs5cCY5WGSIJGy9q_eNG9MarTHT8mDznLnxYNOBWfc' },
//             url: url
//         }, function (error, response, body) {
//             console.log(error);
//             console.log(response);
//             console.log(body);
//         });
//     });
// };


module.exports = {
    'New groups layout August 2020': function (browser) {

        let groups = [
            "https://www.facebook.com/groups/isleofmanncheapcars",
            "https://www.facebook.com/groups/1408944159352598",
            "https://www.facebook.com/groups/manxusedcars/",
            "https://www.facebook.com/groups/340340052759831/",
            "https://www.facebook.com/groups/218897688471886/",
            "https://www.facebook.com/groups/147262152500945/",
            "https://www.facebook.com/groups/173739226141646/",
            //"https://www.facebook.com/groups/574047002725407/",
            "https://www.facebook.com/groups/306230602806343/",
            "https://www.facebook.com/groups/464155180310237",
            "https://www.facebook.com/groups/451194161748705",
        ];

        var groupsSorted = groups.sort(func);
        function func(a, b) {
            return 0.5 - Math.random();
        }
        for (const group of groupsSorted) {
            
            browser
                .url(group)
                .waitForElementVisible('.rq0escxv.l9j0dhe7.du4w35lb.hybvsw6c.ue3kfks5.pw54ja7n.uo3d90p7.l82x9zwi.ni8dbmo4.stjgntxs.k4urcfbm.sbcfpzgs', 15000)
                .timeoutsAsyncScript(300000)
                .executeAsync(function (callback) {

                    var getPosts = function () {
                        // Get description
                        let getPostDescription = (postElement) => {
                            var result;
                            let description = postElement.querySelector('.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.c1et5uql');
                            if (description) {
                                result = description.textContent;
                            }
                            return result;
                        }
                        // Get pictures
                        let getPictures = (postElement) => {
                            let pictureUrls = [];

                            let postPictureElements = postElement.querySelectorAll('.i09qtzwb.n7fi1qx3.datstx6m.pmk7jnqg.j9ispegn.kr520xx4.k4urcfbm');
                            if (postPictureElements)
                                postPictureElements.forEach(picture => {
                                    pictureUrls.push(picture.src);
                                });
                            return pictureUrls;
                        }

                        let getPriceAndLocation = (postElement, index, selector) => {
                            var result;
                            if (index === undefined) {
                                index = 0;
                            }
                            let priceAndLocation = postElement.querySelectorAll(selector)[index];

                            if (priceAndLocation) {
                                if (priceAndLocation.textContent.indexOf('·') == -1) {
                                    return getPriceAndLocation(postElement, index + 1, selector);
                                }
                                let pl = priceAndLocation.textContent.split('·');
                                if (pl && pl.length === 2) {
                                    result = { price: pl[0].trim(), location: pl[1].trim() };
                                } else if (pl && pl.length === 1) {
                                    result = { price: pl[0].trim() };
                                }
                                return result;
                            }
                        }

                        // Date of creation
                        let getDate = (postElement, selector) => {
                            let element = postElement.querySelector(selector);
                            var currentDate = new Date();
                            var result;
                            if (element && element.attributes["aria-label"] && element.attributes["aria-label"].value) {
                                element.ariaLabel = element.attributes["aria-label"].value;
                            }

                            if (element && element.ariaLabel) {
                                // Minutes
                                if (element.ariaLabel.toLowerCase().indexOf('mins') > -1) {
                                    var minutes = element.ariaLabel.replace(/mins/g, "").replace(/,/g, "");
                                    var millisecondsMinutes = parseFloat(minutes) * 60000;
                                    currentDate.setTime(currentDate.getTime() - millisecondsMinutes);
                                    result = currentDate;
                                }
                                if (element.ariaLabel.toLowerCase().indexOf(' m') > -1) {
                                    var minutes = element.ariaLabel.replace(/ m/g, "").replace(/,/g, "");
                                    var millisecondsMinutes = parseFloat(minutes) * 60000;
                                    currentDate.setTime(currentDate.getTime() - millisecondsMinutes);
                                    result = currentDate;
                                }

                                // Hour
                                if (element.ariaLabel.toLowerCase().indexOf(' h') > -1) {
                                    var minutes = element.ariaLabel.replace(/ h/g, "").replace(/,/g, "");
                                    var millisecondsMinutes = parseFloat(minutes) * 60000 * 60;
                                    currentDate.setTime(currentDate.getTime() - millisecondsMinutes);
                                    result = currentDate;
                                }
                                // Hours
                                if (element.ariaLabel.toLowerCase().indexOf('hrs') > -1) {
                                    var minutes = element.ariaLabel.replace(/hrs/g, "").replace(/,/g, "");
                                    var millisecondsMinutes = parseFloat(minutes) * 60000 * 60;
                                    currentDate.setTime(currentDate.getTime() - millisecondsMinutes);
                                    result = currentDate;
                                }

                                if (!result){
                                    let dateString = getDateString(element);
                                    if (dateString.toLowerCase().indexOf('yesterday') === -1){
                                        return getDateFromDateString(dateString);
                                    }else{
                                        return getDateFromYesterday(dateString);
                                    }
                                }

                                return result;
                            } else {
                                return null;
                            }
                        };

                        let getDateFromYesterday = function(dateString) {
                            var sentences = dateString.split(/\s/);
                            var currentDate = new Date();
                            var yesterdayDate = new Date();
                            yesterdayDate.setDate(currentDate.getDate()-1);
                            var postHourMinute = sentences.find(s => s.indexOf(':') > -1);
                            if (postHourMinute) {
                                var postTime = postHourMinute.split(':');
                                if (postTime && postTime.length === 2) {
                                    yesterdayDate.setHours(parseInt(postTime[0]));
                                    yesterdayDate.setMinutes(parseInt(postTime[1]));
                                }                                
                            }
                            return yesterdayDate;
                        };

                        let getDateFromDateString = function (dateString) {
                            var currentDate = new Date();
                            // Other days
                            var monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'octuber', 'november', 'december'];
                            var monthName = monthNames.find(m => dateString.toLowerCase().indexOf(m) > -1);
                            var monthIndex = monthNames.indexOf(monthName);
                            if (monthIndex > -1) {
                                var sentences = dateString.toLowerCase().split(/\s/);
                                var dayOfMonth = 0;
                                if (sentences.indexOf(monthNames[monthIndex]) === 0) {
                                    dayOfMonth = parseInt(sentences[1]);
                                } else if (sentences.indexOf(monthNames[monthIndex]) === 1) {
                                    dayOfMonth = parseInt(sentences[0]);
                                }

                                var previousDate = new Date(currentDate.getFullYear(), monthIndex, dayOfMonth, 0, 0, 0, 0);
                                var postHourMinute = sentences.find(s => s.indexOf(':') > -1);
                                if (postHourMinute) {
                                    var postTime = postHourMinute.split(':');
                                    previousDate.setHours(parseInt(postTime[0]));
                                    previousDate.setMinutes(parseInt(postTime[1]));
                                }
                                return previousDate;
                            }
                        };

                        let getDateString = function (rootEl, selector) {

                            if (!rootEl)
                                return '';

                            if (!selector)
                                spans = rootEl.querySelectorAll(".b6zbclly.myohyog2.l9j0dhe7.aenfhxwr.l94mrbxd.ihxqhq3m.nc684nl6.t5a262vz.sdhka5h4");

                            let spansGroupText = '';
                            if (spans && spans.length > 0) {

                                for (let index = 0; index < spans.length; index++) {
                                    const element = spans[index];
                                    if (element.style.position === '' && element.textContent.length === 1)
                                        spansGroupText += element.textContent;
                                }
                            }
                            return spansGroupText;
                        }

                        // Permalink
                        let getPermalink = (postElement) => {
                            var result;

                            let elements = postElement.querySelectorAll("a");

                            if (elements) {
                                let element = elements.forEach(e => {
                                    if (e.href.indexOf('permalink') > -1)
                                        result = e.href;
                                }
                                );
                            }
                            return result;
                        }

                        // Title
                        let getTitle = (postElement, index, selector) => {
                            var result;
                            if (!index) index = 0;
                            let element = postElement.querySelector(".oi732d6d.ik7dh3pa.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.jq4qci2q.a3bd9o3v.lrazzd5p.oo9gr5id");
                            if (element) {
                                result = element.textContent;
                            } else {

                                element = postElement.querySelectorAll(".a8c37x1j.ni8dbmo4.stjgntxs.l9j0dhe7.ojkyduve")[index];
                                if (element) {
                                    if (element.textContent.indexOf('·') > -1) {
                                        return getTitle(postElement, index + 1);
                                    }
                                    result = element.textContent;
                                }

                                element = postElement.querySelectorAll(".d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.rrkovp55.jq4qci2q.a3bd9o3v.lrazzd5p.oo9gr5id")[index];
                                if (element) {
                                    if (element.textContent.indexOf('·') > -1) {
                                        return getTitle(postElement, index + 1);
                                    }
                                    result = element.textContent;
                                }
                            }

                            return result;
                        }
                        // Consolidate posts
                        let posts = [];
                        let postElements = document.querySelectorAll('.rq0escxv.l9j0dhe7.du4w35lb.hybvsw6c.ue3kfks5.pw54ja7n.uo3d90p7.l82x9zwi.ni8dbmo4.stjgntxs.k4urcfbm.sbcfpzgs');
                        postElements.forEach(post => {
                            if (post) {
                                let description = getPostDescription(post);
                                let pictures = getPictures(post);
                                let priceAndLoc = getPriceAndLocation(post, 0, '.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.rrkovp55.jq4qci2q.a3bd9o3v.lrazzd5p.oo9gr5id');
                                if (!priceAndLoc) {
                                    priceAndLoc = getPriceAndLocation(post, 0, '.a8c37x1j.ni8dbmo4.stjgntxs.l9j0dhe7.ltmttdrg.g0qnabr5.ojkyduve');
                                } 
                                if (!priceAndLoc){
                                    priceAndLoc = getPriceAndLocation(post, 0 , '.d2edcug0.hpfvmrgz.qv66sw1b.c1et5uql.rrkovp55.jq4qci2q.a3bd9o3v.lrazzd5p.oo9gr5id');
                                }

                                let postDate = getDate(post, '.oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.nc684nl6.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.gmql0nx0.gpro0wi8');
                                if (!postDate) {
                                   postDate = getDate(post, '.oajrlxb2.g5ia77u1.qu0x051f.esr5mh6w.e9989ue4.r7d6kgcz.rq0escxv.nhd2j8a9.nc684nl6.p7hjln8o.kvgmc6g5.cxmmr5t8.oygrvhab.hcukyx3x.jb3vyjys.rz4wbd8a.qt6c0cv9.a8nywdso.i1ao9s8h.esuyzwwr.f1sip0of.lzcic4wl.gmql0nx0.gpro0wi8.b1v8xokw');
                                }
                                let permalink = getPermalink(post);
                                let title = getTitle(post);
                                posts.push(
                                    {
                                        desc: description,
                                        pictures: pictures,
                                        price: priceAndLoc ? priceAndLoc.price : 0,
                                        location: priceAndLoc ? priceAndLoc.location : "",
                                        postedAt: postDate,
                                        permalink: permalink,
                                        title: title
                                    });
                            }
                        });
                        return posts;
                    };

                    let prod = true;
                    let total = prod ? 3 : 1;
                    let load = async function () {
                        for (let i = 0; i < total; i++) {
                            console.log("start");
                            window.scroll(0, 999999);
                            await new Promise(done => setTimeout(() => done(), 5000));
                            console.log("end");
                        }
                        return getPosts();
                    };

                    callback(load());
                }, [], function (posts) {

                    // const fs = require('fs');
                    // let data = JSON.stringify(posts.value);
                    // fs.writeFileSync('student-2.json', data);

                    console.log(`Posts found:${posts.value.length} group:${group}`);
                    api.sendDataToServer(posts.value).then((result) => {
                        //console.log(result);
                    }).catch((err) => {
                        console.log(err);
                    });;

                });
        }

    },

    'Old group layout': function (browser) {

        let groups = [
            "https://www.facebook.com/iompropertyrentals/",
        ];

        var groupsSorted = groups.sort(func);
        function func(a, b) {
            return 0.5 - Math.random();
        }
        for (const group of groupsSorted) {
            browser
                .url(group)
                .waitForElementVisible('.userContentWrapper', 300000)
                .timeoutsAsyncScript(300000)
                .executeAsync(function (callback) {
                    var getPosts = function () {
                        // Get description
                        let getPostDescription = (postElement) => {
                            let userContent = postElement.querySelector('.userContent');
                            let text = "";
                            for (var p of userContent.querySelectorAll("p")) {
                                text += p.textContent;
                                let lineBreak = p.querySelector("br");
                                if (lineBreak)
                                    text += "<br/>";
                            }
                            return text
                        }
                        // Get pictures
                        let getPictures = (postElement) => {
                            let pictureUrls = [];
                            let postPictureElements = postElement.querySelectorAll("a[data-ploi]");
                            if (postPictureElements)
                                postPictureElements.forEach(picture => {
                                    pictureUrls.push(picture.dataset.ploi);
                                });
                            return pictureUrls;
                        }

                        let getPriceAndLocation = (postElement) => {
                            let priceAndLocation = postElement.querySelector("[dir='auto'] > span > span");
                            if (priceAndLocation) {
                                let pl = priceAndLocation.textContent.split('·');
                                if (pl && pl.length === 2) {
                                    return { price: pl[0].trim(), location: pl[1].trim() };
                                } else if (pl && pl.length === 1) {
                                    return { price: pl[0].trim() };
                                }
                            }
                        }

                        // Date of creation
                        let getDate = (postElement) => {
                            let element = postElement.querySelector("[data-utime]");
                            if (element) {
                                var postDate = new Date(element.title.replace(/at/g, "").replace(/,/g, ""));
                                if (postDate.toString() !== "Invalid Date")
                                    return postDate;
                                else {
                                    postDate = new Date(element.title.replace(/at /g, "").replace(/,/g, ""));
                                    return postDate;
                                }
                            } else {
                                element = postElement.querySelector(".timestamp.livetimestamp");
                                var postDate = new Date(element.title.replace(/at/g, "").replace(/,/g, ""));
                                if (postDate !== "Invalid Date")
                                    return postDate;
                                else {
                                    postDate = new Date(element.title.replace(/at /g, "").replace(/,/g, ""));
                                    return postDate;
                                }
                            }
                        }

                        // Permalink
                        let getPermalink = (postElement) => {
                            let element = postElement.querySelector("a[href*='permalink']");
                            if (element) {
                                return element.href;
                            }
                        }

                        // Title
                        let getTitle = (postElement) => {

                            let elements = postElement.querySelectorAll(".l9j0dhe7.stjgntxs.ni8dbmo4 > span");
                            if (elements) {
                                for (const el of elements) {
                                    if (el.textContent)
                                        return el.textContent;
                                }
                            }
                        }
                        // Consolidate posts
                        let posts = [];
                        let postElements = document.querySelectorAll('.userContentWrapper');
                        postElements.forEach(post => {
                            if (post) {
                                let description = getPostDescription(post);
                                let pictures = getPictures(post);
                                let priceAndLoc = getPriceAndLocation(post);
                                let postDate = getDate(post);
                                let permalink = getPermalink(post);
                                let title = getTitle(post);
                                posts.push(
                                    {
                                        desc: description,
                                        pictures: pictures,
                                        price: priceAndLoc ? priceAndLoc.price : 0,
                                        location: priceAndLoc ? priceAndLoc.location : "",
                                        postedAt: postDate,
                                        permalink: permalink,
                                        title: title
                                    });
                            }
                        });
                        return posts;
                    };
                    let prod = true;
                    let total = prod ? 3 : 1;
                    let load = async function () {
                        for (let i = 0; i < total; i++) {
                            console.log("start");
                            window.scroll(0, 999999);
                            await new Promise(done => setTimeout(() => done(), 5000));
                            console.log("end");
                        }

                        return getPosts();
                    };

                    callback(load());
                }, [], function (posts) {

                    // const fs = require('fs');
                    // let data = JSON.stringify(posts.value);
                    // fs.writeFileSync('student-2.json', data);

                    console.log(`Posts found:${posts.value.length}`);
                    api.sendDataToServer(posts.value).then((result) => {
                        console.log(result);
                    }).catch((err) => {
                        console.log(err);
                    });;

                });
        }

        udpateIndexes();
    }


};