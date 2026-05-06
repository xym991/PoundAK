export default function (input) {
    if (typeof input !== 'string') return input;
  
    try {
      const parsed = JSON.parse(input);
      return parsed;
    } catch (error) {
      return input;
    }
  }
  

  