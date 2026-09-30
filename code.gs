// 你的 Google Drive 資料夾 ID
const FOLDER_ID = '1T-MTKPe9EM_OYWM7NOH7eYR_YYh7MY6V';

// 將網頁畫面渲染出來
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('照片上傳系統')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1'); // 讓手機端畫面比例正確
}

// 接收前端傳來的 base64 影像資料並上傳到雲端硬碟
function uploadImage(base64Data, fileName) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const splitBase = base64Data.split(',');
    const type = splitBase[0].split(';')[0].replace('data:', '');
    const byteCharacters = Utilities.base64Decode(splitBase[1]);
    
    // 建立 Blob 物件以轉換成檔案
    const blob = Utilities.newBlob(byteCharacters, type, fileName);
    const file = folder.createFile(blob);
    
    return {
      success: true,
      message: '上傳成功！',
      fileId: file.getId(),
      url: file.getUrl()
    };
  } catch (error) {
    return { success: false, message: error.toString() };
  }
}

// 取得資料夾內的圖片歷史紀錄
function getImages() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFiles();
  let imageList = [];
  
  // 遍歷資料夾中的檔案
  while (files.hasNext()) {
    const file = files.next();
    const mimeType = file.getMimeType();
    
    // 只抓取圖片類型的檔案
    if (mimeType.indexOf('image/') === 0) {
      imageList.push({
        id: file.getId(),
        name: file.getName(),
        // 取得縮圖連結
        thumbnail: 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w200-h200',
        // 取得可直接顯示的原圖連結
        viewUrl: 'https://drive.google.com/uc?id=' + file.getId()
      });
    }
  }
  
  // 依時間反向排序，讓新上傳的在最前面 (選用，依需求而定)
  return imageList.reverse();
}