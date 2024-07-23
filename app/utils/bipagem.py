import cv2
from pyzbar.pyzbar import decode
import numpy as np

def gen():
    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        decoded_objects = decode(frame)
        for obj in decoded_objects:
            points = obj.polygon
            if len(points) == 4:
                pts = np.array([[point.x, point.y] for point in points], dtype=np.int32)
                pts = pts.reshape((-1, 1, 2))
                cv2.polylines(frame, [pts], True, (0, 0, 255), 3)

            barcode_data = obj.data.decode("utf-8")
            barcode_type = obj.type
            cv2.putText(frame, f'{barcode_data} ({barcode_type})', (obj.rect.left, obj.rect.top - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

        ret, jpeg = cv2.imencode('.jpg', frame)
        frame = jpeg.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')