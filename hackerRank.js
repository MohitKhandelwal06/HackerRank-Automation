const puppeteer = require('puppeteer');
const{email,password}=require("./credentials");
const{answer}=require("./codes");
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
    console.log("links to all ques received");
    // console.log(linksArr);
    //question solve krna h
                              //link to the question to besolved, idx of the linksArr
    let questionWillBeSolvedPromise = questionSolver(linksArr[0], 0);
    for (let i = 1; i < linksArr.length; i++){
      questionWillBeSolvedPromise = questionWillBeSolvedPromise.then(function () {
        return questionSolver(linksArr[i], i);
      })
    }
    return questionWillBeSolvedPromise;
})
.catch(function (err) {
      console.log(err);
});

function waitAndClick(algobtn){
    let waitAndClickPromise=new Promise(function(resolve,reject){
        let waitForSelectorPromise=ctab.waitForSelector(algobtn);
        waitForSelectorPromise
        .then(function(){
            console.log("btn found");
            let clickPromise=ctab.click(algobtn);
            return clickPromise;
        })
        .then(function(){
            console.log("btn is clicked");
            resolve();
        })
        .catch(function (err){
            console.log(err);
        })
    });
    return waitAndClickPromise;
};


function questionSolver(url, idx) {
    return new Promise(function (resolve, reject) {
      let fullLink = `https://www.hackerrank.com${url}`;
      let goToQuesPagePromise = ctab.goto(fullLink);
      goToQuesPagePromise
        .then(function () {
          console.log("question opened");
          //tick the custom input box mark
          let waitForCheckBoxAndClickPromise = waitAndClick(".checkbox-input");
          return waitForCheckBoxAndClickPromise;
        })
        .then(function () {
          //select the box where code will be typed
          let waitForTextBoxPromise = ctab.waitForSelector(".custominput");
          return waitForTextBoxPromise;
        })
        .then(function () {
          let codeWillBeTypedPromise = ctab.type(".custominput", answer[idx]);
          return codeWillBeTypedPromise;
        })
        .then(function () {
          //control key is pressed promise
          let controlPressedPromise = ctab.keyboard.down("Control");
          return controlPressedPromise;
        })
        .then(function () {
          let aKeyPressedPromise = ctab.keyboard.press("a");
          return aKeyPressedPromise;
        })
        .then(function () {
          let xKeyPressedPromise = ctab.keyboard.press("x");
          return xKeyPressedPromise;
        })
        .then(function () {
          let ctrlIsReleasedPromise = ctab.keyboard.up("Control");
          return ctrlIsReleasedPromise;
        })
        .then(function () {
          //select the editor promise
          let cursorOnEditorPromise = ctab.click(
            ".monaco-editor.no-user-select.vs"
          );
          return cursorOnEditorPromise;
        })
        .then(function () {
          //control key is pressed promise
          let controlPressedPromise = ctab.keyboard.down("Control");
          return controlPressedPromise;
        })
        .then(function () {
          let aKeyPressedPromise = ctab.keyboard.press("A",{delay:100});
          return aKeyPressedPromise;
        })
        .then(function () {
          let vKeyPressedPromise = ctab.keyboard.press("V",{delay:100});
          return vKeyPressedPromise;
        })
        .then(function () {
          let controlDownPromise = ctab.keyboard.up("Control");
          return controlDownPromise;
        })
        .then(function () {
          let submitButtonClickedPromise = ctab.click(".hr-monaco-submit");
          return submitButtonClickedPromise;
        })
        .then(function () {
          console.log("code submitted successfully");
          resolve();
        })
        .catch(function (err) {
          reject(err);
        });
    });
  }