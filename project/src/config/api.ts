// כתובת השרת. בענן מגדירים REACT_APP_API_URL, ובמחשב המקומי ברירת המחדל היא localhost:2000
export const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:2000').replace(/\/$/, '');

// תמונות ישנות בפורום נשמרו עם הכתובת המקומית - מחליפים אותה בכתובת השרת הנוכחי
export const fixServerUrl = (url?: string) =>
  url ? url.replace(/^http:\/\/localhost:2000/, API_URL) : url;
