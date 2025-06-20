#include <WiFi.h>
#include <HTTPClient.h>
#include <TinyGPSPlus.h>

// WiFi credentials
const char* ssid = "AAiT_Student2";
const char* password = "AAiT@Student!";

// Backend endpoint
const char* serverName = "https://5bf0-197-156-71-66.ngrok-free.app/assets/gps-data";

// GPS setup
HardwareSerial GPS(2); // Use UART2 for GPS
TinyGPSPlus gps;

void setup() {
  Serial.begin(115200);           // Serial monitor
  GPS.begin(9600, SERIAL_8N1, 16, 17); // RX=16, TX=17 for GPS

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void loop() {
  // Read data from GPS module
  while (GPS.available()) {
    gps.encode(GPS.read());
  }

  // If valid GPS location is available
  if (gps.location.isUpdated()) {
    float latitude = gps.location.lat();
    float longitude = gps.location.lng();

    Serial.print("Latitude: ");
    Serial.print(latitude, 6);
    Serial.print(" | Longitude: ");
    Serial.println(longitude, 6);

    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverName); // HTTPS endpoint
      http.addHeader("Content-Type", "application/json");

      String jsonData = "{\"latitude\": " + String(latitude, 6) + ", \"longitude\": " + String(longitude, 6) + "}";
      int httpResponseCode = http.POST(jsonData);

      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);

      http.end();
    } else {
      Serial.println("WiFi Disconnected");
    }

    delay(10000); // Send every 10 seconds
  }
}