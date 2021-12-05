import pytesseract
import cv2
import sys

pytesseract.pytesseract.tesseract_cmd = r'OCR\tesseract.exe'

def get_grayscale(image):
  return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

def thresholding(image):
  return cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

def get_text_from_image(image) -> str:

	img = cv2.imread(image)
	pre_img = thresholding(get_grayscale(img))
	custom_config = r'-l eng+rus --psm 6 --oem 3 --tessdata-dir "OCR/tessdata"'
	text = pytesseract.image_to_string(pre_img, config=custom_config)

	return text

print(get_text_from_image(sys.argv[1]))
'''
try:
	im = 'test.jpg'
	print(get_text_from_image(im))
	print(pytesseract.get_languages())
except Exception as ex:
	print(ex)
input()
'''