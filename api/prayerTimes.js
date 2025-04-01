const axios = require("axios");
const cheerio = require("cheerio");

// Function to format time correctly into HH:MM
const formatTime = (timeString) => {
  // Ensure timeString contains at least two numbers
  if (!timeString || timeString.length < 2) return "00:00";

  // Extract hour and minute correctly
  const hour = timeString.slice(0, -2).padStart(2, "0"); // Everything except last two digits
  const minute = timeString.slice(-2); // Last two digits

  return `${hour}:${minute}`;
};

module.exports = async (req, res) => {
  try {
    const url =
      "https://masjidbox.com/prayer-times/alfurqan-islamic-centre-1741893173365/";
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let beginsTimes = [];
    let jamahTimes = [];
    let sunriseTime = "";

    $(".styles__Item-sc-1h272ay-1").each((index, element) => {
      const prayerName = $(element).find(".title span").text().trim();
      const timeRaw = $(element).find(".time.mono").text().trim(); // Get full time string
      const iqamahRaw = $(element).find(".iqamah .time").text().trim(); // Get full iqamah time string

      if (prayerName === "Shuruq") {
        sunriseTime = formatTime(timeRaw);
      } else {
        beginsTimes.push(formatTime(timeRaw));
        jamahTimes.push(formatTime(iqamahRaw));
      }
    });

    // Format the data into groups
    const bothGroupLeft = `        Fajr      Rise    Dhuhr\n⏰ ${beginsTimes[0]}   ${sunriseTime}   ${beginsTimes[1]}\n🕌 ${jamahTimes[0]}   ${sunriseTime}   ${jamahTimes[1]}`;
    const bothGroupRight = `  Asr     Magh     Isha\n${beginsTimes[2]}   ${beginsTimes[3]}   ${beginsTimes[4]}\n${jamahTimes[2]}   ${jamahTimes[3]}   ${jamahTimes[4]}`;

    const beginningGroupleft = `        Fajr      Rise    Dhuhr\n⏰ ${beginsTimes[0]}   ${sunriseTime}   ${beginsTimes[1]}`;
    const beginningGroupRight = `  Asr     Magh     Isha\n${beginsTimes[2]}   ${beginsTimes[3]}   ${beginsTimes[4]}`;

    const jamahGroupleft = `        Fajr      Rise    Dhuhr\n🕌 ${jamahTimes[0]}   ${sunriseTime}   ${jamahTimes[1]}`;
    const jamahGroupRight = `  Asr     Magh     Isha\n${jamahTimes[2]}   ${jamahTimes[3]}   ${jamahTimes[4]}`;

    const prayerTimes = {
      bothGroupLeft,
      bothGroupRight,
      beginningGroupleft,
      beginningGroupRight,
      jamahGroupleft,
      jamahGroupRight,
    };

    console.log("Data fetched successfully:", prayerTimes);
    res.json(prayerTimes);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
