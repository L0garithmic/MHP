
// Array of API keys
var API_KEYS = [
'5LWKv1QJmFGCoCj3sno_fAqjbpqynsPivPsDQ5F4poc',
  // Add more API keys here if needed
];

// Index of the last used API key
var lastIndex = 0;

// Custom formula to get address, GPS coordinates, and county
function GET_ADDRESS_INFO(cell) {
  // Retrieve the address from the specified cell
  var address = cell;

  // Get the API key
  var apiKey = API_KEYS[lastIndex];

  // Move to the next API key index
  lastIndex = (lastIndex + 1) % API_KEYS.length;

  // Make a request to HERE Maps API for geocoding
  var apiUrl = 'https://geocode.search.hereapi.com/v1/geocode?q=' + encodeURIComponent(address) + '&apiKey=' + apiKey;

  try {
    var response = UrlFetchApp.fetch(apiUrl);
    var json = response.getContentText();
    var data = JSON.parse(json);

    // Extract the GPS coordinates from the response
    var gpsCoordinates = '';
    if (data.items.length > 0) {
      var latitude = data.items[0].position.lat;
      var longitude = data.items[0].position.lng;
      gpsCoordinates = latitude + ', ' + longitude;
    }

    // Extract the county from the response
    var county = '';
    if (data.items.length > 0) {
      county = data.items[0].address.county;
    }

    // Return the address, GPS coordinates, and county
    return [[address, gpsCoordinates, county]];
  } catch (error) {
    // Retry with the next API key if available
    if (lastIndex !== 0) {
      return GET_ADDRESS_INFO(cell);
    } else {
      // No more API keys to try, return the error message
      return [[address, 'Error: ' + error.message]];
    }
  }
}
