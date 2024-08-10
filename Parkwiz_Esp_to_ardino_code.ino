#include <WiFi.h>
#include <Firebase_ESP_Client.h>

// Provide the token generation process info.
#include <addons/TokenHelper.h>

/* 1. Define the WiFi credentials */
#define WIFI_SSID "selva"
#define WIFI_PASSWORD "selvadinesh"

/* 2. Define the API Key */
#define API_KEY "AIzaSyDzHh_NFw7u4sZyL-WmolXdMMjWu_Ozko0"

/* 3. Define the RTDB URL */
#define DATABASE_URL "https://myproject-8bd37-default-rtdb.asia-southeast1.firebasedatabase.app/" //<databaseName>.firebaseio.com or <databaseName>.<region>.firebasedatabase.app

/* 4. Define the user Email and password that are already registered or added in your project */
#define USER_EMAIL "srilekhaj9171@gmail.com"
#define USER_PASSWORD "9514"

// Define Firebase Data object
FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
uint32_t sendInterval = 2000; // Send data every 2 seconds
int sensorPin = 2; // Replace with the GPIO pin connected to your sensor
int sensorValue = 0;

void setup() {
  Serial.begin(115200);

  // Initialize the digital sensor pin
  pinMode(sensorPin, INPUT);

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);

  /* Assign the API key (required) */
  config.api_key = API_KEY;

  /* Assign the user sign-in credentials */
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Assign the callback function for the long-running token generation task */
  config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

  // Reconnect Wi-Fi automatically
  Firebase.reconnectNetwork(true);

  // Set SSL buffer size for large data transmission
  fbdo.setBSSLBufferSize(4096, 1024);

  // Initialize Firebase with the config and auth objects
  Firebase.begin(&config, &auth);
}

void loop() {
  // Handle authentication tasks and send sensor data to Firebase
  if (Firebase.ready() && (millis() - sendDataPrevMillis > sendInterval || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    // Read the sensor value (digital)
    sensorValue = digitalRead(sensorPin);

    // Send sensor data to Firebase
    Serial.printf("Sending sensor data... %s\n\n", Firebase.RTDB.setInt(&fbdo, "/sensor/data", sensorValue) ? "ok" : fbdo.errorReason().c_str());
  }
}