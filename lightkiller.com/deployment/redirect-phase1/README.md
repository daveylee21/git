# Lightkiller 第一批轉址發布說明

狀態：GitHub 原始碼修正與發布包已準備；正式主機、Cloudflare、Google/Bing 尚未套用。
沒有刪除任何舊頁。沒有批量將 199 組舊網址全部轉址。

## 已修正原始碼
- 首頁 IIS 預設文件依序指定 index.html、index.htm。
- 移除 ASP.NET 錯誤導向首頁的 defaultRedirect；保留 RemoteOnly 與原 compilation 設定。
- Sitemap 移除 aspxerrorpath 錯誤網址，首頁暫保留已可開啟的 index.html；根網址修復驗證後再另批統一到 /。
- about.html 與 about.htm 補上相同 canonical（指向 about.html）。
- 全站 href 僅更新 about.htm、room1.htm、room3.htm 三個指定目標，保留其他網址、文字、圖片與版面。
- 其他未確認的舊頁不變更轉址。

## 正式主機部署順序
1. 在 WinSCP 從正式主機下載現行 web.config、sitemap.xml 及本次需覆蓋檔案作備份。發布包 backup-github 是 GitHub 備份，不是正式主機備份，不能當成主機唯一回復來源。
2. 核對現行 web.config 是否與包內 GitHub 備份一致；若主機有其他設定，合併本次差異，不直接覆蓋整份設定。向主機確認 defaultDocument 設定允許委派。
3. 上傳 stage1 對應檔案。先驗證根網址 / 回傳 200 且顯示正確首頁（不帶 aspxerrorpath），以及 index.html、about.html、room1.html、room3.html 正常。
4. 若出現 500／500.19，立即還原正式主機的 web.config；常見原因是 IIS 區段鎖定或主機設定不相容。此套件未在正式 IIS 執行驗證。
5. 主機確認 IIS URL Rewrite 模組已安装並允許設定後，才合併 stage2/web.config.phase2.example 的 rewrite 規則。缺少模組時不得上傳為 web.config。第一批只包含 about.htm、room1.htm、room3.htm 三組。
6. 若改在 Cloudflare 設轉址，依 redirect-map.json 建立精確路徑、301、保留 query 的規則，不再同時套用主機 phase2。避免任何全站 .htm 通用規則。
7. 清除此次變更頁與 Sitemap 的 Cloudflare 快取；核對舊網址 301 → 對應 .html 200、查詢參數保留、無循環，其他 .htm 仍可開啟。
8. 上線後到 Google Search Console 與 Bing Webmaster Tools 提交 Sitemap，檢查三組目標網址及 canonical，再監看流量與索引。未取得帳號資料前無法確認搜尋流量或外部連結。

## 驗證與回復
- 執行 verify_redirects.py；它只有讀取請求，不會修改網站。上線前失敗是預期，不能當成已部署。
- 第一階段回復：還原正式主機的 web.config 及覆蓋檔案。
- 第二階段回復：移除本次三條規則（或停用对应 Cloudflare 規則）；不要刪除舊 .htm。
- 首頁 index.htm/index.html → /、其餘 196 組轉址、8 個未配對舊頁、主機額外歷史網址及真正 404 處理，均待下一批核對。

參考：https://learn.microsoft.com/en-us/iis/configuration/system.webserver/defaultdocument/
參考：https://learn.microsoft.com/en-us/iis/extensions/url-rewrite-module/url-rewrite-module-configuration-reference
參考：https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
