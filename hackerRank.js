const puppeteer = require('puppeteer');
const{email,password}=require("./credentials");

let ctab;


let browserOpenPromise = puppeteer.launch({
    headless:false,
    defaultViewport:null,
    args:["--start-maximized"],
});
browserOpenPromise.then(function(browser){
    console.log("browser is open");

    let allTabPromise=browser.pages();
    return allTabPromise;
})
.then(function(allTabsArr){
    ctab=allTabsArr[0];
    console.log("new Tab");
    let visitingLoginPagePromise=ctab.goto("https://www.hackerrank.com/auth/login");
    return visitingLoginPagePromise;
})
.then(function(){
    console.log("HackerRank Login page opened");
    let emailWillBeTypedpromise=ctab.type("#input-1",email);
    return emailWillBeTypedpromise;
})
.then(function(){
    console.log("email.is typed");
    let passwordWillBeTypedPromise=ctab.type("input[type='password']",password);
    return passwordWillBeTypedPromise;
})
.then(function(){
    console.log("password has been typed");
    let willBeLoggedInPromise = ctab.click(
        ".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled"
      );
      return willBeLoggedInPromise;
})
.then(function () {
      console.log("logged into hackerrank successfully");
      let algorithmTabWillBeOpened=waitAndClick("div[data-automation='algorithms']");
      return algorithmTabWillBeOpened;
})
.then(function(){
    console.log("algorithm page is opened");
    let allQuesPromise=ctab.waitForSelector('a[data-analytics="ChallengeListChallengeName"]');
    return allQuesPromise;
})
.then(function(){
    function getAllQuesLinks(){
        let allElemArr=document.querySelectorAll('a[data-analytics="ChallengeListChallengeName"]');
        let linksArr=[];
        for(let i=0;i<allElemArr.length;i++){
            linksArr.push(allElemArr[i].getAttribute('href'));
        }
        return linksArr;
    }
    console.log("Here");
    let linksArrPromise=ctab.evaluate(getAllQuesLinks);
    return linksArrPromise;
})
.then(function(linksArr){
    console.log(linksArr);
    for(let i=0;i<linksArr.length;i++){
        console.log(ctab.url()+linksArr[i]);
    }
    
})
.catch(function (err) {
      console.log(err);
});

function waitAndClick(algobtn){
    let waitAndClickPromise=new Promise(function(resolve,reject){
        let waitForSelectorPromise=ctab.waitForSelector(algobtn);
        waitForSelectorPromise
        .then(function(){
            console.log("algo btn found");
            let clickPromise=ctab.click(algobtn);
            return clickPromise;
        })
        .then(function(){
            console.log("algo btn is clicked");
            resolve();
        })
        .catch(function (err){
            console.log(err);
        })
    });
    return waitAndClickPromise;
};