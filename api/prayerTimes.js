const axios = require("axios");

module.exports = async (req, res) => {
  console.log("Starting the serverless function...");

  try {
    const apiResponse = await axios.get(
      "https://daily-prayer-times.vercel.app/api"
    );
    const prayerTimes = apiResponse.data;

    const fajr = addZero(prayerTimes.fajr_begins);
    const sunrise = addZero(prayerTimes.sunrise);
    const duhr = addZero(prayerTimes.jumuah_begins);
    const asr = addZero(prayerTimes.asr_begins);
    const maghrib = addZero(prayerTimes.maghrib_begins);
    const isha = addZero(prayerTimes.isha_begins);
    
    function addZero(time) {
      const timeWithoutAmPm = time.replace(/( am| pm)/g, "");
      const parts = timeWithoutAmPm.replace(":", "");
      
      if (parts.length < 4) {
        return "0" + timeWithoutAmPm;
      } else {
        return timeWithoutAmPm;
      }
    }
    

    const jsonData = {
      fajr,
      sunrise,
      duhr,
      asr,
      maghrib,
      isha,
    };

    console.log("Data fetched successfully:", jsonData);

    res.json(jsonData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
