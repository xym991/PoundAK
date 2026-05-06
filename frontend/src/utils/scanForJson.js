export default function scanForJSON(obj) {
  // if (obj && typeof obj === 'object') {
  //   for (const key in obj) {
  //     if (Object.prototype.hasOwnProperty.call(obj, key)) {
  //       const value = obj[key];
  //       if (typeof value === 'string') {
  //         try {
  //           value.replaceAll(/\\"/g,"")
  //           const parsed = JSON.parse(value);
  //           // Call the callback with the parsed data
  //           localStorage.gameData = JSON.stringify({...localStorage.gameData,...parsed});
  //           //console.log (key,parsed)
  //         } catch (e) {
  //           // Not a valid JSON string, continue scanning
  //         }
  //       } else if (typeof value === 'object' && value !== null) {
  //         // Recursively scan nested objects
  //         scanForJSON(value);
  //       }
  //     }
  //   }
  // }
}
