import cv2
import pytesseract

# Correct path to the Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'C:\Users\Nithin\Downloads\tesseract.exe'

# Custom Tesseract configuration for better accuracy
custom_config = r'--oem 3 --psm 8 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

# Capture video from webcam
cap = cv2.VideoCapture(0)

while True:
    # Read a frame from the webcam
    ret, frame = cap.read()
    if not ret:
        break

    # Convert to Grayscale Image
    gray_image = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Apply GaussianBlur to reduce noise and improve edge detection
    gray_image = cv2.GaussianBlur(gray_image, (5, 5), 0)

    # Adaptive Thresholding
    gray_image = cv2.adaptiveThreshold(gray_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

    # Canny Edge Detection
    canny_edge = cv2.Canny(gray_image, 100, 200)

    # Find contours based on Edges
    contours, _ = cv2.findContours(canny_edge.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:30]

    # Initialize license Plate contour and x, y, w, h coordinates
    contour_with_license_plate = None
    license_plate = None
    x = None
    y = None
    w = None
    h = None

    # Find the contour with 4 potential corners and create ROI around it
    for contour in contours:
        # Find Perimeter of contour and it should be a closed contour
        perimeter = cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, 0.02 * perimeter, True)
        if len(approx) == 4:  # See whether it is a Rect
            contour_with_license_plate = approx
            x, y, w, h = cv2.boundingRect(contour)
            license_plate = gray_image[y:y + h, x:x + w]
            break

    if license_plate is not None:
        # Removing Noise from the detected image, before sending to Tesseract
        license_plate = cv2.bilateralFilter(license_plate, 11, 17, 17)

        # Apply another threshold to clean up the image
        (thresh, license_plate) = cv2.threshold(license_plate, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # Text Recognition with custom configuration
        text = pytesseract.image_to_string(license_plate, config=custom_config)

        # Post-process the text to clean up any unwanted characters
        text = ''.join(filter(str.isalnum, text))
        print("License Plate:", text)

        # Draw License Plate and write the Text
        frame = cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 3)
        frame = cv2.putText(frame, text, (x - 100, y - 20), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

    # Display the resulting frame
    cv2.imshow('License Plate Detection', frame)

    # Break the loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and close windows
cap.release()
cv2.destroyAllWindows()
