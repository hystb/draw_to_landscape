from flask import Flask, render_template, request, send_file
from controlnet_utils import generate_image_from_pil
from PIL import Image
import io
import os
from datetime import datetime

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    prompt = ('a beautiful landscape')
    sketch_file = request.files.get('sketch')

    if not sketch_file:
        return "No sketch uploaded", 400

    # Convertit en image PIL
    image = Image.open(sketch_file.stream).convert("RGB").resize((768, 384))
    
    # Invoque ControlNet
    output_image = generate_image_from_pil(image, prompt)

    # Prépare la réponse
    img_io = io.BytesIO()
    output_image.save(img_io, 'PNG')
    img_io.seek(0)
    return send_file(img_io, mimetype='image/png')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
