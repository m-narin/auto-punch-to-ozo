const functions = require('@google-cloud/functions-framework');
const puppeteer = require('puppeteer');

OZO3_URL = "https://manage.ozo-cloud.jp/COMPANY_DOMAIN"

const PUPPETEER_OPTIONS = {
  headless: true,
  args: ['--no-sandbox']
};

functions.http('autoPunchToOzo', async (req, res) => {
  try{
    console.log(`自動打刻開始, user_id: ${req.body.user_id}`)
    const browser = await puppeteer.launch(PUPPETEER_OPTIONS);
    console.log('ログインページにアクセス');
    const loginPage = await browser.newPage();
    await loginPage.goto(OZO3_URL);

    console.log('ログイン情報を入力');
    await loginPage.type('#login-name', req.body.user_id);
    await loginPage.type('#login-password', req.body.password);

    console.log('ログイン実行');
    await Promise.all([
        loginPage.waitForNavigation(),
        loginPage.click('#login-btn'),
    ]);

    console.log('勤怠ページにアクセス');
    const attendancePage = await browser.newPage();
    await attendancePage.goto(OZO3_URL);

    let id;
    if(req.body.type === "start"){
      id = "#btn03"
    }else if(req.body.type === "end"){
      id = "#btn04"
    }
    
    const type_name = id === "#btn03" ? "出勤" : "退出"
    console.log(`勤怠を打刻: ${type_name}`);

    const timeout = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Operation timed out after 3 seconds'));
      }, 3000);
    });

    await Promise.race([
      attendancePage.click(`${id} a`),
      timeout
    ]);

    await browser.close();
    console.log('正常に打刻完了しました');
    res.status(200).send("OK");
    
  } catch(error){
    console.log('異常が発生しました');
    res.status(400).send("-休日の勤怠登録は対応していません。\n-入力済みの可能性があります。\n-パラメータに不備がある可能性があります。");
  }

});