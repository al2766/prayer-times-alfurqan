const axios = require('axios');
const cheerio = require('cheerio');

// Function to convert time to 24-hour format
const convertTo24Hour = (time, isPM = false) => {
  let [hours, minutes] = time.match(/\d{1,2}/g) || [time, '00'];
  hours = parseInt(hours, 10);

  if (isPM && hours < 12) {
    hours += 12;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

module.exports = async (req, res) => {
  try {
    const url = "https://www.alfurqanmcr.org/#popup-menu-anchor";
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const prayerRows = $('th.prayerName').parent();

    let beginsTimes = [];
    let jamahTimes = [];
    let sunriseTime = '';

    prayerRows.each(function() {
      const prayerName = $(this).find('th.prayerName').text().trim();
      let beginsTime, jamahTime;

      if (prayerName === 'Sunrise') {
        sunriseTime = convertTo24Hour($(this).find('td').text().trim().replace(' am', '').replace(' pm', ''));
      } else {
        beginsTime = $(this).find('td.begins').text().trim().replace(' am', '').replace(' pm', '');
        jamahTime = $(this).find('td.jamah').text().trim().replace(' am', '').replace(' pm', '');

        // Convert times to 24-hour format
        beginsTimes.push(convertTo24Hour(beginsTime, ['Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(prayerName)));
        jamahTimes.push(convertTo24Hour(jamahTime, ['Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(prayerName)));
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
  jamahGroupRight
};


    console.log("Data fetched successfully:", prayerTimes);
    res.json(prayerTimes);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
